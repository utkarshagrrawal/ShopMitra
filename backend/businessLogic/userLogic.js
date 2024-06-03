const { Product } = require("../models/productModel");
const { User } = require("../models/userModel");
const { Wishlist } = require("../models/wishlistModel");
const {
  generateHashedPassword,
  generateSalt,
} = require("../services/passportService");

const updateProfileLogic = async (body) => {
  let { name, email, phone, address, date_of_birth } = body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return { error: "User not found" };
  }

  address = address || user.address;
  date_of_birth = date_of_birth || user.date_of_birth;
  name = name || user.name;
  phone = phone || user.phone;

  try {
    await User.updateOne(
      { email: email },
      { name, phone, address, date_of_birth }
    );
    return { message: "Profile updated successfully" };
  } catch (error) {
    return { error: error };
  }
};

const changeUserPasswordLogic = async (body, user) => {
  let { currentPassword, newPassword } = body;
  const { email } = user;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return { error: "User not found" };
    }
    const existingHashedPassword = await generateHashedPassword(
      user.password,
      user.hash_code
    );
    if (currentPassword !== existingHashedPassword) {
      return { error: "Invalid password" };
    }
    const salt = await generateSalt();
    const hashedPassword = await generateHashedPassword(newPassword, salt);
    await User.updateOne(
      { email: email },
      { password: hashedPassword, hash_code: salt }
    );
    return { message: "Password updated successfully" };
  } catch (error) {
    return { error: error };
  }
};

const notificationPreferencesUpdateLogic = async (body, user) => {
  const { email } = user;
  const notificationPreferences = body;

  try {
    await User.updateOne(
      { email: email },
      { notification_preferences: notificationPreferences }
    );
    return { message: "Notification preferences updated successfully" };
  } catch (error) {
    return { error: error };
  }
};

const deleteUserLogic = async (user) => {
  try {
    await User.updateOne({ email: user.email }, { isDeleted: true });
    return { message: "User deleted successfully" };
  } catch (error) {
    return { error: error };
  }
};

const fetchUserWislistLogic = async (user) => {
  const { email } = user;
  try {
    const wishlist = await Wishlist.findOne({ email: email });
    let products = [];
    if (wishlist) {
      await Promise.all(
        wishlist.products.map(async (product) => {
          const productDetails = await Product.findOne({
            _id: product.product,
          });
          products.push(productDetails);
        })
      );
    }
    return { wishlist: products };
  } catch (error) {
    return { error: error };
  }
};

module.exports = {
  updateProfileLogic,
  changeUserPasswordLogic,
  notificationPreferencesUpdateLogic,
  deleteUserLogic,
  fetchUserWislistLogic,
};
