const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const { PDFDocument } = require("pdf-lib");
const mysql = require("mysql2/promise");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");

let custom_ID;

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MySQL Connection
const connectionPromise = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "236951Arjit",
  database: "Insurance8",
});
const generateRandomNumber = () => {
  // Generate a random number between 100000 and 999999
  return Math.floor(Math.random() * 900000) + 100000;
};
/**@type {mysql.Connection} */
let connection;

connectionPromise
  .then((conn) => {
    console.log("MySQL connected with id", conn.threadId);
    connection = conn;
  })
  .catch((err) => {
    console.error("Failed to create mysql connection. Error:", err);
  });
// unique id generator
function generateUniqueId() {
  const uuid = uuidv4(); // Generate UUID
  return uuid.replace(/-/g, "").substring(0, 10); // Remove dashes and take the first 20 characters
}

// Check if the ID already exists in the database
async function checkIdExists(id, callback) {
  await connectionPromise;

  try {
    const [results] = await connection.query(
      "SELECT COUNT(*) AS count FROM Customer WHERE Cust_id = ?",
      [id]
    );
    const count = results[0].count;
    callback(null, count > 0);
  } catch (err) {
    callback(err);
  }
}

// Generate a unique ID that doesn't already exist in the database
function generateUniqueDatabaseId(callback) {
  let id = generateUniqueId();
  console.log("catch error");
  checkIdExists(id, (err, exists) => {
    if (err) {
      console.log("2nd error");
      callback(err);
      return;
    }
    if (exists) {
      generateUniqueDatabaseId(callback);
    } else {
      callback(null, id);
    }
  });
}

// Function to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  } else {
    res.redirect("/auth");
  }
}

app.get("/quote", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "quote.html"));
});

app.get("/vehicle", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "vehicle.html"));
});
//Customer Profile form
app.get("/app", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "app.html"));
});

app.get("/customer2", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "customer2.html"));
});

app.get("/customer", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "customer.html"));
});

app.get("/main", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "side.html"));
});

app.get("/sucess", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "sucess.html"));
});

app.get("/pol1", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "pol1.html"));
});

app.get("/pol2", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "pol2.html"));
});

app.get("/pol3", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "pol3.html"));
});

app.get("/pol4", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "pol4.html"));
});

app.get("/claim", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "claim.html"));
});

app.get("/policy", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "policy.html"));
});

app.get("/insurance", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "insurance.html"));
});

app.get("/incident", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "incident.html"));
});

// Route to serve login.html
app.get("/auth", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/signup", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "customer.html"));
});

app.get("/filled_success", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "filled_success.html"));
});
app.get("/fil_suc", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "fil_suc.html"));
});

app.get("/custom", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "custom.html"));
});
app.get("/policyRe", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "policyRe.html"));
});

app.get("/pol_rene", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "pol_rene.html"));
});
app.get("/incident", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "incident.html"));
});

app.get("/payment", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "payment.html"));
});
// USERS:
// Assuming you have already set up your Express app and established a connection to MySQL

app.get("/rece", async (req, res) => {
  try {
    // Retrieve the Cust_Id cookie value from the request object
    const custId = req.cookies.Cust_Id;

    // Execute query to fetch receipts for the specific customer
    const [rows] = await connection.query(
      "SELECT Receipt_Id,Time,Cost, Premium_Payment_Id,Cust_Id FROM RECEIPT WHERE Cust_Id = ?",
      [custId]
    );

    // Render the 'rece.ejs' template and pass the fetched data to it
    res.render("rece", { rece: rows });
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).send("Error fetching receipts");
  }
});

app.get("/users", async (req, res) => {
  try {
    // Execute query to fetch users from the 'customer' table
    const [rows] = await connection.query("SELECT * FROM customer");

    // Render the 'users.ejs' template and pass the fetched data to it
    res.render("users", { users: rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

app.get("/signup2", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup2.html"));
});
app.get("/main", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/prepayment", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "prepayment.html"));
});

app.get("/receipt", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "receipt.html"));
});

