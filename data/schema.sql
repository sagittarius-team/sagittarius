DROP TABLE IF EXISTS mission;
DROP TABLE IF EXISTS signup;
DROP TABLE IF EXISTS signIn;
DROP TABLE if EXISTS outlook;
DROP TABLE if EXISTS booking;
DROP TABLE if EXISTS today;
-- Yosef
CREATE TABLE mission (
    id SERIAL PRIMARY KEY,
    year VARCHAR(255),
    date VARCHAR(255),
    description TEXT,
    name VARCHAR(255),
    vidurl VARCHAR(255),
    img VARCHAR(255) DEFAULT 'https://media.wired.com/photos/5bdb590f9767b57847fe4222/master/pass/soyuz.jpg'
);

-- Esraa
CREATE TABLE signup(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    day NUMERIC,
    month VARCHAR(255),
    year NUMERIC,
    gender VARCHAR(255),
    isAgree VARCHAR(255),
    criedt NUMERIC 
);
-- Abdallah
CREATE TABLE outlook (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255),
    image VARCHAR(255),
    net VARCHAR(255),
    agencies VARCHAR(255),
    description TEXT,
    cost NUMERIC
);
-- Sondos
CREATE TABLE booking (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255),
    image VARCHAR(255),
    net VARCHAR(255),
    agencies VARCHAR(255),
    description TEXT,
    cost NUMERIC
);
CREATE TABLE signIn(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    day NUMERIC,
    month VARCHAR(255),
    year NUMERIC,
    gender VARCHAR(255),
    isAgree VARCHAR(255),
    criedt NUMERIC 
);
CREATE TABLE today(
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    date VARCHAR(255)
);

