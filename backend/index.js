const express = require("express");
const cors = require("cors");
const {
  main: mongodbConnect,
  checkMongoDBConnection,
} = require("./services/dbService");

mongodbConnect();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://shopmitra.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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
app.use("/seller", require("./routes/sellerRoute"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