// Route to handle login form submission
app.post("/customer2", async (request, response) => {
  await connectionPromise;
  const {
    custId,
    custFName,
    custLName,
    custDOB,
    custGender,
    custAddress,
    custNumber,
    cust_Pass_Number,
    custMarital,
    cust_PPS_number,
  } = request.body;

  const sql = `UPDATE CUSTOMER 
             SET 
               Cust_FName = ?,
               Cust_LName = ?,
               Cust_DOB = ?,
               Cust_Gender = ?,
               Cust_Address = ?,
               Cust_MOB_Number = ?,
               Cust_Passport_Number = ?,
               Cust_Marital_Status = ?,
               Cust_PPS_Number = ?,
               cust_tag = ?
             WHERE 
               Cust_Id = ?`;
  const values = [
    custFName,
    custLName,
    custDOB,
    custGender,
    custAddress,
    custNumber,
    cust_Pass_Number,
    custMarital,
    cust_PPS_number,
    "customer",
    custId, // Cust_Id for WHERE clause
  ];

  console.log("Inserting values into database...");

  try {
    const [results, fields] = await connection.query(sql, values);
    console.log("Insert successful:", results);

    response.redirect("/filled_success");
  } catch (err) {
    console.error("Error inserting values into database:", err);
    response.json({
      error: err,
    });
  }
});
app.post("/auth", async (request, response) => {
  await connectionPromise;

  let username = request.body.username;
  let password = request.body.password;

  if (username && password) {
    try {
      const [results, fields] = await connection.query(
        "SELECT * FROM CUSTOMER WHERE Cust_Email = ? AND Cust_Password = ?",
        [username, password]
      );

      // Check if there are any results
      if (results.length > 0) {
        // Fetch the tag of the user
        const Tag = results[0].Cust_Tag;
        const custId = results[0].Cust_Id; // Get the Cust_Id
        console.log("Tag of the user:", Tag, custId);
        custom_ID = custId;
        console.log(custom_ID);
        // Set a cookie with the Cust_Id
        response.cookie("Cust_Id", custId);

        // Redirect based on the tag
        if (Tag === "customer") {
          console.log("Before redirecting to /main");
          request.session.authenticated = true;
          response.redirect("/main");
          console.log("After redirecting to /main");
        } else if (Tag === "admin") {
          request.session.authenticated = true;
          response.redirect("/dashboard");
        } else {
          // Handle unexpected tag values
          response.status(500).send("Unexpected tag value for user");
        }
      } else {
        console.log("wtf is the error");
        // Handle case when no results found
        response.redirect(
          "/auth?error=Incorrect%20Username%20and/or%20Password!"
        );
      }
    } catch (err) {
      console.error("Error executing SQL query:", err);
      response.status(500).send("Internal Server Error");
    }
  } else {
    response.send("Please enter Username and Password!");
  }
});

app.post("/insurance", async (req, res) => {
  await connectionPromise;
  console.log(custom_ID);
  // Generate a unique ID for the insurance entry
  generateUniqueDatabaseId(async (err, uniqueId) => {
    if (err) {
      console.error("Error generating unique ID:", err);
      res.status(500).send("Error generating unique ID");
      return;
    }
    console.log(custom_ID);
    console.log("hello");
    console.log(uniqueId);
    const { startDate, expiryDate, termConditionDescription } = req.body;

    const sql = `INSERT INTO INSURANCE_POLICY 
                (Policy_Number, Start_Date, Expiry_Date, Term_Condition_Description, Cust_Id) 
                VALUES (?, ?, ?, ?, ?)`;
    const values = [
      uniqueId,
      startDate,
      expiryDate,
      termConditionDescription,
      custom_ID,
    ];

    try {
      const [results, fields] = await connection.query(sql, values);
      console.log(results);
      console.log(fields);

      res.redirect("/policyRe");
    } catch (err) {
      res.json({
        error: err,
      });
    }
  });
});
app.post("/claim", async (req, res) => {
  try {
    // Assuming custom_ID is stored in the session or request object
    const custom_ID = req.session.custom_ID; // Adjust this based on how custom_ID is stored

    generateUniqueDatabaseId(async (err, uniqueId) => {
      if (err) {
        console.error("Error generating unique ID:", err);
        res.status(500).send("Error generating unique ID");
        return;
      }

      console.log("Generated unique ID:", uniqueId);
      console.log(req.cookies.Cust_Id);

      const { claimAmount, damageType, claimDate } = req.body;

      const sql = `INSERT INTO CLAIM (Claim_Id ,Claim_Amount, Incident_Id, Damage_Type, Date_Of_Claim, Claim_Status, Cust_Id)
      VALUES (?, ?, ?, ?, ?, ?, ?);
      `;

      const values = [
        uniqueId,
        claimAmount,
        req.cookies.incidentId,
        damageType,
        claimDate,
        "Approved",
        req.cookies.Cust_Id,
      ];

      console.log("Inserting values into database...");

      const [results, fields] = await connection.query(sql, values);
      console.log("Insert successful:", results);

      res.redirect("/payment");
    });
  } catch (err) {
    console.error("Error inserting values into database:", err);
    res.json({
      error: err,
    });
  }
});

