const express = require("express");
const { dbConnection } = require("./database/config");
require("dotenv").config();
const cors = require("cors");

//express server
const app = express();

//Database
dbConnection();

//CORS
app.use(cors());

//Public directory
app.use(express.static("public"));

//Body reading/parsing
app.use(express.json());

//Routes
app.use("/api/auth", require("./routes/auth"));

//Listen to petitions
app.listen(process.env.PORT, () => {
    console.log(`Server Running on port ${process.env.PORT}`);
});
