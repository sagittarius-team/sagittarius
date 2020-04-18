DROP TABLE IF EXISTS mission;
DROP TABLE if EXISTS outlook;
CREATE TABLE mission (
    id SERIAL PRIMARY KEY,
    year VARCHAR(255),
    date VARCHAR(255),
    description TEXT,
    name VARCHAR(255),
    vidURL VARCHAR(255),
    img VARCHAR(255)
);

CREATE TABLE outlook (
    name VARCHAR (255),
    image VARCHAR(255),
    net VARCHAR(255),
    -- agencies VARCHAR(255),
    description TEXT 
);