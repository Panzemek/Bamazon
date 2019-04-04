var mysql = require("mysql");
var inquirer = require("inquirer");

var exports = module.exports = {}
exports.inventory = function (connection) {
    managerMenu(connection);
}

function managerMenu(connection) {
    connection.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    message: "What do you want to do?",
                    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                    name: "managerAction"
                },
            ])
            .then(function (inqRes) {
                if (inqRes.managerAction === "View Products for Sale") {

                    viewProducts(result, connection);
                } else if (inqRes.managerAction === "View Low Inventory") {
                    viewLowInventory(result, connection);
                } else if (inqRes.managerAction === "Add to Inventory") {
                    addInventory(result, connection);
                } else if (inqRes.managerAction === "Add New Product") {
                    addProduct(result, connection);
                }
            });
    });


}

function viewProducts(result, connection) {
    console.table(result)
    managerMenu(connection);
}

function viewLowInventory(result, connection) {
    var nameArray = [];
    var result = result;
    for (let i = 0; i < result.length; i++) {
        if (result[i].stock_quantity < 5) {
            nameArray.push(result[i].product_name);
        }
    }


    if (nameArray[0] !== undefined) {
        console.log("Low stock items:\n")
        for (let i = 0; i < nameArray.length; i++) {
            console.log((i + 1) + ". " + nameArray[i] + "\n");
        }
    } else {
        console.log("Stock's good!");
    }
    managerMenu(connection);
}

function addInventory(result, connection) {
    var nameArray = [];
    var result = result;

    for (let i = 0; i < result.length; i++) {
        nameArray.push(result[i].product_name);
    }

    inquirer
        .prompt([
            {
                type: "list",
                message: "What item do you want to add inventory for?",
                choices: nameArray,
                name: "item"
            },
            {
                type: "input",
                message: "How much do you want to add?",
                name: "quantity"
            },
        ])
        .then(function (inqRes) {
            var item = inqRes.item;
            var amount = parseInt(inqRes.quantity);
            for (let i = 0; i < result.length; i++) {
                let currentStock = parseInt(result[i].stock_quantity);
                if (result[i].product_name === item) {
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: currentStock + amount
                            },
                            {
                                product_name: item
                            }
                        ],
                        function (err, res) {
                            if (err) throw err;
                        }
                    );
                }

            }
            managerMenu(connection);
        });
}

function addProduct(result, connection) {
    console.log("Incomplete section.");
    managerMenu(connection);
}
