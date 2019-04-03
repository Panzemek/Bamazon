var mysql = require("mysql");
var inquirer = require("inquirer");
var manager = require("./bamazonManager");

console.log(manager);

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Protoss7",
    database: "bamazonDB"
});



connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    selectTier();
});

function selectTier() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What are you?",
                choices: ["Customer", "Manager"],
                name: "tier"
            }
        ])
        .then(function (inqRes) {
            if (inqRes.tier === "Customer") {
                purchase()
            } else {
                manager.inventory(connection);
            }

        });
}

function purchase() {
    connection.query("SELECT product_name, department_name, price, stock_quantity FROM products", function (err, result) {
        if (err) throw err;
        var nameArray = [];
        console.log(nameArray);
        var result = result;
        for (let i = 0; i < result.length; i++) {
            nameArray.push(result[i].product_name);
        }

        console.table(result);
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which item do you want to buy?",
                    choices: nameArray,
                    name: "item"
                },
                {
                    type: "input",
                    message: "How many would you like to buy?",
                    name: "amt"
                }
            ])
            .then(function (inqRes) {
                console.log(inqRes);
                let item = inqRes.item;
                let amount = inqRes.amt;
                for (let i = 0; i < result.length; i++) {
                    let currentStock = result[i].stock_quantity;
                    if (result[i].product_name === item && amount <= result[i].stock_quantity) {
                        console.log("purchase possible");
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: currentStock - amount
                                },
                                {
                                    product_name: item
                                }
                            ],
                            function (err, res) {
                                if (err) throw err;
                                console.log("Purchase complete!\n");
                            }
                        );
                    } else if (amount > currentStock) {
                        console.log("We haven't got that many!");
                    }

                }
                purchase();
            });
    });
}