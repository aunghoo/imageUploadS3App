const express = require('express');
const multer = require('multer');
const cors = require('cors');
const uploadRoute = require("./routes/uploadRoute");
const path = require("path");
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname + "public")));
app.use(cors());
app.use("/api", uploadRoute); //added for file upload route

const PORT = 5000;

app.listen(PORT);
console.log('api running on port: ' + PORT);
