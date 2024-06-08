const mongoose = require("mongoose");
require("dotenv").config();

async function main() {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
}

function checkMongoDBConnection() {
  return mongoose.connection.readyState;
}

module.exports = { main, checkMongoDBConnection };
