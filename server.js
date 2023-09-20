const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');

const f = require('figlet');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'malkag',
    database: 'employeeTracker_db'
  },
  console.log(`Connected to the employeeTracker_db database.`)
);

const choices = [
    'view all departments',
    'add a department',
    'view all roles',
    'add a role',
    'view all employees',
    'add an employee',
    'update an employee role',
];

// prompt the user 

// get the sql query based on chosen option 
function start() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'what would you like to do?',
            choices: choices,
        }
    ]).then((answer) => {
        switch (answer.options){
            case 'view all departments':
                viewTable("select * from departments");
                break;
            case 'add a department':
                addDepartment();
                break;
            case 'view all roles':
                viewTable("select * from roles");
                break;
            case 'view all employees':
                viewTable("select * from employees");
                break;
            case 'add a role':
                addRole();
                break;
            case 'add an employee':
                addEmployee();
                break;
            case 'update an employee':
                updateEmployee();
                break;
        }
    });
};

//gets back a table from the database and prints it in the terminal
function viewTable(sql) {
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}
// adds a department to the departments table in the database
function addDepartment() {
    inquirer
        .prompt({
            type:'input',
            name: 'addDept',
            message: 'what deparment would you like to add?'
        }).then(({addDept}) => {
            sql = `INSERT INTO departments (departmentName) VALUES (?);`;
            db.query(sql, addDept, (err, result) => {
                if (err) throw err;
                viewTable("select * from departments");
            }); 
        })
}

// adds a role to the roles table in the database
function addRole() {
    var departmentNames = [];
    var departmentId = [];
    db.query('select * from departments', (err, result) => {
        if (err) throw err;
        departmentNames = result.map(departments => departments.departmentName);
        departmentId = result.id;
        //console.log(departmentNames);
        inquirer
        .prompt([
            {
                type:'input',
                name: 'name',
                message: 'what is the name of the role?'
            },
            {
                type:'input',
                name: 'salary',
                message: 'what is the salary of the role?'
            },
            {
                type: 'list',
                name: "deptId",
                message: "What department is it in? ",
                choices: departmentNames
            },
        ]).then(({name, salary, deptId}) => {
            var id;
            db.query('select id from departments where departmentName = ?', deptId, (err, result) =>{
                if (err) throw err;
                sql = `INSERT INTO roles (title,salary,department_id) VALUES (?,?,?);`;
                console.log(result[0].id);
                db.query(sql, [name, salary, result[0].id], (err, result) => {
                    if (err) throw err;
                    viewTable("select * from roles");
                }); 
            });
            
        })
    });
   
}


db.connect((error) => {
    if(error) throw error;
    console.log(`\x1b[38;5;13m ==========================\x1b[38;5;255m=============================\x1b[38;5;13m===========================`);
    console.log(`\x1b[38;5;13m ${f.textSync('Employee Tracker')}`);
    console.log(`\x1b[38;5;13m ==========================\x1b[38;5;255m=============================\x1b[38;5;13m=========================== \x1b[0m`);
    start();
});


