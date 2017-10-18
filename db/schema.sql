DROP DATABASE IF EXISTS http_auth;
CREATE DATABASE http_auth;

-- \c http_auth

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email varchar(255) UNIQUE,
  password varchar(255) NOT NULL
);

