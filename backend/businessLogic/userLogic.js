const { User } = require("../models/userModel");

const updateProfileLogic = async (body) => {
  let { name, email, phone, address, dob } = body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return { error: "User not found" };
  }

  address = address || user.address;
  dob = dob || user.dob;
  name = name || user.name;
  phone = phone || user.phone;

  try {
    await User.updateOne({ email: email }, { name, phone, address, dob });
    return { message: "Profile updated successfully" };
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

module.exports = { updateProfileLogic, deleteUserLogic };
