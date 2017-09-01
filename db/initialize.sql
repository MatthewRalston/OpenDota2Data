--DROP DATABASE IF EXISTS opendota;
--CREATE DATABASE opendota;

--\c opendota

-- Database Initialization
CREATE TABLE opendota_request (
  ID PRIMARY KEY,
  input JSON NOT NULL,
  result JSON,
  create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  complete_date TIMESTAMP
);



