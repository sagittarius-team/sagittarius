DROP TABLE IF EXISTS mission;

CREATE TABLE mission (
    id SERIAL PRIMARY KEY,
    date VARCHAR(255),
    description VARCHAR(255),
    name VARCHAR(255),
    vidURLs VARCHAR(255)
);