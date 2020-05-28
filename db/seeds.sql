-- Add department & role tables first
USE cms_db;

INSERT INTO department (name) VALUES ('Office of the Registrar');
INSERT INTO department (name) VALUES ('Admissions Office');

USE cms_db;

INSERT INTO `role` (title, salary, department_id) VALUES ('Registrar', 50000, 1);
INSERT INTO `role` (title, salary, department_id) VALUES ('Administrative Assistant', 35000, 1);
INSERT INTO `role` (title, salary, department_id) VALUES ('Office Assistant', 30000, 1);
INSERT INTO `role` (title, salary, department_id) VALUES ('Director', 60000, 2);
INSERT INTO `role` (title, salary, department_id) VALUES ('Office Manager', 40000, 2);

-- Add Manager first from employee table
USE cms_db;
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Allie', 'McBeal', 5);
-- Add second other non-manager employees
USE cms_db;
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Manny', 'Sanders', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Lucy', 'Bailey', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Alonso', 'LLamas', 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Gina', 'Pinati', 3, 1);
-- Select all from each table
USE cms_db;
SELECT * FROM employee;
SELECT * FROM department;
SELECT * FROM `role`;
