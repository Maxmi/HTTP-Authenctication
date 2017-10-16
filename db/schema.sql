DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  email varchar(255) UNIQUE,
  password varchar(255) NOT NULL
);