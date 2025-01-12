import singlestoredb
import os
import json
import logging
import numpy as np
import openai

from dotenv import load_dotenv

load_dotenv()

vector_dimension = 3072
top_t = 1

# 1. Set Environment Variables
HOST = os.getenv("SINGLESTORE_HOST")
PORT = int(os.getenv("SINGLESTORE_PORT", 3306))
USER = os.getenv("SINGLESTORE_USER")
PASSWORD = os.getenv("SINGLESTORE_PASSWORD")
DATABASE = os.getenv("SINGLESTORE_DATABASE")


current_article = None


def get_current_article():
    global current_article
    return str(current_article)


def set_current_article(article):
    global current_article
    current_article = article


def search_for_notes(query: str):
    print(f"Searching for notes for query: {query}")
    connection = singlestoredb.connect(
        host=HOST, port=PORT, user=USER, password=PASSWORD, database=DATABASE
    )
    cursor = connection.cursor()

    def search_vectors(query_vector):
        if isinstance(query_vector, np.ndarray):
            query_vector = query_vector.tolist()
        elif not isinstance(query_vector, list):
            logging.error("Query vector must be a list or numpy array.")
            return []
        if len(query_vector) != vector_dimension:
            logging.error(
                f"Vector dimensionality mismatch: expected {vector_dimension}, got {len(query_vector)}"
            )
            return []

        # Convert query vector to JSON array
        query_vector_json = json.dumps(query_vector)

        # SQL query to compute cosine similarity and retrieve top_t vectors
        # SingleStore's HNSW index optimizes this search
        search_query = """
        SELECT 
            id, 
            dot_product(vector, JSON_ARRAY_PACK(%s)) AS similarity,
            file_name,
            summary,
            content
        FROM vectors_table
        ORDER BY similarity DESC
        LIMIT %s;
        """
        try:
            cursor.execute(search_query, (query_vector_json, top_t))
            results = cursor.fetchall()
            return results
        except singlestoredb.Error as e:
            logging.error(f"SingleStore Error while searching vectors: {e}")
            return []
        except Exception as e:
            logging.error(f"Unexpected Error while searching vectors: {e}")
            return []

    embedding = openai.embeddings.create(
        input=query,
        model="text-embedding-3-large",
        encoding_format="float",
    )
    print("Got embedding")
    result = search_vectors(embedding.data[0].embedding)
    print("Got result")
    row = result[0]
    print("Got row")
    vector_id, similarity, file_name, summary, content = row
    print(row)
    set_current_article(content)
    cursor.close()
    connection.close()
    return {
        "vector_id": vector_id,
        "similarity": similarity,
        "file_name": file_name,
        "summary": summary,
        "content": content,
    }
