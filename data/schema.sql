DROP TABLE IF EXISTS mission;
DROP TABLE IF EXISTS signup;


CREATE TABLE mission (
    id SERIAL PRIMARY KEY,
    date VARCHAR(255),
    description VARCHAR(255),
    name VARCHAR(255),
    vidURLs VARCHAR(255)
);


CREATE TABLE signup(
    id SERIAL ,
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

INSERT INTO signup(username,password,email,day,month,year,gender,isAgree,criedt) VALUES ('esraa',12345678,'ma.esraa@hotmail.com',24,'December',1997,'female','agree',99999);

ALTER TABLE signup
ADD CONSTRAINT PK_signup PRIMARY KEY (id,username,email);