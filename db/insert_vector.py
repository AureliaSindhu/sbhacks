import singlestoredb
import json
import numpy as np
import sys
import os
import logging

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

# 1. Set Environment Variables
os.environ['SINGLESTORE_HOST'] = 'svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com'
os.environ['SINGLESTORE_PORT'] = '3333'
os.environ['SINGLESTORE_USER'] = 'sb'
os.environ['SINGLESTORE_PASSWORD'] = '1qus8i7myhm3NUQS0TX0dFoge7lvA1ip'
os.environ['SINGLESTORE_DATABASE'] = 'db_aurelia_7d548'

HOST = os.getenv('SINGLESTORE_HOST')
PORT = int(os.getenv('SINGLESTORE_PORT', 3306))
USER = os.getenv('SINGLESTORE_USER')
PASSWORD = os.getenv('SINGLESTORE_PASSWORD')
DATABASE = os.getenv('SINGLESTORE_DATABASE')

if not all([HOST, PORT, USER, PASSWORD, DATABASE]):
    logging.error("One or more environment variables for connection parameters are missing.")
    sys.exit(1)

try:
    connection = singlestoredb.connect(
        host=HOST,
        port=PORT,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )
    cursor = connection.cursor()
    logging.info("Successfully connected to SingleStore.")
except singlestoredb.Error as e:
    logging.error(f"SingleStore Error: {e}")
    sys.exit(1)
except Exception as e:
    logging.error(f"Unexpected Error: {e}")
    sys.exit(1)

# 4. Create Table
create_table_query = """
CREATE TABLE IF NOT EXISTS vectors_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vector VECTOR(128) NOT NULL,
    metadata JSON
);
"""
try:
    cursor.execute(create_table_query)
    connection.commit()
    logging.info("Table 'vectors_table' is ready.")
except singlestoredb.Error as e:
    logging.error(f"SingleStore Error while creating table: {e}")
    cursor.close()
    connection.close()
    sys.exit(1)
except Exception as e:
    logging.error(f"Unexpected Error while creating table: {e}")
    cursor.close()
    connection.close()
    sys.exit(1)

# 4a. Create Vector Index (HNSW for cosine similarity)
def index_exists(cursor, index_name, table_name):
    """
    Checks if an index with the given name exists on the specified table.
    """
    check_query = """
    SELECT COUNT(*)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = %s
      AND index_name = %s;
    """
    cursor.execute(check_query, (table_name, index_name))
    result = cursor.fetchone()
    return result[0] > 0

index_name = "vector_idx"
table_name = "vectors_table"

if not index_exists(cursor, index_name, table_name):
    create_index_query = f"""
    CREATE INDEX {index_name}
    USING HNSW (vector)
    WITH (
        dim=128,
        distance='cosine',
        m=16,
        ef_construction=200
    );
    """
    try:
        cursor.execute(create_index_query)
        connection.commit()
        logging.info(f"Vector index '{index_name}' created successfully.")
    except singlestoredb.Error as e:
        logging.error(f"SingleStore Error while creating index: {e}")
        cursor.close()
        connection.close()
        sys.exit(1)
    except Exception as e:
        logging.error(f"Unexpected Error while creating index: {e}")
        cursor.close()
        connection.close()
        sys.exit(1)
else:
    logging.info(f"Vector index '{index_name}' already exists.")

# 5. Prepare Bulk Insert
vector_dimension = 128
data_to_insert = [
    (np.random.rand(vector_dimension).tolist(), {"name": "vector1", "description": "test vector 1"}),
    (np.random.rand(vector_dimension).tolist(), {"name": "vector2", "description": "test vector 2"}),
    (np.random.rand(vector_dimension).tolist(), {"name": "vector3", "description": "test vector 3"}),
    (np.random.rand(vector_dimension).tolist(), {"name": "vector4", "description": "test vector 4"}),
    (np.random.rand(vector_dimension).tolist(), {"name": "vector5", "description": "test vector 5"})
]

formatted_data = []
for vector, metadata in data_to_insert:
    if len(vector) != vector_dimension:
        logging.error(f"Vector dimensionality mismatch: expected {vector_dimension}, got {len(vector)}")
        cursor.close()
        connection.close()
        sys.exit(1)
    vector_json = json.dumps(vector)
    formatted_data.append((vector_json, json.dumps(metadata)))

insert_query = """
INSERT INTO vectors_table (vector, metadata)
VALUES (%s, %s);
"""
try:
    cursor.executemany(insert_query, formatted_data)
    connection.commit()
    logging.info(f"Inserted {cursor.rowcount} rows into 'vectors_table'.")
except singlestoredb.Error as e:
    logging.error(f"SingleStore Error while inserting data: {e}")
    cursor.close()
    connection.close()
    sys.exit(1)
except Exception as e:
    logging.error(f"Unexpected Error while inserting data: {e}")
    cursor.close()
    connection.close()
    sys.exit(1)

# 6. Vector Search Function
def search_vectors(query_vector, top_t=5):
    if isinstance(query_vector, np.ndarray):
        query_vector = query_vector.tolist()
    elif not isinstance(query_vector, list):
        logging.error("Query vector must be a list or numpy array.")
        return []
    if len(query_vector) != vector_dimension:
        logging.error(f"Vector dimensionality mismatch: expected {vector_dimension}, got {len(query_vector)}")
        return []

    # Construct the VECTOR literal
    vector_literal = ', '.join(map(str, query_vector))

    # SQL query to compute cosine similarity and retrieve top_t vectors
    # SingleStore's HNSW index optimizes this search
    search_query = f"""
    SELECT 
        id, 
        COSINE_SIMILARITY(vector, VECTOR({vector_literal})) AS similarity,
        metadata
    FROM vectors_table
    ORDER BY similarity DESC
    LIMIT {top_t};
    """
    try:
        cursor.execute(search_query)
        results = cursor.fetchall()
        return results
    except singlestoredb.Error as e:
        logging.error(f"SingleStore Error while searching vectors: {e}")
        return []
    except Exception as e:
        logging.error(f"Unexpected Error while searching vectors: {e}")
        return []

# 7. Mock a Search
def mock_search():
    query_vector = np.random.rand(vector_dimension).tolist()
    top_t = 3
    logging.info("Performing a mock search with a random query vector...")
    results = search_vectors(query_vector, top_t)
    if not results:
        logging.info("No results found.")
        return
    logging.info(f"Top {top_t} similar vectors:")
    for row in results:
        vector_id, similarity, metadata_json = row
        metadata = json.loads(metadata_json)
        logging.info(f"ID: {vector_id}, Similarity: {similarity:.4f}, Metadata: {metadata}")

mock_search()

# 8. Clean Up
cursor.close()
connection.close()
logging.info("Connection to SingleStore closed.")
