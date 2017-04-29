# Bamazon
### Node.js e-commerce site using MySQL

There are three programs that run on a basic e-commerce database like Amazon. 
Before you can run these programs, you must create a MySQL table called products with the following schema:

```
CREATE TABLE IF NOT EXISTS products(
	item_id integer AUTO_INCREMENT NOT NULL,
	product_name varchar(100) NULL,
	department_name varchar(50) NULL,
	price DECIMAL(10,2) NULL,
	stock_quantity integer NULL,
	PRIMARY KEY(item_id)
);
```
After that, you need to create a JSON file called `config.js` that contains the following code : 

```
module.exports = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: '<database name here>'
};
```
Fill in the fields with your personal database options. Paste a copy of `config.js` in each *bamazon* directory.

All console inputs are handled using the `inquirer` node package

## Bamazon Customer

`node bamazonCustomer.js`

This program will allow you select and purchase items in the database. You select from the list of items and the provide the amount
you wish you buy.  If you request more than the current stock of an item, the transaction will not go through.
---
## Bamazon Manager

`node bamazonManager.js`

This program enables management of the database from the console. Users have the following options once the code begins execution: 

* View Database - Display all the items in the shop
* View Low Inventory - Display all items whose stock quantity is less than 5
* Add to Inventory - Increase the amount of an item in stock
* Add New Product - Add a new product to the database
* QUIT - Exit program


