const express = require("express");
const mysql2 = require("mysql2");
const app = express();
const port = 3000;
app.use(express.json());
const db = mysql2.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  port: "3306",
  database: "sqlpractise",
});

db.connect((error) => {
  if (error) {
    console.log(`Fail To Connect With DB`);
  } else {
    console.log(`Connected Successfully With DB`);
  }
});

app.post("/createProductsTable", (req, res, next) => {
  const query = `
   CREATE TABLE Products(
    ProductId int PRIMARY KEY AUTO_INCREMENT,
    ProductName varchar(255),
    Price decimal(10,2) ,
    StockQuantity int ,
    SupplierID int,
    CONSTRAINT supplier_FK_KEY FOREIGN KEY (SupplierID) REFERENCES suppliers(SupplierID)     )
   `;
  db.execute(query, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "Create Products table Done" });
  });
});
app.post("/createSuppliersTable", (req, res, next) => {
  const query = `
   CREATE TABLE Suppliers(
    SupplierId int PRIMARY KEY AUTO_INCREMENT,
   SupplierName varchar(255),
   ContactNumber varchar(50)
    )
   `;
  db.execute(query, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res.status(200).json({ message: "Create Suppliers table Done" });
  });
});
app.post("/createSalesTable", (req, res, next) => {
  const query = `
   CREATE TABLE Sales(
    SalesID int PRIMARY KEY AUTO_INCREMENT,
    productID int ,
    QuantitySold int,
    SaleDate date
    CONSTRAINT sales_fk_key FOREIGN key (productID) REFERENCES products(productID),
    )
   `;
  db.execute(query, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res.status(200).json({ message: "create suppliers table Done" });
  });
});
app.patch("/product/addCategory", (req, res, next) => {
  const query = `ALTER TABLE PRODUCTS ADD COLUMN Category varchar(255)`;
  db.execute(query, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res.status(200).json({ message: "add category column table Done" });
  });
});
app.delete("/product/deleteCategory", (req, res, next) => {
  const query = `ALTER TABLE PRODUCTS drop COLUMN Category`;
  db.execute(query, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res.status(200).json({ message: "Create Suppliers table Done" });
  });
});
app.patch("/suppliers/changeContactNumber", (req, res, next) => {
  const query = `ALTER TABLE SUPPLIERS MODIFY COLUMN  ContactNumber VARCHAR(15) not null`;

  db.execute(query, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res
      .status(200)
      .json({ message: "change contactNumber column Done" });
  });
});
app.patch("/product/productName", (req, res, next) => {
  const query = `ALTER TABLE products MODIFY COLUMN  ProductName varchar(255) not null`;
  db.execute(query, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res.status(200).json({ message: "change ProductName column Done" });
  });
});
app.post("/suppliers/inserts", (req, res, next) => {
  const { SupplierName, ContactNumber } = req.body;
  if (!SupplierName || !ContactNumber) {
    return res
      .status(400)
      .json({ message: "SupplierName and ContactNumber are required" });
  }
  const query = `INSERT INTO suppliers (SupplierName, ContactNumber) VALUES (?, ?)`;
  db.execute(query, [SupplierName, ContactNumber], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res.status(201).json({ message: "Done", supplierId: data.insertId });
  });
});
app.post("/products/addProducts", (req, res, next) => {
  const { ProductName, Price, StockQuantity, SupplierID } = req.body;
  if (!ProductName || !Price || !StockQuantity || !SupplierID) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }
  const insertQuery = `insert into products (ProductName,Price,StockQuantity,SupplierID) values(?,?,?,?)`;
  db.execute(
    insertQuery,
    [ProductName, Price, StockQuantity, SupplierID],
    (error, data, fields) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Internal Server Error", error });
      }
      return res
        .status(201)
        .json({ message: "Done", productId: data.insertId });
    },
  );
});
app.patch("/products/updateBread", (req, res, next) => {
  const { Price } = req.body;
  if (!Price) {
    return res.status(400).json({ message: "Price field is required" });
  }
  const query = `update products set price=? where ProductId =2`;
  db.execute(query, [Price], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return data.affectedRows
      ? res.status(200).json({ message: "Bread updated successfully" })
      : res.status(500).json({ message: "Internal Server Error" });
  });
});
app.post("/sales/addRecord", (req, res, next) => {
  const { QuantitySold, SaleDate, productId } = req.body;
  if (!QuantitySold || !SaleDate || !productId) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }
  const insertQuery = `insert into sales (productID,QuantitySold,SaleDate) values(?,?,?)`;
  db.execute(
    insertQuery,
    [productId, QuantitySold, SaleDate],
    (error, data, fields) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Internal server Error", error });
      }
      return res
        .status(201)
        .json({ message: "Insertion Done", saleId: data.insertId });
    },
  );
});
app.patch("/products/update/Bread", (req, res, next) => {
  const { Price, productName } = req.body;
  if (!Price) {
    return res.status(404).json({ message: "All Fields Are Required" });
  }
  const query = `update products set Price=? where productName=?`;
  db.execute(query, [Price, productName], (error, result, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "updated Done" });
  });
});
app.delete("/products/deleteEggs", (req, res, next) => {
  const { productName } = req.body;
  if (!productName) {
    return res.status(404).json({ message: "All Fields Are Required" });
  }
  const query = `delete from products  where productName=?`;
  db.execute(query, [productName], (error, result, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "deleted Done" });
  });
});
app.get("/products/totalQuantitySold", (req, res, next) => {
  const query = `select  SUM(QuantitySold) from sales`;
  db.execute(query, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    } else {
      return res.status(200).json({ message: "Done", data });
    }
  });
});
app.get("/products/HighestStock", (req, res, next) => {
  const query = `SELECT ProductID, ProductName, Price, StockQuantity
FROM products
ORDER BY StockQuantity DESC
LIMIT 1`;
  db.execute(query, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    } else {
      return res.status(200).json({ message: "Done", data });
    }
  });
});
app.get("/suppliers/startingWith", (req, res, next) => {
  const { letter } = req.query;
  if (!letter) {
    return res.status(400).json({ message: "letter is required" });
  }
  const query = `SELECT * FROM suppliers WHERE SupplierName LIKE ?`;
  db.execute(query, [`${letter}%`], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res.status(200).json({ message: "Done", data });
  });
});
app.get("/products/productsNoSold", (req, res, next) => {
  const query = `select * from products left join sales on sales.productID=products.productID where sales.salesID is null`;
  db.execute(query, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "Done", data });
  });
});
app.get("/sales", (req, res, next) => {
  const query = `select sales.saleDate ,products.productName from sales left join products on products.productID=sales.productID`;
  db.execute(query, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "Done", data });
  });
});
// user
app.post("/user/create", (req, res, next) => {
  const query = `CREATE USER 'storeManager'@'localhost'`;
  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res.status(201).json({ message: "User created successfully" });
  });
});
app.post("/user/grantPermissions", (req, res, next) => {
  const grant = `GRANT SELECT, INSERT, UPDATE ON sqlpractise.* TO 'storeManager'@'localhost'`;
  db.query(grant, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res.status(200).json({ message: "Permissions added successfully" });
  });
});
app.delete("/user/revokeUpdate", (req, res, next) => {
  const query = `REVOKE UPDATE ON sqlpractise.* FROM 'storeManager'@'localhost'`;
  db.query(query, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res
      .status(200)
      .json({ message: "UPDATE permission revoked successfully" });
  });
});
app.post("/user/grantDelete", (req, res, next) => {
  const query = `grant delete on sqlpractise.sales to 'storeManager'@'localhost'`;
  db.query(query, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res
      .status(200)
      .json({ message: "Permission delete added successfully" });
  });
});
app.listen(port, () => {
  console.log(`Server is Running on port.....${port}🚀`);
});
