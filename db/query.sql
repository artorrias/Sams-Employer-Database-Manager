SELECT roles.id AS roles, roles.job_title, roles.job_salary, departments.department_name
FROM departments
LEFT JOIN roles
ON departments.id = roles.job_department
ORDER BY roles.id