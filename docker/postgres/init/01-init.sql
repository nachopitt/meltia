-- PostgreSQL Initialization for Meltia (MedusaJS)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Ensure test database exists for automated testing
SELECT 'CREATE DATABASE meltia_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'meltia_test')\gexec
