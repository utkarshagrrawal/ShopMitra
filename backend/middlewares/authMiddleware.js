const jwt = require("jsonwebtoken");

const jwtVerify = async (token) => {
  try {
    const payload = jwt.verify(token, process.env.APP_SECRET_KEY);
    return { payload: payload };
  } catch (err) {
    return { error: err };
  }
};

const authenticate = async (req, res, next) => {
  let token = "";
  if (req.cookies?.token) {
    token = req.cookies.token;
  } else {
    res.status(401).json({ error: "Please login to proceed" });
    return;
  }
  const decodedPayload = await jwtVerify(token);
  if (decodedPayload.error) {
    let cookieOptions = {
      maxAge: 0,
      path: "/",
      httpOnly: true,
    };
    if (process.env.ENV === "production") {
      cookieOptions.secure = true;
      cookieOptions.SameSite = "None";
    }
    res.cookie("token", "", cookieOptions);
    res.status(401).json({ error: "Please login to proceed" });
    return;
  } else {
    req.user = decodedPayload;
    next();
  }
};

module.exports = {
  authenticate,
};
