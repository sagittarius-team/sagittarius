DROP TABLE IF EXISTS sign

CREATE TABLE sign(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password NUMERIC ,
    email VARCHAR(255),
    birthday VARCHAR(255),
    gender VARCHAR(255),
credit NUMERIC     
);