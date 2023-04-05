\echo 'Delete and recreate library db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE library;
CREATE DATABASE library;
\connect library

\i library-schema.sql

\echo 'Delete and recreate library db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE library;
CREATE DATABASE library;
\connect library

\i library-schema.sql