const express = require("express");
const cors = require("cors");
const mongodbConnect = require("./services/dbService");

mongodbConnect();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/authRoute"));
app.use("/user", require("./routes/userRoute"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
