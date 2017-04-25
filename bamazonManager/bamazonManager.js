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
