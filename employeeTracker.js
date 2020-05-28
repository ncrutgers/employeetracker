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

