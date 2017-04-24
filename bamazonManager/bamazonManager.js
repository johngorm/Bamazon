var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');





function displayMenuOptions(){
	inquirer.prompt([
	{
		name: 'manager_option',
		type: 'rawlist',
		message: 'Select your desired action.',
		choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
	}
	]).then(function(response) {
		var choice = response.manager_option;
		if(choice === 'View Products for Sale'){
			console.log('x');
		}
	})
};

displayMenuOptions();