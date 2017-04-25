const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

const connection = mysql.createConnection({
	host : 'localhost',
	port: 3306,

	user: 'root',

	password: '',
	database: 'Bamazon'
});

function displayDBProducts(){
	connection.query('SELECT * FROM products', (err, res) => {
		if(err){
			throw err;
		}
		let record_array = [];
		for(let record in res){
			record_array.push(res[record]);
		}
		console.log('\n');
		console.table(record_array);
		displayMenuOptions();
	});

};

function displayLowInventory(){
	connection.query('SELECT * from products WHERE stock_quantity < 5', (err, res) =>{
		if(err){
			throw err;
		}
		else{
			console.table(res);
		}
		displayMenuOptions();
	});

};

function addToInventory(){
	connection.query('SELECT product_name, stock_quantity FROM products', (err,res) =>{
		if(err){
			throw err;
		}
	
		let products = [];
		let quantity = []
		for(let record in res){
			products.push(res[record].product_name);
			quantity.push(res[record].stock_quantity);
		}
		inquirer.prompt([
		{
			name: 'selected_item',
			type: 'list',
			message: 'Select product you wish to increase stock',
			choices: products
		}, {
			name: 'increment_value',
			type: 'input',
			message: 'How much of the product do you wish to add to inventory?',

		}
		]).then(function (userInput){
			let increment_num = parseInt(userInput.increment_value);
			let stock_index;
			try{
				if(!increment_num){
					throw "Not an number"
				} 					
				if(increment_num < 0) {
					throw "Number is negative"
				}
			}	
			catch(err){
				console.error(err);
				displayMenuOptions();
			}
			
			for(var ii = 0; ii < products.length; ii++){
				if(products[ii] === userInput.selected_item){
					stock_index = ii; 
					break;
				}	
			}
			incrementProductStock(userInput.selected_item, increment_num, quantity[stock_index]);
		});
	
	});
	
};


function incrementProductStock(product, increment_amt, prev_stock){
	let new_stock = prev_stock + increment_amt;
	connection.query('UPDATE products SET stock_quantity = ? WHERE product_name = ?',[new_stock, product], (err,res) =>{
		if(err){
			throw err;
		}
		displayMenuOptions();

	});
};

function addNewProduct(){
	inquirer.prompt([
	{
		name: 'name',
		type: 'input',
		message: 'Enter the name of the product'
	}, {
		name: 'department',
		type: 'input',
		message: 'Enter the department in which the product belongs'
	},{
		name: 'price',
		type: 'input',
		message: 'Enter the price of the product'
	},{
		name: 'stock',
		type: 'input',
		message: 'Enter the amount of item in stock'
	}
	]).then(function(newItem){
		let price = parseFloat(newItem.price);
		let stock = parseInt(newItem.stock);
		if(!isNaN(price) && !isNaN(stock)){
			connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)', 
				[newItem.name,newItem.department, price.toFixed(2), stock],
				(err,res) =>{
					if(err){
						throw err;
					}
					displayMenuOptions();
			});
		}
		else{
			console.error('Invalid format for price and/or stock. Product not added to database');
			displayMenuOptions();
		}

	});
}



function displayMenuOptions(){
	inquirer.prompt([
	{
		name: 'manager_option',
		type: 'rawlist',
		message: 'Select your desired action.',
		choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'QUIT']
	}
	]).then(function(response) {
		var choice = response.manager_option;
		if(choice === 'View Products for Sale'){
			displayDBProducts();
		}
		else if(choice === 'View Low Inventory'){
			displayLowInventory();
		}
		else if(choice === 'Add to Inventory'){
			addToInventory();
		}
		else if(choice === 'Add New Product'){
			addNewProduct();
		}
		else{
			connection.end();
			process.exit();
		}
	});
};

displayMenuOptions();
