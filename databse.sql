DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(200) NOT NULL,
  department_name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NULL,
  quantity INT NULL,
  PRIMARY KEY (item_id)
);


ALTER TABLE products ADD product_sales DECIMAL(10,2) DEFAULT 0;

USE bamazon;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(200) NOT NULL,
  over_head_costs INT NULL,
  PRIMARY KEY (department_id)
);

SELECT * FROM products;

UPDATE products SET quantity = 300  WHERE item_id =  10;
