require("dotenv").config();
const express = require("express");

const connectDB = require("./config/db");

const app = express();

connectDB(); // MongoDB Connection

// MIDDLEWARES
app.use(express.json({ extended: false })); // Body parser

app.get("/", (req, res) =>
   res.json({ msg: "Welcome to the ContactKeeper API" })
);

// ROUTES
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
   console.log(`Server running on http://localhost:${PORT}`)
);
