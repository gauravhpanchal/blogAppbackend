const mongoose = require("mongoose");
require("dotenv").config();

// const connection = mongoose.connect("mongodb://127.0.0.1:27017/BlogAppBackend");
const connection = mongoose.connect(process.env.URL);

module.exports = { connection };
