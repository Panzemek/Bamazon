var exports = module.exports = {}
exports.inventory = function (connection) {
    connection.query("SELECT * FROM products", function (err, result) {
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

                },
            ])
            .then(function (inqRes) {
                let item = inqRes.item;
                let amount = inqRes.amt;
                for (let i = 0; i < result.length; i++) {
                    let currentStock = result[i].stock_quantity;
                    if (result[i].product_name === item) {
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: 0
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
                inventory();
            });
    });

}
