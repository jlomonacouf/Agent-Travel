SHOW TABLES;


/*EXAMPLE*/

/*
DROP TABLE IF EXISTS products, customers, orders, userCart, itemCart;
SHOW TABLES;
CREATE TABLE customers(id SERIAL, fname VARCHAR(255), lname VARCHAR(255), 
		username VARCHAR(255),email VARCHAR(255), UNIQUE(id, username));

CREATE TABLE products(itemId SERIAL, name VARCHAR(255), msrp DECIMAL(6,2), salePrice DECIMAL(8,2), 
	upc INT, shortDescription VARCHAR(255), brandName VARCHAR(255), 
	size VARCHAR(255), color VARCHAR(255), gender VARCHAR(255), UNIQUE(itemId));

CREATE TABLE carts(cartId SERIAL, username VARCHAR(255), binaryNum INT); 

CREATE TABLE purchase(cartId INT, itemId INT, binaryNum INT); 

*/

SHOW TABLES;