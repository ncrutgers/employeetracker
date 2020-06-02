// Required dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
// Create database connection with credentials
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

// Start inquire prompts list
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
        "Update an employee's role",
        "Remove employee",
        "Exit"
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

      case "Remove employee":
        removeEmployee();
        break;  
        
      case "Exit":
        connection.end();
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
  // Query to retrieve all of department table
  connection.query("SELECT * FROM department", function(err, results) {
    if (err) throw err;

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
          name: "department",
          type: "list",
          message: "What is the department name?",
          choices: function() {
            var deptNames = [];
            for (var i = 0; i < results.length; i++){
              deptNames.push(results[i].name);
            }
            return deptNames;
          }
        }
      ])
      // Retrieves department id of chosen department name
      .then(function(answer) {
          var chosenDeptName = answer.department;
          //console.log(answer.department)
          var query = "SELECT id FROM department WHERE name=?";
          connection.query(query, [chosenDeptName], function(err, result) {
            if (err) throw err;
            var deptID = result[0].id;
            // Set values of prompts and query to department table
            connection.query("INSERT INTO role SET ?", {
              title: answer.title,
              salary: answer.salary,
              department_id: deptID

            }, function(err) {                      
                if (err) throw err;
                console.log("You successfully added a role.");
                runSearch();                
            });         

          }); // end of inner connection query
      }); // end of prompt then promise
  }); // end of outer connection query
}

// Function adds an employee to database
function addEmployee() {
  // Query to retrieve all titles from role table
  connection.query("SELECT title FROM role", function(err, titleResult) {
    if (err) throw err;
    // Query to retrieve all employee names with titles from role table
    connection.query("SELECT employee.first_name, employee.last_name, role.title FROM employee JOIN role ON role.id = employee.role_id", function(err, employeeResult) {
      if (err) throw err;    

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
              name: "role",
              type: "list",
              message: "What is the employee's title?",
              choices: function() {
                var roles = [];
                for (var i = 0; i < titleResult.length; i++){
                  roles.push(titleResult[i].title);
                }             
                return roles;
              }
          },
          {
              name: "manager",
              type: "list",
              message: "Who is the Manager?",
              choices: function() {
                var employees = [];
                for (var i = 0; i < employeeResult.length; i++){
                  var employee = `${employeeResult[i].first_name} ${employeeResult[i].last_name} - ${employeeResult[i].title}`;
                  employees.push(employee);
                }
                employees.push("None");
                return employees;
              }
          }
        ])
        .then(function(answer) {
          console.log(answer);

          // Retrieve role id of chosen role title
          connection.query("SELECT id FROM role WHERE title=?", [answer.role], function(err, roleIdResult) {
            if (err) throw err;
            
            var roleID = roleIdResult[0].id;          

            // Retrieve id of chosen employee's manager
            var managerNameArr = answer.manager.split(" ");
            connection.query("SELECT id FROM employee WHERE first_name=? AND last_name=?", [managerNameArr[0], managerNameArr[1]], function(err, employeeIdResult) {
              if (err) throw err;
              // if no employee manager chosen set null to employeeID of employee
              var employeeID;
              if (!employeeIdResult.length) {
                employeeID = NULL;
              } else {                
                employeeID = employeeIdResult[0].id;
              }              

              // Set values of prompts and query to employee table
              connection.query("INSERT INTO employee SET ?", {
                first_name: answer.first,
                last_name: answer.last,
                role_id: roleID,
                manager_id: employeeID

              }, function(err) {
                  if (err) throw err;
                  console.log("You successfully added an employee.");
                  runSearch();                
              });

            }); // end of employee id query

          }); // end of role id query

        }); // end of prompt then promise

    }); // end of inner query

  }); // end of outer query
}

// Search all from department table
function viewDepartments() {

  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
      //console.log(res);
      for (var i = 0; i < res.length; i++) {
      console.log("Dept ID: " + res[i].id + " || Name: " + res[i].name);
      }
      runSearch();
  });    
}

// Search all from role table
function viewRoles() {
  
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err;
      //console.log(res);
    for (var i = 0; i < res.length; i++) {
      console.log("Role ID: " + res[i].id + " || Title: " + res[i].title + " || Salary: " + res[i].salary + " || Dept ID: " + res[i].department_id);
    }
    runSearch();
  });    
}   

// Search all from employee table
function viewEmployees() {
    // Query to retrieve all employees from employee table
    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
        //console.log(res);
      for (var i = 0; i < res.length; i++) {
        console.log("Employee ID: " + res[i].id + " || First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + " || Role ID: " + res[i].role_id + " || Manager ID: " + res[i].manager_id);
      }
      runSearch();
    });    
}

// Remove employee
function removeEmployee() {
  // Query to retrieve employee names from employee table
  connection.query("SELECT first_name, last_name FROM employee", function(err, result){
    if (err) throw err;
  
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "What is the employee's name?",
        choices: function() {
          var employees = [];
            for (var i = 0; i < result.length; i++) {
              employees.push(`${result[i].first_name} ${result[i].last_name}`);
            }
            return employees;
        }
      }
    ])
    .then(function(answer) {
      // Deletes employee that matches full name chosen
      var employeeNameArr = answer.employee.split(" ");
      connection.query("DELETE FROM employee WHERE first_name=? AND last_name=?", [employeeNameArr[0], employeeNameArr[1]], function(err, answer) {
        if (err) throw err;
        console.log("Employee successfully deleted.");
        runSearch();
      });
    });
  });
}

// Function to update employee's role
function updateEmployeeRole() {
   // Query to retrieve employee names from employee table
  connection.query("SELECT first_name, last_name FROM employee", function(err, employeeResult) {
    if (err) throw err;
    
    // Query to retrieve titles from role table
    connection.query("SELECT title FROM role", function(err, roleResult) {
      if (err) throw err;

      inquirer
        .prompt([{
          name: "employee",
          type: "list",
          message: "What employee's role would you like to update?",
          choices: function() {
            var employees = [];
            for (var i = 0; i < employeeResult.length; i++) {
              employees.push(`${employeeResult[i].first_name} ${employeeResult[i].last_name}`);
            }
            return employees;
          }
        },
        {
          name: "title",
          type: "list",
          message: "Choose new role",
          choices: function() {
            var titles = [];
            for (var i = 0; i < roleResult.length; i++) {
              titles.push(roleResult[i].title);
            }
            return titles;
          }
        }
      ])
      .then(function(answer) {
        // Update employee
        var employeeNameArr = answer.employee.split(" ");
        connection.query("UPDATE employee SET role_id=(SELECT id FROM role WHERE title=?) WHERE employee.first_name=? AND employee.last_name=?", [answer.title, employeeNameArr[0], employeeNameArr[1]], function(err, result) {
          if (err) throw err;
          console.log("Employee's role successfully updated.");
          runSearch();
        }); 
      });
    });
  });  
}
