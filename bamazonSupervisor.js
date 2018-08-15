var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon"
});


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}


runAction();

function runAction() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "\nWhat would you like to do?",
            choices: [
                "View Product Sales by Department",
                "Create New Department"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Product Sales by Department":
                    // Function
                    viewSales();

                    break;

                case "Create New Department":
                    // Function
                    addDepartment();
                    break;
            }
        });
}

function viewSales() {
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        console.log("ID | Department Name | Overhead Costs | Product Sales | Total Profit");

        var queryTwo = "SELECT product_sales FROM products";

        connection.query(queryTwo, function (err, resOne) {


            var i; for (i = 0; i < res.length; i++) {
                var profit = resOne[i].product_sales - res[i].over_head_costs;
                console.log("-------------------------------------------")
                console.log("| ID: " + res[i].department_id + " | " + res[i].department_name + " | $" + res[i].over_head_costs + " | $" + resOne[i].product_sales + " | " + profit);
            }
            sleep(2000);
            runAction();
        });
    });
}

function addDepartment() {
    console.log("\nEnter details below to add a department.")
    inquirer
        .prompt([
            {
                name: "department_name",
                type: "input",
                message: "What is the department name?"
            },
            {
                name: "over_head_costs",
                typie: "input",
                message: "What is the overhead cost for this department?"
            }
        ])
        .then(function (answer) {
            //Put this after the promise
            console.log("Inserting a new product...\n");
            var query = connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.department_name,
                    over_head_costs: answer.over_head_costs
                },
                function (err, res) {
                    console.log(res.affectedRows + " product added!\n");
                    // Call updateProduct AFTER the INSERT completes
                }
            );
            runAction();
        });


}