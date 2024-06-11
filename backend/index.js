const express = require("express");
const cors = require("cors");
const {
  main: mongodbConnect,
  checkMongoDBConnection,
} = require("./services/dbService");

mongodbConnect();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (checkMongoDBConnection() !== 1) {
    mongodbConnect();
  }
  next();
});
app.use("/auth", require("./routes/authRoute"));
app.use("/user", require("./routes/userRoute"));
app.use("/products", require("./routes/productRoute"));
app.use("/orders", require("./routes/orderRoute"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
