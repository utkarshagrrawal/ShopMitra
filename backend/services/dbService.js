const mongoose = require("mongoose");

async function main() {
  mongoose
    .connect("mongodb://localhost:27017/shopmitra")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
}

module.exports = main;
