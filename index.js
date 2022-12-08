const inquirer = require("inquirer");
const db = require("./db/connection")

db.connect(function (err) {
    if (err) throw err
    console.log("MySQL connected")
    menu()
})

function menu() {
    inquirer.prompt([{
        type: 'list',
        name: "choice",
        message: "What would you like to do?",
        choices: ["View all Departments", "View all Roles", "View all Employees", "Add Department", " Add Role", "Add Employee", "Update Employee Role"]
    }]).then(res => {
        switch (res.choice) {
            case "View all Departments":
                viewAllDepartments()
                break;
            case "View all Roles":
                viewAllRoles()
                break;
            case "View all Employees":
                viewAllEmployees()
                break;
            case "Add Department":
                addDepartment()
                break;
            case "Add Role":
                addRole()
                break;
            case "Add Employee":
                addEmployee()
                break;
            case "Update Employee Role":
                updateEmployee()
                break;
        }

    })
}

function viewAllDepartments() {
    db.query("SELECT id, name FROM department", function (err, res) {
        if (err) throw err
        console.log(res)
        menu()
    })
}

function viewAllRoles() {
    db.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        console.table(res)
        menu()
    })
}

function viewAllEmployees() {
    db.query("SELECT * FROM Employee", function (err, res) {
        if (err) throw err
        console.table(res)
        menu()
    })
}

function addDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "newDept",
        message: "What department would you like to add?"
    }]).then(res => {
        db.query("INSERT INTO department SET ?", {
            name: res.newDept
        })
        console.log(`Added ${res.newDept} to the department table`)
        menu()
    })
}

function addEmployee() {
    inquirer.prompt([{
        type: "input",
        name: "newEmployee",
        message: "What Employee would you like to add?"
    }]).then(res => {
        db.query("INSERT INTO Employee SET ?", {
            name: res.newEmployee
        })
        console.log(`Added ${res.newDept} to the Employee table`)
        menu()
    })
}

function addRole() {
    inquirer.prompt([{
        type: "input",
        name: "newRole",
        message: "What role would you like to add?"
    }]).then(res => {
        db.query("INSERT INTO department SET ?", {
            name: res.newRole
        })
        console.log(`Added ${res.newRole} to the department table`)
        menu()
    })
}



// ----------------



// ----------------

function updateEmployee() {
    const employeeSql = `SELECT * FROM employee`;
    db.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const roleSql = `SELECT * FROM roles`;

                db.query(roleSql, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's new role?",
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            params.push(role);

                            let employee = params[0]
                            params[0] = role
                            params[1] = employee

                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            db.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                menu();
                            });
                        });
                });
            });
    });
};