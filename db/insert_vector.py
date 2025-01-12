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
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
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

# Validate that all parameters are available
if not all([HOST, PORT, USER, PASSWORD, DATABASE]):
    logging.error("One or more environment variables for connection parameters are missing.")
    sys.exit(1)

# 3. Establish Connection to SingleStore
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

# 4. Create Table with Vector and Metadata Columns
create_table_query = """
CREATE TABLE IF NOT EXISTS vectors_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vector VECTOR(128) NOT NULL,  -- Adjust the dimension as needed
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

# 5. Prepare Multiple Vectors and Metadata for Bulk Insert
vector_dimension = 128

# Example list of vectors and metadata
data_to_insert = [
    (np.random.rand(vector_dimension).tolist(), {"name": "vector1", "description": "test vector 1"}),
    (np.random.rand(vector_dimension).tolist(), {"name": "vector2", "description": "test vector 2"}),
    (np.random.rand(vector_dimension).tolist(), {"name": "vector3", "description": "test vector 3"}),
    (np.random.rand(vector_dimension).tolist(), {"name": "vector4", "description": "test vector 4"}),
    (np.random.rand(vector_dimension).tolist(), {"name": "vector5", "description": "test vector 5"})
]

# Prepare and format data for insertion
formatted_data = []
for vector, metadata in data_to_insert:
    if len(vector) != vector_dimension:
        logging.error(f"Vector dimensionality mismatch: expected {vector_dimension}, got {len(vector)}")
        cursor.close()
        connection.close()
        sys.exit(1)
    
    # Ensure the vector is a JSON array
    vector_json = json.dumps(vector)
    formatted_data.append((vector_json, json.dumps(metadata)))

# Bulk Insert Data into the Table
insert_query = """
INSERT INTO vectors_table (vector, metadata)
VALUES (%s, %s);
"""

try:
    cursor.executemany(insert_query, formatted_data)
    connection.commit()
    logging.info(f"Inserted {cursor.rowcount} rows successfully into 'vectors_table'.")
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