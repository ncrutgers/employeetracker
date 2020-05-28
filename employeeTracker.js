var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootpass",
    database: "cms_db"
});

connection.connect(function(err) {
    if (err) throw err;

    console.log("Connected as id " + connection.threadId);
    runSearch();
});

// Start inquire prompts
function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a department",
        "Add a role",
        "Add an employee", 
        "View departments",
        "View roles",
        "View employees",
        "Update an employee's role"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Add a department":
        addDepartment();
        break;

      case "Add a role":
        addRole();
        break;

      case "Add an employee":
        addEmployee();
        break;

      case "View departments":
        viewDepartments();
        break;

      case "View roles":
        viewRoles();
        break;

      case "View employees":
        viewEmployees();
        break;
        
      case "Update an employee's role":
        updateEmployeeRole();
        break;  
      }
    });
}

// Function adds a department to database
function addDepartment() {
    inquirer
        .prompt([
            {
                name: "departmentName",
                type: "input",
                message: "What is the department name that you would like to add?"
            }
        ])
        .then(function(answer) {
            connection.query("INSERT INTO department SET ?", {
                name: answer.departmentName
            }, function(err) {
                if (err) throw err;
                console.log("You successfully added a department.");
                runSearch();                
            });
        });
}

// Function adds a role to database
function addRole() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the role title that you would like to add?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary associated with the role title?"

            },
            {
                name: "departmentId",
                type: "input",
                message: "What is the department id?"
            }
        ])
        .then(function(answer) {
            connection.query("INSERT INTO role SET ?", {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.departmentId

            }, function(err) {
                if (err) throw err;
                console.log("You successfully added a role.");
                runSearch();                
            });
        });
}

// Function adds an employee to database
function addEmployee() {
    inquirer
        .prompt([
            {
                name: "first",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "last",
                type: "input",
                message: "What is the employee's last name?"

            },
            {
                name: "role_id",
                type: "input",
                message: "What is the role id?"
            },
            {
                name: "manager_id",
                type: "input",
                message: "What is the manager's id?"
            }
        ])
        .then(function(answer) {
            connection.query("INSERT INTO employee SET ?", {
                first_name: answer.first,
                last_name: answer.last,
                role_id: answer.role_id,
                manager_id: answer.manager_id

            }, function(err) {
                if (err) throw err;
                console.log("You successfully added an employee.");
                runSearch();                
            });
        });
}

// Search all from department table
function viewDepartments() {
     
    var query = "SELECT * FROM department";

    connection.query(query, function(err, res) {
        //console.log(res);
        for (var i = 0; i < res.length; i++) {
        console.log("Dept ID: " + res[i].id + " || Name: " + res[i].name);
        }
        runSearch();
    });    
}

// Search all from role table
function viewRoles() {
     
    var query = "SELECT * FROM role";

    connection.query(query, function(err, res) {
        //console.log(res);
      for (var i = 0; i < res.length; i++) {
        console.log("Role ID: " + res[i].id + " || Title: " + res[i].title + " || Salary: " + res[i].salary + " || Dept ID: " + res[i].department_id);
      }
      runSearch();
    });    
}   

// Search all from employee table
function viewEmployees() {
     
    var query = "SELECT * FROM employee";

    connection.query(query, function(err, res) {
        //console.log(res);
      for (var i = 0; i < res.length; i++) {
        console.log("Employee ID: " + res[i].id + " || First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + " || Role ID: " + res[i].role_id + " || Manager ID: " + res[i].manager_id);
      }
      runSearch();
    });    
}   
