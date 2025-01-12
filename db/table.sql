CREATE TABLE IF NOT EXISTS vectors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vector BLOB, 
    metadata JSON
);

INSERT INTO vectors (vector, metadata) 
VALUES 
    (REPEAT("a", 3072), JSON_OBJECT("key", "value")), -- Mock binary data and metadata
    (REPEAT("b", 3072), JSON_OBJECT("another_key", "another_value"));
