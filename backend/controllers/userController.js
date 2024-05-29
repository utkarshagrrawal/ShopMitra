const {
  updateProfileLogic,
  deleteUserLogic,
} = require("../businessLogic/userLogic");

const updateUserProfileController = async (req, res) => {
  const response = await updateProfileLogic(req.body);
  if (response.error) {
    return res.status(400).send(response.error);
  }
  return res.status(200).send(response.message);
};

const deleteUserController = async (req, res) => {
  const response = await deleteUserLogic(req.user);
  if (response.error) {
    return res.status(400).send(response.error);
  }
  return res.status(200).send(response.message);
};

module.exports = {
  updateUserProfileController,
  deleteUserController,
};
