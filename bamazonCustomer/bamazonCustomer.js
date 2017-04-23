var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table'); 

var connection = mysql.createConnection({
	host : 'localhost',
	port: 3306,

	user: 'root',

	password: '',
	database: 'Bamazon'
});

connection.connect( (err,res) => {
	if(err){
		throw err;
	}
})

function displayMainMenu() {

	connection.query('SELECT * FROM products', (err,response) => {
		if(err){
			throw err;
		}
		else{
			let products = [];
			for(let record in response){
				
				products.push([response[record].item_id, response[record].product_name, response[record].price]);
			}
			console.table(['ID', 'Product', 'Cost'], products);
			process.exit();
		}
	});
	

};

displayMainMenu();
