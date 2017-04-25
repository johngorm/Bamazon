var mysql = require('mysql');
var inquirer = require('inquirer');
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
		let recordArray = [];
		for(let record in res){
			recordArray.push(res[record]);
		}
		console.log('\n');
		console.table(recordArray);
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
				[newItem.name,newItem.department, newItem.price, newItem.stock],
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
	})
};

displayMenuOptions();
