--DROP DATABASE IF EXISTS opendota;
--CREATE DATABASE opendota;

--\c opendota

-- Database Initialization
CREATE TABLE opendota_request (
  ID SERIAL PRIMARY KEY,
  input JSON NOT NULL,
  result JSON,
  create_date TIMESTAMP NOT NULL 
);



