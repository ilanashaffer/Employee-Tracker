var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysql123",
  database: "homework12_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});


// inquirer prompts

const starterQuestion = [
  {
    type: "list",
    name: "whatToDo",
    message: "What would you like to do?",
    choices: ["Add data", "View data", "Update data"]
  }
];

const firstAddDataQuestion = [
  {
    type: "list",
    name: "addData",
    message: "What would you like to add?",
    choices: ["Add department", "Add role", "Add employee"]
  }

];

const addDepartmentQuestion = [
  {
    type: "input",
    name: "departmentName",
    message: "Enter department name:"
  }
];

const addRoleQuestions = [
  {
    type: "input",
    name: "roleTitle",
    message: "Enter role title:"
  },
  {
    type: "input",
    name: "roleSalary",
    message: "Enter role salary:"
  },
  {
    type: "input",
    name: "roleDepartmentId",
    message: "Enter department id:"
  }

];

const addEmployeeQuestions = [
  {
    type: "input",
    name: "firstName",
    message: "Enter first name:"
  },
  {
    type: "input",
    name: "lastName",
    message: "Enter last name:"
  },
  {
    type: "input",
    name: "roleId",
    message: "Enter role id:"
  },
  {
    type: "input",
    name: "managerId",
    message: "Enter manager id:"
  }

];

const firstViewDataQuestion = [
  {
    type: "list",
    name: "viewData",
    message: "What would you like to view?",
    choices: ["Departments", "Roles", "Employees"]
  }

];

const updateDataQuestions = [
  {
    type: "input",
    name: "enterRole",
    message: "Enter role title you would like to update:"
  },
  {
    type: "input",
    name: "updateSalary",
    message: "Enter role salary:"
  },
  {
    type: "input",
    name: "updateDepId",
    message: "Enter department id:"
  }
];


// functions

// starter function
function start() {
  inquirer
    .prompt(starterQuestion).then(function(data) {

      if (data.whatToDo === "Add data") {
        addData();
      } else if (data.whatToDo === "View data") {
        viewData();
      } else if (data.whatToDo === "Update data") {
        updateData();
      } else {
        connection.end();
      }
    });

};

// add data functions

function addData(){
  inquirer
  .prompt(firstAddDataQuestion).then(function(data) {
    
    if (data.addData === "Add department") {
      addDepartment();
    } else if (data.addData === "Add role") {
      addRole();
    } else if (data.addData === "Add employee") {
      addEmployee();
    } else {
      connection.end();
    }
  });
};

function addDepartment(){
  inquirer.prompt(addDepartmentQuestion).then(function(data){
    connection.query(
      "INSERT INTO department SET ?",
      {
        name: data.departmentName
      },
      function(err) {
        if (err) throw err;
        console.log("Department added.");
        start();
      }
    );
  });
};

function addRole(){
  inquirer.prompt(addRoleQuestions).then(function(data){
    connection.query(
      "INSERT INTO role SET ?",
      {
        title: data.roleTitle,
        salary: data.roleSalary,
        department_id: data.roleDepartmentId
      },
      function(err) {
        if (err) throw err;
        console.log("Role added.");
        start();
      }
    );
  });
};

function addEmployee(){
  inquirer.prompt(addEmployeeQuestions).then(function(data){
    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: data.firstName,
        last_name: data.lastName,
        role_id: data.roleId,
        manager_id: data.managerId
      },
      function(err) {
        if (err) throw err;
        console.log("Employee added.");
        start();
      }
    );
  });
};


// view data functions

function viewData(){
  inquirer.prompt(firstViewDataQuestion).then(function(data){
    if (data.viewData === "Departments") {
      viewDepartments();
    } else if (data.viewData === "Roles") {
      viewRoles();
    } else if (data.viewData === "Employees") {
      viewEmployees();
    } else {
      connection.end();
    }
  });
};

function viewDepartments(){
  console.log("Department Table: \n");
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
};

function viewRoles(){
  console.log("Role Table: \n");
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
};

function viewEmployees(){
  console.log("Employee Table: \n");
  connection.query("SELECT * FROM employee", function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
};


// update data functions

function updateData(){
  inquirer.prompt(updateDataQuestions).then(function(data){
    let regularRole = data.enterRole;

    let updatedRoleData = [

      {salary: parseInt(data.updateSalary)},
      {department_id: data.updateDepId}

    ];

    console.log("Updating...\n");
    connection.query(`UPDATE role SET ? WHERE title = '${regularRole}'`, updatedRoleData, function(err, res) {
      if (err) throw err;
      console.log("Update complete.");
      start();
    });

  });
  
};



