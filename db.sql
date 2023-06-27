CREATE DATABASE pern_app;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
   user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_name VARCHAR(100) NOT NULL,
   user_email VARCHAR(100) NOT NULL,
   user_password VARCHAR(255) NOT NULL
)

INSERT INTO users (user_name,user_email,user_password)
VALUES ('Jan','jandzban@wp.pl','123');


CREATE TABLE expenses (
   expense_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id uuid REFERENCES users(user_id),
   expense_category VARCHAR(50) NOT NULL,
   expense_title VARCHAR(100),
   expense_amount DECIMAL NOT NULL,
   date DATA
)

SELECT * FROM expenses WHERE user_id = 'c478157c-d4de-4c23-8078-a6c21c305cd3';

INSERT INTO expenses(user_id, expense_category, expense_title, expense_amount, expense_date)
VALUES ('c478157c-d4de-4c23-8078-a6c21c305cd3', 'jedzenie','Kebab AMIR',19.99, '2023-06-21');