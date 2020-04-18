DROP TABLE IF EXISTS mission;

CREATE TABLE mission (
    id SERIAL PRIMARY KEY,
    year VARCHAR(255),
    date VARCHAR(255),
    description TEXT,
    name VARCHAR(255),
    vidURL VARCHAR(255),
    img VARCHAR(255)
);