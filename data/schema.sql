DROP TABLE IF EXISTS mission;
<<<<<<< HEAD
DROP TABLE IF EXISTS signup;


=======
DROP TABLE if EXISTS outlook;
DROP TABLE if EXISTS booking;
>>>>>>> master
CREATE TABLE mission (
    id SERIAL PRIMARY KEY,
    year VARCHAR(255),
    date VARCHAR(255),
    description TEXT,
    name VARCHAR(255),
<<<<<<< HEAD
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
=======
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

CREATE TABLE booking (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255),
    image VARCHAR(255),
    net VARCHAR(255),
    -- agencies VARCHAR(255),
    description TEXT 
);
>>>>>>> master
