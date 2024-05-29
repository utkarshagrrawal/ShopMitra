const express = require("express");
const {
  deleteUserController,
  updateUserProfileController,
} = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/update-profile", authenticate, updateUserProfileController);
router.delete("/delete", authenticate, deleteUserController);

module.exports = router;