app.post("/signup", async (req, res) => {
  await connectionPromise;

  console.log("Received POST request to create customer");

  // Generate a unique ID for the customer entry
  generateUniqueDatabaseId(async (err, uniqueId) => {
    if (err) {
      console.error("Error generating unique ID:", err);
      res.status(500).send("Error generating unique ID");
      return;
    }
    console.log("Generated unique ID:", uniqueId);

    const {
      custFName,
      custLName,
      custDOB,
      custGender,
      custAddress,
      custNumber,
      custEmail,
      cust_Pass_Number,
      custMarital,
      cust_PPS_number,
      cust_Password,
    } = req.body;

    const sql = `INSERT INTO CUSTOMER 
                (Cust_Id, 
                  Cust_FName, 
                  Cust_LName, 
                  Cust_DOB, 
                  Cust_Gender, 
                  Cust_Address, 
                  Cust_MOB_Number, 
                  Cust_Email, 
                  Cust_Passport_Number, 
                  Cust_Marital_Status, 
                  Cust_PPS_Number,
                  Cust_Password,
                  Cust_Tag) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      uniqueId, // Assign uniqueId to Cust_Id
      custFName,
      custLName,
      custDOB,
      custGender,
      custAddress,
      custNumber,
      custEmail,
      cust_Pass_Number,
      custMarital,
      cust_PPS_number,
      cust_Password,
      "customer",
    ];

    console.log("Inserting values into database...");

    try {
      const [results, fields] = await connection.query(sql, values);
      console.log("Insert successful:", results);

      res.redirect("/filled_success");
    } catch (err) {
      console.error("Error inserting values into database:", err);
      res.json({
        error: err,
      });
    }
  });
});

app.post("/signup2", async (req, res) => {
  await connectionPromise;

  console.log("Received POST request to create customer");

  // Generate a unique ID for the customer entry
  generateUniqueDatabaseId(async (err, uniqueId) => {
    if (err) {
      console.error("Error generating unique ID:", err);
      res.status(500).send("Error generating unique ID");
      return;
    }
    console.log("Generated unique ID:", uniqueId);

    const {
      custFName,
      custLName,
      custDOB,
      custGender,
      custAddress,
      custNumber,
      custEmail,
      cust_Pass_Number,
      custMarital,
      cust_PPS_number,
      cust_Password,
    } = req.body;

    const sql = `INSERT INTO CUSTOMER 
                (Cust_Id, 
                  Cust_FName, 
                  Cust_LName, 
                  Cust_DOB, 
                  Cust_Gender, 
                  Cust_Address, 
                  Cust_MOB_Number, 
                  Cust_Email, 
                  Cust_Passport_Number, 
                  Cust_Marital_Status, 
                  Cust_PPS_Number,
                  Cust_Password,
                  Cust_Tag) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      uniqueId, // Assign uniqueId to Cust_Id
      custFName,
      custLName,
      custDOB,
      custGender,
      custAddress,
      custNumber,
      custEmail,
      cust_Pass_Number,
      custMarital,
      cust_PPS_number,
      cust_Password,
      "customer",
    ];

    console.log("Inserting values into database...");

    try {
      const [results, fields] = await connection.query(sql, values);
      console.log("Insert successful:", results);

      res.redirect("/fil_suc");
    } catch (err) {
      console.error("Error inserting values into database:", err);
      res.json({
        error: err,
      });
    }
  });
});
app.post("/custom", async (req, res) => {
  await connectionPromise;

  console.log("Received POST request to create customer");

  // Generate a unique ID for the customer entry

  const { custId } = req.body;

  const sql = `DELETE FROM CUSTOMER WHERE Cust_Id = ?`;
  const values = [custId];

  console.log("Inserting values into database...");

  try {
    const [results, fields] = await connection.query(sql, values);
    console.log("Insert successful:", results);

    res.redirect("/filled_success");
  } catch (err) {
    console.error("Error inserting values into database:", err);
    res.json({
      error: err,
    });
  }
});

app.post("/quote", async (req, res) => {
  await connectionPromise;
  // Generate a unique ID for the insurance entry
  generateUniqueDatabaseId(async (err, uniqueId) => {
    if (err) {
      console.error("Error generating unique ID:", err);
      res.status(500).send("Error generating unique ID");
      return;
    }
    console.log(custom_ID);
    console.log("custom");
    console.log(uniqueId);

    const {
      issueDate,
      validFromDate,
      validTillDate,
      description,
      coverageLevel,
    } = req.body;

    const sql = `INSERT INTO QUOTE (Quote_Id, Issue_Date, Valid_From_Date, Valid_Till_Date, Description, Coverage_Level, Cust_Id)
    VALUES (?,?, ?, ?, ?, ?, ?);
    `;
    const values = [
      uniqueId,
      issueDate,
      validFromDate,
      validTillDate,
      description,
      coverageLevel,
      custom_ID,
    ];

    try {
      const [results, fields] = await connection.query(sql, values);
      console.log(results);
      console.log(fields);

      res.redirect("/incident");
    } catch (err) {
      res.json({
        error: err,
      });
    }
  });
});
app.post("/insurance", async (req, res) => {
  await connectionPromise;
  console.log(custom_ID);
  // Generate a unique ID for the insurance entry
  generateUniqueDatabaseId(async (err, uniqueId) => {
    if (err) {
      console.error("Error generating unique ID:", err);
      res.status(500).send("Error generating unique ID");
      return;
    }
    console.log(custom_ID);
    console.log("hello");
    console.log(uniqueId);
    const { startDate, expiryDate, termConditionDescription } = req.body;

    const sql = `INSERT INTO INSURANCE_POLICY 
                (Policy_Number, Start_Date, Expiry_Date, Term_Condition_Description, Cust_Id) 
                VALUES (?, ?, ?, ?, ?)`;
    const values = [
      uniqueId,
      startDate,
      expiryDate,
      termConditionDescription,
      custom_ID,
    ];

    try {
      const [results, fields] = await connection.query(sql, values);
      console.log(results);
      console.log(fields);

      res.redirect("/policyRe");
    } catch (err) {
      res.json({
        error: err,
      });
    }
  });
});

