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

function processUserInput(input) {

	let purchase_quantity = parseInt(input.purchase_quantity, 10);
	let product = input.user_purchase;
	if(!isNaN(purchase_quantity)){
		connection.query('SELECT price, stock_quantity FROM products WHERE ?', { product_name: product}, (err,res) => {
			if(err){
				throw err;
			}
			else{
				console.log(`You have purchased ${purchase_quantity} ${product}(s).\nTotal cost: ${res[0].price * purchase_quantity}`);
				let new_stock_quantity = res[0].stock_quantity - purchase_quantity;
				// updateInventoryListing();
				process.exit();
			}
		});		
	}
	else{
		console.error('Quantity input is not valid. Please enter a positive whole number');
		displayMainMenu();
	}
};

connection.connect( (err,res) => {
	if(err){
		throw err;
	}
});

function displayMainMenu() {

	connection.query('SELECT * FROM products', (err,response) => {
		if(err){
			throw err;
		}
		else{
			var productsRecord = [];
			var products = []
			for(let record in response){
				products.push(response[record].product_name);
				productsRecord.push([response[record].item_id, response[record].product_name, response[record].price]);
			}
			console.table(['ID', 'Product', 'Cost'], productsRecord);
			inquirer.prompt([
			{
				name: 'user_purchase',
				message: 'Select an item you wish to purchase',
				type: 'list',
				choices: products
			},{
				name: 'purchase_quantity',
				message: 'How much of this item would you like?',
				type: 'input'
			}
			]).then(function (response) {
				processUserInput(response);
	
			});
		}
	});
};

displayMainMenu();
