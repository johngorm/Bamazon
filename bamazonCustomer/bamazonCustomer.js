var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table'); 
var config = require('./config.js');
var connection = mysql.createConnection(config);

function processUserInput(input) {

	let purchase_quantity = parseInt(input.purchase_quantity, 10);
	let product = input.user_purchase;
	if(!isNaN(purchase_quantity)){
		connection.query('SELECT price, stock_quantity FROM products WHERE ?', { product_name: product}, (err,res) => {
			if(err){
				throw err;
			}
			else if(purchase_quantity <= res[0].stock_quantity){
				let total_cost = (res[0].price * purchase_quantity).toFixed(2);
				let new_stock_quantity = res[0].stock_quantity - purchase_quantity;
				console.log(`\nYou have purchased ${purchase_quantity} ${product}(s).\nTotal cost: $${total_cost}`);
				
				updateDBStock(product, new_stock_quantity);
				
			}
			else{
				console.error('\n\nWe do not have enough stock to meet your request. Sorry');
				
			}
			displayMainMenu();
		});		
	}
	else{
		console.error('Quantity input is not valid. Please enter a positive whole number');
		displayProducts();
	}
};

function updateDBStock(item, new_stock){
	connection.query('UPDATE products SET stock_quantity = ? WHERE product_name = ?', [new_stock,item], (err,res) =>{
		if(err){
			throw err;
		}
	});
};

function displayProducts(){
	connection.query('SELECT * FROM products', (err,response) => {
		if(err){
			throw err;
		}
		else{
			var productsRecord = [];
			var products = []
			for(let record in response){
				products.push(response[record].product_name);
				productsRecord.push([response[record].item_id, response[record].product_name, '$' + response[record].price.toFixed(2)]);
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

function displayMainMenu() {
	inquirer.prompt([
	{
		name: 'shop',
		message: 'Welcome to Bamazon! To begin shopping, type "Y". (Type "n" to leave store)',
		type: 'confirm'
	}
	]).then(function(userInput){
		if(userInput.shop){
			displayProducts();
		}
		else{
			connection.end();
			process.exit();
		}
	});
}


connection.connect( (err,res) => {
	if(err){
		throw err;
	}
});

displayMainMenu();
