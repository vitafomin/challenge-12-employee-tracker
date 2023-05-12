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

      if (answer === "View all departments") {
        viewDepart();
      }

      if (answer === "View all roles") {
        viewRole();
      }

      if (answer === "View all employees") {
        viewEmp();
      }

      if (answer === "Add a department") {
        addDepart();
      }

      if (answer === "Add a role") {
        addRole();
      }

      if (answer === "Add an employee") {
        addEmp();
      }

      if (answer === "Update an employee role") {
        updateEmpRole();
      }

      if (answer === "Update employee manager") {
        updateEmpMan();
      }

      if (answer === "View employee by manager") {
        viewEmpMan();
      }

      if (answer === "Delete a department") {
        deleteDepart();
      }

      if (answer === "Delete a role") {
        deleteRole();
      }

      if (answer === "Delete an employee") {
        deleteEmp();
      }

      if (answer === "View budget salary with in a department") {
        departSalary();
      }

      if (answer === "quit") {
        quit();
      }
    });
};

// present table showing department names and department ids
const viewDepart = () => {
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    mainMenu();
  });
};

// present job title, role id, department that that role belongs to, salary for that role
const viewRole = () => {
  db.query(`SELECT * FROM role`, (result, err) => {
    if (err) {
      console.log(err);
    }
    console.table("Roles", result.id, result.name);
    mainMenu();
  });
};

// present emplyee data; employee id, first name, last name, job titles, departments, salaries, managers that that employee reports to
const viewEmp = () => {
  db.query(`SELECT * FROM employee`, (result, err) => {
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
      
      db.query(`INSERT INTO departments (name) VALUES ?`, answer.name, (err, result) => {
        if (err) {
            console.log(err);
        };
        console.table(result);
        mainMenu()
      })
    });

};

// add role to database
const addRole = () => {
  return inquirer.prompt([
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
      message: "What department does this role belong to?",
    },
  ])
  .then((answer) => {
    console.log(answer)

    db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, answer.title, answer.salary, answer.department_id, (err, results) => {
        if (err) {
            console.log(err)
        };
        console.table(results);
        mainMenu()
    })
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

      db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, answer.firstName, answer.lastName, answer.role, answer.manager, (err, result) => {
        if (err) {
            console.log(err)
        };
        console.table(result);
        mainMenu()
      })

    });
};

// update employee role
const updateEmpRole = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "What employee would you like to update?",
      choices: "", //add current employees from database//
    },
    {
      type: "input",
      name: "newRole",
      message: "What is their new role?",
    },
  ])
  .then((answer) => {
    console.log(answer);

    db.query(`UPDATE employees SET role_id=? WHERE first_name=?`, answer.newRole, answer.employee, (err, result) => {
        if (err) {
            console.log(err)
        };
        console.table(result)
        mainMenu()
    })
  })
};

// update employee manager
const updateEmpMan = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "currentEmployee",
      message: "What employee would you like to update, their manager",
      choices: "", //all employees from database
    },
    {
      type: "input",
      name: "newManager",
      message: "Who is their new employee",
    },
  ])
  .then((answer) => {
    console.log(answer)

    db.query(`UPDATE employees SET manager_id=? WHERE first_name=?`, answer.newManager, answer.currentEmployee, (err, result) => {
        if (err) {
            console.log(err)
        };
        console.table(result)
        mainMenu()
    })
  })
};

// view employees by manager 
const viewEmpMan = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "managerName",
            message: "What manager would you like to see their employees?"
        }
    ])
    .then((answer) => {
        console.log(answer)

        db.query(`SELECT employee.first_name, employee.last_name FROM employees JOIN employees ON employees WHERE manager_id=?`, answer.managerName, (err, results) => {
            if (err) {
                console.log(err)
            };
            console.table(results)
            mainMenu()
        })
    })

};

// delete department
const deleteDepart = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "deleteDepart",
            message: "What department would you like to delete?"
        }
    ])
    .then((answer) => {
        db.query(`DELETE FROM departments WHERE name=?`, answer.deleteDepart, (err, result) => {
            if (err) {
                console.log(err)
            }
            console.table(result);
            mainMenu();
        })
    })

};

// delete role
const deleteRole = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "deleteRole",
            message: "What role would you like to delete?"
        }
    ])
    .then((answer) => {
        db.query(`DELETE FROM roles WHERE title=?`, answer.deleteRole, (err, result) => {
            if (err) {
                console.log(err)
            }
            console.table(result)
            mainMenu()
        })
    })

};

// delete employee
const deleteEmp = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "deleteEmpFirst",
            message: "What is the first name of the employee you would like to delete?"
        },
        {
            type: "input",
            name: "deleteEmpLast",
            message: "What is the last name of the employee you would like to delete?"
        }
    ])
    .then((answer) => {
        db.query(`DELETE FROM employees WHERE first_name=?, last_name=?`, answer.deleteEmpFirst, answer.deleteEmpLast, (err, result) => {
            if (err) {
                console.log(err)
            }
            console.table(result)
            mainMenu()
        })
    })

};

// view department budget/ combined salary
const departSalary = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "departSum",
            message: "What department budget would you like to see?",
            choices: ""
        }
    ])
    .then((answer) => {
        db.query(`SELECT SUM(salary) FROM roles WHERE department_id=?`, answer.departSum, (err, result) => {
            if (err) {
                console.log(err)
            }
            console.table(result)
            mainMenu()
        })
    })

}

// this allows user to exit out and quit out of the main menu
const quit = () => {
  db.connection.end();
  process.exit();
};

mainMenu();
