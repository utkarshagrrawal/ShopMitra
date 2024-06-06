const express = require("express");
const {
  deleteUserController,
  updateUserProfileController,
  changeUserPasswordController,
  notificationPreferencesUpdateController,
  fetchUserWislistController,
  fetchUserCartController,
} = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/update-profile", authenticate, updateUserProfileController);
router.post("/change-password", authenticate, changeUserPasswordController);
router.put(
  "/notification-preferences",
  authenticate,
  notificationPreferencesUpdateController
);
router.delete("/delete", authenticate, deleteUserController);
router.get("/wishlist", authenticate, fetchUserWislistController);
router.get("/cart", authenticate, fetchUserCartController);

module.exports = router;
