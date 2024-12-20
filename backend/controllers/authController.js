const {
  loginLogic,
  registerLogic,
  userDetailsLogic,
  generateOtpCodeLogic,
  verifyOtpLogic,
  resetPasswordLogic,
} = require("../businessLogic/authLogic");

const loginController = async (req, res) => {
  const user = await loginLogic(req.body);
  if (user.error) {
    return res.status(401).json({ error: user.error });
  } else {
    let cookieOptions = {
      maxAge:
        req.body.rememberMe === true
          ? 7 * 24 * 60 * 60 * 1000
          : 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/",
    };
    if (process.env.ENV === "production") {
      cookieOptions.secure = true;
      cookieOptions.sameSite = "None";
    }
    res.cookie("token", user.token, cookieOptions);
    return res.status(200).json("Logged in successfully");
  }
};

const registerController = async (req, res) => {
  const user = await registerLogic(req.body);
  if (user.error) {
    return res.status(400).json({ error: user.error });
  } else {
    return res.status(201).json(user);
  }
};

const userDetailsController = async (req, res) => {
  const user = await userDetailsLogic(req.user.payload);
  if (user.error) {
    return res.status(400).json({ error: user.error });
  } else {
    return res.status(200).json(user);
  }
};

const generateOtpCode = async (req, res) => {
  const user = await generateOtpCodeLogic(req.body);
  if (user.error) {
    return res.status(400).json({ error: user.error });
  } else {
    return res.status(200).json(user);
  }
};

const verifyOtpCode = async (req, res) => {
  const user = await verifyOtpLogic(req.body);
  if (user.error) {
    return res.status(400).json({ error: user.error });
  } else {
    return res.status(200).json(user);
  }
};

const resetPasswordController = async (req, res) => {
  const user = await resetPasswordLogic(req.body);
  if (user.error) {
    return res.status(400).json({ error: user.error });
  } else {
    return res.status(200).json(user);
  }
};

module.exports = {
  loginController,
  registerController,
  userDetailsController,
  generateOtpCode,
  verifyOtpCode,
  resetPasswordController,
};
