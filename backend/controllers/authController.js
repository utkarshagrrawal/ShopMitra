const {
  loginLogic,
  registerLogic,
  userDetailsLogic,
} = require("../businessLogic/authLogic");

const loginController = async (req, res) => {
  const user = await loginLogic(req.body);
  if (user.error) {
    return res.status(401).json({ error: user.error });
  } else {
    return res.status(200).json(user);
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
  const user = await userDetailsLogic(req.user);
  if (user.error) {
    return res.status(400).json({ error: user.error });
  } else {
    return res.status(200).json({ user: user.user });
  }
};

module.exports = { loginController, registerController, userDetailsController };
