var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');

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
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    // Function
                    readProducts();
                    break;

                case "View Low Inventory":
                    // Function
                    lowInventory();
                    break;

                case "Add to Inventory":
                    // Function
                    addInventory();
                    break;

                case "Add New Product":
                    // Function
                    addProduct();
                    break;
            }
        });
}

var table = new Table({
    head: ['ID', 'Product Name', 'Department', 'Price', 'Quantity']
});


function readProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("\nID | Product Name | Department | Price | Quantity");

        var i; for (i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].quantity]
            );
        }
        console.log(table.toString());

        runAction();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE quantity < 5", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("\nLOW INVENTORY - PLEASE ORDER\n");

        var i; for (i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].quantity]
            );
        }
        console.log(table.toString());
        runAction();
    });
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement

        var i; for (i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].quantity]
            );
        }
        console.log(table.toString());
        console.log("\n");

        inquirer
            .prompt([
                {
                    name: "add",
                    type: "input",
                    message: "Which product would you like to add inventory to? Enter a product ID."
                },
                {
                    name: "quantity",
                    typie: "input",
                    message: "How much would you like to add?"
                }
            ])
            .then(function (answer) {
                var query = "SELECT item_id, product_name, price, quantity FROM products WHERE item_id = " + answer.add + ";";
                connection.query(query, function (err, res) {
                    console.log(" | ID: " + res[0].item_id + " | " + res[0].product_name + " | " + "$" + res[0].price + " | " + res[0].quantity + " in stock " + " | ");

                    // Store quantity in variables
                    myQuantity = res[0].quantity;
                    inputQuantity = answer.quantity;
                    newQuantity = parseInt(myQuantity) + parseInt(inputQuantity);


                    var secondQuery = "UPDATE products SET quantity = " + newQuantity + " WHERE item_id = " + answer.add;
                    connection.query(secondQuery, function (err, res) {
                        console.log("You have added " + inputQuantity + " pieces");
                        sleep(1500);
                        runAction();
                    });

                });
            });

    });
}

function addProduct() {
    console.log("\nEnter details below to add a product.")
    inquirer
        .prompt([
            {
                name: "product_name",
                type: "input",
                message: "What is the product name?"
            },
            {
                name: "department_name",
                typie: "input",
                message: "Which department does this item belong in?"
            },
            {
                name: "price",
                typie: "input",
                message: "How much does it cost?"
            },
            {
                name: "quantity",
                typie: "input",
                message: "How many should we add for initial quantity?"
            },
        ])
        .then(function (answer) {
            //Put this after the promise
            console.log("Inserting a new product...\n");
            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    quantity: answer.quantity
                },
                function (err, res) {
                    console.log(res.affectedRows + " product added!\n");
                    // Call updateProduct AFTER the INSERT completes
                }
            );
            runAction();
        });


}