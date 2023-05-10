const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const fs = require("fs/promises");


const mainMenu = () => {
    return inquirer.prompt([
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"]
    }
    ])
    .then((answer) => {
        console.log(answer)

    if (answer === "View all departments") {
        viewDepart()
    };

    if (answer === "View all roles") {
        viewRole()
    };
    
    if (answer === "View all employees") {
        viewEmp()
    };

    if (answer === "Add a department") {
        addDepart()
    };

    if (answer === "Add a role") {
        addRole()
    };

    if (answer === "Add an employee") {
        addEmp()
    };

    if (answer === "Update an employee role") {
        updateEmpRole()
    }
    })
};

const viewDepart = () => {
    // present table showing department names and department ids
}

const viewRole = () => {
    // present job title, role id, department that that role belongs to, salary for that role
}

const viewEmp = () => {
    // table showing emplyee data; employee id, first name, last name, job titles, departments, salaries, managers that that employee reports to
}

const addDepart = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What department would you like to add ?"
        }
    ])
    .then((answer) => {
        console.log(answer)
        // add department to the database
    })
}

const addRole = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "role",
            message: "What role would you like to add?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?"
        },
        {
            type: "input",
            name: "department",
            message: "What department does this role belong to?"
        }

        //add role to database
    ])
}

const addEmp = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the emplyees first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employees last name?"
        },
        {
            type: "input",
            name: "role",
            message: "What is the employees role?"
        },
        {
            type: "input",
            name: "manager",
            message: "What manager will this employee report to?"
        }
    ])
    .then((answers) => {
        console.log(answers)

        // add employee to database
    })
}

const updateEmpRole = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "What employee would you like to update?",
            choices: ""//add current employees from database//
        },
        {
            type: "list",
            name: "newRole",
            message: "What is their new role?",
            choices: "" // add the role from database
        }
    ])
}

mainMenu()
