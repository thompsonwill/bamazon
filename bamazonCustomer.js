var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');

var newQuantity = 0;
var myQuantity = 0;
var inputQuantity = 0;


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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    buyProduct();
});



function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

var table = new Table({
    head: ['ID', 'Product Name', 'Department', 'Price', 'Quantity']
});


function buyProduct() {
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
                    name: "buy",
                    type: "input",
                    message: "Which product would you like to buy? Enter a product ID."
                },
                {
                    name: "quantity",
                    typie: "input",
                    message: "How many would you like to buy?"
                }
            ])
            .then(function (answer) {
                var query = "SELECT item_id, product_name, price, quantity, product_sales FROM products WHERE item_id = " + answer.buy + ";";
                connection.query(query, function (err, res) {
                    console.log(" | ID: " + res[0].item_id + " | " + res[0].product_name + " | " + "$" + res[0].price + " | " + res[0].quantity + " in stock " + " | ");
                    if (answer.quantity < res[0].quantity) {
                        console.log("Product is in stock! Order is being fulfilled.");

                        // Store quantity in variables
                        myQuantity = res[0].quantity;
                        inputQuantity = answer.quantity;
                        newQuantity = parseInt(myQuantity) - parseInt(inputQuantity);
                        var price = res[0].price;
                        var cost = price * inputQuantity;
                        var productSales = cost + res[0].product_sales;

                        var secondQuery = "UPDATE products SET quantity = " + newQuantity + " WHERE item_id = " + answer.buy;
                        connection.query(secondQuery, function (err, res) {

                            console.log("Your order has been processed. Thank you for shopping with us! \n Your order total amounts to: $" + cost);
                            sleep(1500);
                        });
                        var thirdQuery = "UPDATE products SET product_sales = " + productSales + " WHERE item_id = " + answer.buy;
                        connection.query(thirdQuery, function (err, res) {

                            console.log("Calculating product sales");
                            buyProduct();
                        });
                    } else {
                        console.log("Insufficient quantity! Try another product");
                        sleep(1000);
                        buyProduct();
                    }

                });
            });
    });
}
