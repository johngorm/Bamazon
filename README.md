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

## Bamazon Customer

`node bamazonCustomer.js`

## Bamazon Manager

`node bamazonManager.js`