app.post("/incident", async (req, res) => {
  await connectionPromise;
  // Generate a unique ID for the insurance entry
  generateUniqueDatabaseId(async (err, uniqueId) => {
    if (err) {
      console.error("Error generating unique ID:", err);
      res.status(500).send("Error generating unique ID");
      return;
    }
    console.log("incident");
    console.log(custom_ID);
    console.log("hello");
    console.log(uniqueId);

    const { incidentType, incidentDate, description } = req.body;

    const sql = `INSERT INTO INCIDENT (Incident_Id,Incident_Type,Incident_Date,Description)
    VALUES (?,?, ?, ?);
    `;
    const values = [uniqueId, incidentType, incidentDate, description];

    try {
      const [results, fields] = await connection.query(sql, values);
      console.log(results);
      console.log(fields);
      res.cookie("incidentId", uniqueId, { maxAge: 900000, httpOnly: true });
      res.redirect("/claim");
    } catch (err) {
      res.json({
        error: err,
      });
    }
  });
});

app.post("/prepayment", async (req, res) => {
  await connectionPromise;

  // Generate a unique ID for the insurance entry
  generateUniqueDatabaseId(async (err, uniqueId) => {
    if (err) {
      console.error("Error generating unique ID:", err);
      res.status(500).send("Error generating unique ID");
      return;
    }

    // Generate a random receipt ID
    const receiptId = generateRandomNumber();

    console.log("incident");
    console.log(custom_ID);
    console.log("hello");
    console.log(uniqueId);
    console.log("receiptId:", receiptId);

    const { policyNumber, premiumPaymentAmount } = req.body;

    const sql = `INSERT INTO PREMIUM_PAYMENT (Premium_Payment_Id, Policy_Number, Premium_Payment_Amount, Receipt_Id, Cust_Id)
             VALUES (?, ?, ?, ?, ?);`;
    const sql1 = `INSERT INTO RECEIPT (Receipt_Id , Cost ,Premium_Payment_Id ,Cust_Id)
    VALUES (?, ?, ?, ?);`;
    const values1 = [
      receiptId,
      premiumPaymentAmount,
      uniqueId,
      req.cookies.Cust_Id,
    ];
    const values = [
      uniqueId,
      policyNumber,
      premiumPaymentAmount,
      receiptId,
      req.cookies.Cust_Id,
    ];

    try {
      const [results, fields] = await connection.query(sql, values);
      const [result, field] = await connection.query(sql1, values1);
      console.log(result);
      console.log(field);
      console.log(results);
      console.log(fields);
      res.cookie("receiptId", receiptId);
      res.redirect("/main");
    } catch (err) {
      res.json({
        error: err,
      });
    }
  });
});

app.post("/receipt", async (req, res) => {
  await connectionPromise;

  // Generate a unique ID for the insurance entry
  generateUniqueDatabaseId(async (err, uniqueId) => {
    if (err) {
      console.error("Error generating unique ID:", err);
      res.status(500).send("Error generating unique ID");
      return;
    }

    // Generate a random receipt ID

    console.log("incident");
    console.log(custom_ID);
    console.log("hello");
    console.log(uniqueId);
    console.log("receiptId:", receiptId);

    const { policyNumber, premiumPaymentAmount } = req.body;

    const sql = `INSERT INTO PREMIUM_PAYMENT (Premium_Payment_Id, Policy_Number, Premium_Payment_Amount, Receipt_Id, Cust_Id)
             VALUES (?, ?, ?, ?, ?);`;

    const values = [
      uniqueId,
      policyNumber,
      premiumPaymentAmount,
      receiptId,
      req.cookies.Cust_Id,
    ];

    try {
      const [results, fields] = await connection.query(sql, values);
      console.log(results);
      console.log(fields);

      res.redirect("/receipt");
    } catch (err) {
      res.json({
        error: err,
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
