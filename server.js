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
    db.query('select * from departments', (err, result) => {
        if (err) throw err;
        departmentNames = result.map(departments => departments.departmentName);
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
            db.query('select id from departments where departmentName = ?', deptId, (err, result) =>{
                if (err) throw err;
                sql = `INSERT INTO roles (title,salary,department_id) VALUES (?,?,?);`;
                db.query(sql, [name, salary, result[0].id], (err) => {
                    if (err) throw err;
                    viewTable("select * from roles");
                }); 
            });
            
        })
    });
   
}

//adds an employee to the employee table 
function addEmployee() {
    var roles = [];
    var managers;
    db.query('select * from roles', (err, result) => {
        if (err) throw err;
        // collecting the list of roles so they can choose a role
        roles = result.map(roles => roles.title);
        db.query('select * from employees', (err, result) => {
            if (err) throw err;
            //collecting the list of employees to choose a manager
            managers = result.map(employees => employees.first_name + ' ' + employees.last_name);
        //prompt the user
        inquirer
        .prompt([
            {
                type:'input',
                name: 'fName',
                message: `what is the employee's first name?`
            },
            {
                type:'input',
                name: 'lName',
                message: `what is the employee's last name?`
            },
            {
                type: 'list',
                name: "roleId",
                message: "What is the employee's role? ",
                choices: roles
            },
            {
                type: 'list',
                name: "manager",
                message: "Who is the employee's manager? ",
                choices: managers
            },
        ]).then(({fName, lName, roleId, manager}) => {
            //getting back the role id for the chosen role
            db.query('select id from roles where title = ?', roleId, (err, result) =>{
                if (err) throw err;
                const role = result[0].id;
                //separating the first and last name for the next query
                const managerName = manager.split(' ');
                // getting back the id for the chosen manager
                db.query('select id from employees where first_name = ? and last_name = ?',[managerName[0], managerName[1]], (err, result) => {
                    if (err) throw err;
                    const managerId = result[0].id;
                    console.log(result);
                    sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`;
                    //adding the employee to the table
                    db.query(sql, [fName, lName, role, managerId], (err) => {
                        if (err) throw err;
                        viewTable("select * from employees");
                    }); 
                });
            });
        })
        });
        
    });
}


db.connect((error) => {
    if(error) throw error;
    console.log(`\x1b[38;5;13m ==========================\x1b[38;5;255m=============================\x1b[38;5;13m===========================`);
    console.log(`\x1b[38;5;13m ${f.textSync('Employee Tracker')}`);
    console.log(`\x1b[38;5;13m ==========================\x1b[38;5;255m=============================\x1b[38;5;13m=========================== \x1b[0m`);
    start();
});


