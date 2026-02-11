import express from "express";
import cors from "cors";
import sql from "msnodesqlv8";

const app = express();
app.use(cors());
app.use(express.json());

const connectionString =
  "Driver={ODBC Driver 17 for SQL Server};Server=.;Database=TestDB;Trusted_Connection=Yes;";

// INSERT ROUTE
app.post("/insert-customer", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "All fields required" });
  }

  const query =
    "INSERT INTO Customers (name, email, phoneNumber) VALUES (?, ?, ?)";

  sql.query(connectionString, query, [name, email, phone], (err) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Customer inserted successfully" });
  });
});

// SELECT ROUTE
app.get("/customers", (req, res) => {
  const query = "SELECT * FROM Customers";

  sql.query(connectionString, query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
