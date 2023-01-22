const express = require("express");
//const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const { client, db } = require("./Config/dbConfig.js");
const noteRoutes = require("./Routes/noteRoutes.js");

const PORT = process.env.PORT || 3003;
const app = express();
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/notes", noteRoutes);

//This is our basic request to our server(pingable without any inputs)
app.get("/", (req, res, next) => {
    
  res.status(200).json({
    statusCode: 200,
    status: "success",
    clientId: uuidv4(),
    timestamp: require("moment")().format("YYYY-MM-DD HH:mm:ss"),
    message: "Hello From Notes V1 Backend API CI version 1.0",
  });
});

app.listen(PORT, async () => {
  console.log(`Server Started Running on Port ${PORT}`);
});
