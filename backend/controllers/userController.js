const {
  updateProfileLogic,
  deleteUserLogic,
  changeUserPasswordLogic,
  notificationPreferencesUpdateLogic,
  fetchUserWislistLogic,
  fetchUserCartLogic,
} = require("../businessLogic/userLogic");

const updateUserProfileController = async (req, res) => {
  const response = await updateProfileLogic(req.body);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

const changeUserPasswordController = async (req, res) => {
  const response = await changeUserPasswordLogic(req.body, req.user.payload);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

const notificationPreferencesUpdateController = async (req, res) => {
  const response = await notificationPreferencesUpdateLogic(
    req.body,
    req.user.payload
  );
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

const deleteUserController = async (req, res) => {
  const response = await deleteUserLogic(req.user);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

const fetchUserWislistController = async (req, res) => {
  const response = await fetchUserWislistLogic(req.user.payload);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ wishlist: response.wishlist });
};

const fetchUserCartController = async (req, res) => {
  const response = await fetchUserCartLogic(req.user.payload);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ cart: response.cart });
};

module.exports = {
  updateUserProfileController,
  changeUserPasswordController,
  notificationPreferencesUpdateController,
  deleteUserController,
  fetchUserWislistController,
  fetchUserCartController,
};
