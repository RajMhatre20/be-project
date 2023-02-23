const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();


//connect to DB
mongoose.set('strictQuery', true);
mongoose
  .connect("mongodb://0.0.0.0:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB database:", error);
  });

//midlleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/files");

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

//middleware error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error");
});

//start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
