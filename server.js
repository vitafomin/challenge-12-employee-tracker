const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
// const fs = require("fs/promises");
// const { default: PasswordPrompt } = require("inquirer/lib/prompts/password");
// const { connect } = require("http2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "employee_db",
  },
  console.log("connected to the employee_db database.")
);

const mainMenu = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Update employee manager",
          "View employee by manager",
          "Delete a department",
          "Delete a role",
          "Delete an employee",
          "View budget salary with in a department",
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      console.log(answer);

      if (answer.action === "View all departments") {
        viewDepart();
      }

      if (answer.action === "View all roles") {
        viewRole();
      }

      if (answer.action === "View all employees") {
        viewEmp();
      }

      if (answer.action === "Add a department") {
        addDepart();
      }

      if (answer.action === "Add a role") {
        addRole();
      }

      if (answer.action === "Add an employee") {
        addEmp();
      }

      if (answer.action === "Update an employee role") {
        updateEmpRole();
      }

      if (answer.action === "Update employee manager") {
        updateEmpMan();
      }

      if (answer.action === "View employee by manager") {
        viewEmpMan();
      }

      if (answer.action === "Delete a department") {
        deleteDepart();
      }

      if (answer.action === "Delete a role") {
        deleteRole();
      }

      if (answer.action === "Delete an employee") {
        deleteEmp();
      }

      if (answer.action === "View budget salary with in a department") {
        departSalary();
      }

      if (answer.action === "quit") {
        quit();
      }
    });
};

// present table showing department names and department ids
const viewDepart = () => {
  db.query(`SELECT * FROM departments;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    mainMenu();
  });
};

// present job title, role id, department that that role belongs to, salary for that role
const viewRole = () => {
  db.query(`SELECT * FROM roles;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    mainMenu();
  });
};

// result.id, result.name

// present emplyee data; employee id, first name, last name, job titles, departments, salaries, managers that that employee reports to
const viewEmp = () => {
  db.query(`SELECT * FROM employees;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    mainMenu();
  });
};

// add department to database
const addDepart = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What department would you like to add ?",
      },
    ])
    .then((answer) => {
      console.log(answer);

      db.query(
        `INSERT INTO departments (name) VALUES (?);`, answer.department, (err, result) => {
          if (err) {
            console.log(err);
          }
          viewDepart();
          mainMenu();
        }
      );
    });
};

// add role to database
const addRole = () => {
    
    db.query(`SELECT * FROM departments;`, (err, data) => {
        if (err) {
            console.log(err)
        }
        console.table(data)
    

  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What role would you like to add?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?",
      },
      {
        type: "input",
        name: "department",
        message: "What department does this role belong to (please provide department_id)?",
      },
    ])
    .then((answer) => {
      console.log(answer);

      db.query(
        `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`,
        [answer.role, answer.salary, answer.department],
        (err, results) => {
          if (err) {
            console.log(err);
          }
          console.table(results);
          mainMenu();
        }
      );
    });
})
};

// add employee to database
const addEmp = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the emplyees first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employees last name?",
      },
      {
        type: "input",
        name: "role",
        message: "What is the employees role?",
      },
      {
        type: "input",
        name: "manager",
        message: "What manager will this employee report to?",
      },
    ])
    .then((answers) => {
      console.log(answers);

      db.query(
        `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [answers.firstName, answers.lastName, answers.role, answers.manager],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
          mainMenu();
        }
      );
    });
};

// update employee role
const updateEmpRole = () => {
  // say we have a temp Employee Container
  // employeeList = [];
  // we need to query our DB for all of our Employees

  db.query("SELECT * FROM employees;", (err, data) => {
    if (err) {
      console.log(err);
    }

    // console.log("TYpe: ", typeof data);
    // console.log(data);
    console.table(data);

    // let names = [];
    let currentEmployees = data.map((employee) => {
      return {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });
    // console.log("Current EMployees: ", currentEmployees);
    // // Loop through dataset, pull out IMPORTANT INFO
    // for(let i = 0; i < data.length; i++) {
    //    // names.push(data[i].first_name + " " + data[i].last_name)
    //     names.push(data[i].first_name)
    // }

    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "What employee would you like to update?",
          choices: currentEmployees, //add current employees from database//
        },
        {
          type: "input",
          name: "newRole",
          message: "What is their new role?",
        },
      ])
      .then((answer) => {
        console.log(answer);

        db.query(
          `UPDATE employees SET role_id=? WHERE id=?;`,
          [answer.newRole, answer.employee],
          (err, result) => {
            if (err) {
              console.log(err);
            }
            viewEmp();
            mainMenu();
          }
        );
      });
  });
};

// update employee manager
const updateEmpMan = () => {
  db.query("SELECT * FROM employees;", (err, data) => {
    if (err) {
      console.log(err);
    }

    console.table(data);

    let currentEmployees = data.map((employee) => {
      return {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "currentEmployee",
          message: "What employee would you like to update, their manager",
          choices: currentEmployees, //all employees from database
        },
        {
          type: "input",
          name: "newManager",
          message: "Who is their new manager",
        },
      ])
      .then((answer) => {
        console.log(answer);

        db.query(
          `UPDATE employees SET manager_id=? WHERE role_id=?`,
          [answer.newManager, answer.currentEmployee],
          (err, result) => {
            if (err) {
              console.log(err);
            }
            viewEmp();
            mainMenu();
          }
        );
      });
  });
};

// view employees by manager
const viewEmpMan = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "managerName",
        message: "What manager would you like to see their employees?",
      },
    ])
    .then((answer) => {
      console.log(answer);

      db.query(
        `SELECT employee.first_name, employee.last_name FROM employees JOIN employees ON employees WHERE manager_id=?`,
        answer.managerName,
        (err, results) => {
          if (err) {
            console.log(err);
          }
          console.table(results);
          mainMenu();
        }
      );
    });
};

// delete department
const deleteDepart = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "deleteDepart",
        message: "What department would you like to delete?",
      },
    ])
    .then((answer) => {
      db.query(
        `DELETE FROM departments WHERE name=?`,
        answer.deleteDepart,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
          mainMenu();
        }
      );
    });
};

// delete role
const deleteRole = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "deleteRole",
        message: "What role would you like to delete?",
      },
    ])
    .then((answer) => {
      db.query(
        `DELETE FROM roles WHERE title=?`,
        answer.deleteRole,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
          mainMenu();
        }
      );
    });
};

// delete employee
const deleteEmp = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "deleteEmpFirst",
        message:
          "What is the first name of the employee you would like to delete?",
      },
      {
        type: "input",
        name: "deleteEmpLast",
        message:
          "What is the last name of the employee you would like to delete?",
      },
    ])
    .then((answer) => {
      db.query(
        `DELETE FROM employees WHERE first_name=(?), last_name=(?);`, [answer.deleteEmpFirst,
        answer.deleteEmpLast],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
          mainMenu();
        }
      );
    });
};

// view department budget/ combined salary
const departSalary = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "departSum",
        message: "What department budget would you like to see?",
      },
    ])
    .then((answer) => {
      db.query(
        `SELECT SUM(salary) FROM roles WHERE department_id=?`,
        answer.departSum,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.table(result);
          mainMenu();
        }
      );
    });
};

// this allows user to exit out and quit out of the main menu
const quit = () => {
  db.connection.end();
  process.exit();
};

mainMenu();
