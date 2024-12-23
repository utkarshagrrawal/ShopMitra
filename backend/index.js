const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const {
  main: mongodbConnect,
  checkMongoDBConnection,
} = require("./services/dbService");
const { logRequests } = require("./middlewares/loggingMiddleware");
const requestRateLimiter = require("./models/limiterModel");

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
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(logRequests);
app.set("trust proxy", 1);

app.use(async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
  const isIPLogged = await requestRateLimiter.findOne({
    ip,
  });
  if (isIPLogged) {
    if (isIPLogged.expireAt < Date.now()) {
      await requestRateLimiter.updateOne(
        { ip },
        { count: 20, expireAt: Date.now() + 1000 * 60 }
      );
    } else if (isIPLogged.count <= 0) {
      return res.status(429).json({ error: "Too many requests" });
    } else {
      await requestRateLimiter.updateOne({ ip }, { $inc: { count: -1 } });
    }
  } else {
    const requestRateControl = requestRateLimiter({
      ip,
      count: 20,
      expireAt: Date.now() + 1000 * 60,
    });
    await requestRateControl.save();
  }
  next();
});

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
