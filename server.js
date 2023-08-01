const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const app = express();
app.use(express.json);
app.use(express.urlencoded({ extended: true }));

let depdb = ['Human Resources',"Integrated Technologies","Project Management","Grassroots"];
let employeedb = ["Sam Henson", "Spencer Keiser", "Kecia Bonet", "Asher France"];
let roledb = ["Director of HR","Senior Software Engineer","Junior Wed-Developer","Junior Assistant of HR","Senior Web-Developer","Project Manager","Customer Service"];

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'puppys101!',
        database: 'departments_db'
    },
    console.log(`Connected to departments_db database.`)
);

let question = '';

let inquired = function() {
    return inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select an option:',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'exit\n'],
                name: 'choice',
            },
        ])
        .then((response) => {
            question = response.choice;
            if (question === 'view all departments') {
                viewDepart();
                setTimeout(() => {
                    inquired();
                }, 1000);
            }
            else if (question === 'add a department') {
                addDepart();
                setTimeout(() => {
                    inquired();
                }, 7000);
            }
            else if (question === 'view all roles') {
                viewRoles();
                setTimeout(() => {
                    inquired();
                }, 1000);
            }
            else if (question === 'view all employees') {
                viewEmployees();
                setTimeout(() => {
                    inquired();
                }, 1000);
            }
            else if (question === 'add a role') {
                addRole();
                setTimeout(() => {
                    inquired();
                }, 15000);
            }
            else if (question === 'add an employee') {
                addEmployee();
                setTimeout(() => {
                    inquired();
                }, 20000);
            }
            else if (question === 'update an employee role') {
                editEmployee();
                setTimeout(() => {
                    inquired();
                }, 20000);
            }
            else {
                return;
            }
        })
};
let viewDepart = async () => {
    db.query('SELECT * FROM departments', function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('\n');
        results.forEach((element) => {
            depdb.push(element.id);
            console.log(element.id, element.department_name);
        });
        console.log('\n');
    });
};
let viewRoles = async () => {
    const sql = `SELECT roles.id AS roles, roles.job_title, roles.job_salary, departments.department_name FROM departments LEFT JOIN roles ON departments.id = roles.job_department ORDER BY roles.id`;
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('\n');
        results.forEach((element) => {
            console.log("| "+element.roles, " | "+element.job_title, " | "+element.job_salary, " | "+element.department_name+" |");
        });
        console.log('\n');
    });
};
let viewEmployees = async () => {
    const sql = `SELECT employees.id AS employee, employees.employee_firstname, employees.employee_lastname, employees.employee_manager, roles.job_title FROM roles LEFT JOIN employees ON roles.id = employees.role_id ORDER BY employees.id`;
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('\n');
        results.forEach((element) => {
            console.log("| "+element.employee, " | "+element.employee_firstname, element.employee_lastname, " | "+element.employee_manager, " | "+element.job_title+" |");
        });
        console.log('\n');
    });
};
let addDepart = async () => {
    inquirer
     .prompt([
        {
            type: 'input',
            message: 'Please enter the name of the department you would like to add: ',
            name: 'departName',
        },
     ])
     .then(response => {
        const sql = `INSERT INTO departments (department_name)
            VALUES (?)`;
        const params = response.departName;
        depdb.push(response.departName);
        console.log(params);
        db.query(sql, params, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('successfully added');
            return;
        });
     })
};
let addRole = async () => {
    inquirer
    .prompt([
       {
            type: 'input',
            message: 'Please enter the name of the job you would like to add: ',
            name: 'roleName',
       },
       {
            type: 'input',
            message: 'What is the salary for this job? ',
            name: 'roleSalary',
       },
       {
            type: 'list',
            message: 'What department does the job belong to?',
            choices: depdb,
            name: 'roleDepart',
       },
    ])
    .then(response => {
        let newroledepart = 0;
       const sql = `INSERT INTO roles (job_department, job_salary, job_title)
           VALUES (?, ?, ?)`;
        roledb.push(response.roleName);
        for (let i=0; i<depdb.length; i++) {
            if (response.roleDepart===depdb[i]) {
                newroledepart = i+1;
            }
        }
       const params = [newroledepart, response.roleSalary, response.roleName];
       db.query(sql, params, (err, results) => {
           if (err) {
               console.log(err);
               return;
           }
           console.log('successfully added');
           return;
       });
    })
};
let addEmployee = async () => {
    inquirer
    .prompt([
       {
            type: 'input',
            message: 'Please enter the first name of the employee you would like to add: ',
            name: 'firstname',
       },
       {
        type: 'input',
        message: 'Please enter the last name of the employee you would like to add: ',
        name: 'lastname',
        },
       {
            type: 'list',
            message: "What is the employee's job? ",
            choices: roledb,
            name: 'employeejob',
       },
       {
            type: 'list',
            message: "Who is the employee's manager?",
            choices: employeedb,
            name: 'manager',
       },
    ])
    .then(response => {
        let newemployeejob = 0;
        let newemployeemanager = 0;
        let fullname = response.firstname+" "+response.lastname;
       const sql = `INSERT INTO employees (employee_firstname, employee_lastname, role_id, employee_manager)
           VALUES (?, ?, ?, ?)`;
        for (let i=0; i<roledb.length; i++) {
            if (response.employeejob===roledb[i]) {
                newemployeejob = i+1;
            }
        }
        for (let y=0; y<employeedb.length; y++) {
            if (response.manager === "None") {
                newemployeemanager = NULL;
            }
            else if (response.manager === employeedb[y]) {
                newemployeemanager = y+1;
            }
        }
        employeedb.push(fullname);
       const params = [response.firstname, response.lastname, newemployeejob, newemployeemanager];
       db.query(sql, params, (err, results) => {
           if (err) {
               console.log(err);
               return;
           }
           console.log('successfully added');
           return;
       });
    })
};

let editEmployee = async () => {
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'What is the employee you would like to update?',
            choices: employeedb,
            name: 'employee',
        },
        {
            type: 'list',
            message: 'What is the employees new role?',
            choices: roledb,
            name: 'newJob',
        },
    ])
    .then(response => {
        let newemployeejob = 0;
        let employeeid = 0;
        for (let i=0; i<roledb.length; i++) {
            if (response.newJob===roledb[i]) {
                newemployeejob = i+1;
            }
        }
        for (let y=0; y<employeedb; y++) {
            if (response.employee === employeedb[y]) {
                employeeid = y+1;
            }
        }
        const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
        const params = [newemployeejob, employeeid];
        db.query(sql, params, (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Employee updated');
            }
        });
    })
};

inquired();
