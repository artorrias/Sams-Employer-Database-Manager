INSERT INTO departments (department_name)
VALUES  ("Human Resources"),
        ("Integrated Technologies"),
        ("Project Management"),
        ("Grassroots");

INSERT INTO roles (job_department, job_salary, job_title)
VALUES  (1, 80000, "Director of HR"),
        (2, 115000, "Senior Software Engineer"),
        (2, 100000, "Junior Wed-Developer"),
        (1, 100000, "Junior Assistant of HR"),
        (4, 30000, "Customer Service");

INSERT INTO employees(employee_firstname, employee_lastname, role_id, employee_manager)
VALUES  ('Sam', 'Henson', 2, 3),
        ('Spencer', 'Keiser', 1, 3),
        ('Kecia', 'Bonet', 4, NULL),
        ('Asher', 'France', 3, 3),
        ('Ken', 'Pratt', 5, NULL);