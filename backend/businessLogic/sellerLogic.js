const { OrderedProducts } = require("../models/orderedProducts");
const { Product } = require("../models/productModel");
const { User } = require("../models/userModel");

const fetchSellerDataLogic = async (user, query) => {
  try {
    const { email } = user;
    const { page } = query;
    const sellerDetails = await User.findOne({
      email: email,
      is_deleted: false,
      user_type: "seller",
    });
    if (!sellerDetails) {
      return { error: "Seller not found" };
    }
    const totalSellerProducts = await Product.find({
      sellerId: sellerDetails._id,
    }).count();
    const sellerProducts = await Product.find({
      sellerId: sellerDetails._id,
    })
      .lean()
      .sort({ title: 1 })
      .skip(page * 10 - 10)
      .limit(10);
    return { sellerDetails, sellerProducts, totalSellerProducts };
  } catch (error) {
    return { error: error };
  }
};

const fetchSellerOrders = async (user, query) => {
  try {
    const { email } = user;
    const { page } = query;
    const sellerDetails = await User.findOne({
      email: email,
      is_deleted: false,
      user_type: "seller",
    });
    if (!sellerDetails) {
      return { error: "Seller not found" };
    }
    const totalSellerProducts = await OrderedProducts.find({
      sellerId: sellerDetails._id,
    })
      .distinct(orderId)
      .count();
    const sellerProducts = await OrderedProducts.find({
      sellerId: sellerDetails._id,
    })
      .lean()
      .sort({ title: 1 })
      .skip(page * 10 - 10)
      .limit(10);
    return { sellerDetails, sellerProducts, totalSellerProducts };
  } catch (error) {
    return { error: error };
  }
};

const updateProductDetailsLogic = async (body, user, params) => {
  try {
    const { email } = user;
    const { id } = params;
    const { title, price, listPrice, imgUrl } = body;
    const userDetails = await User.findOne({
      email: email,
      user_type: "seller",
      is_deleted: false,
    });
    if (!userDetails) {
      return { error: "Seller not found" };
    }
    const updateIfThisIsSellerProduct = await Product.updateOne(
      { _id: id, sellerId: userDetails._id },
      { title, price, listPrice, imgUrl }
    );
    if (updateIfThisIsSellerProduct.matchedCount === 0) {
      return { error: "Product not found" };
    }
    return { message: "Product updated successfully" };
  } catch (error) {
    return { error: error };
  }
};

const addStockLogic = async (body, user, params) => {
  try {
    const { email } = user;
    const { id } = params;
    const { stock } = body;
    const userDetails = await User.findOne({
      email: email,
      user_type: "seller",
      is_deleted: false,
    });
    if (!userDetails) {
      return { error: "Seller not found" };
    }
    const updateIfThisIsSellerProduct = await Product.updateOne(
      { _id: id, sellerId: userDetails._id },
      { $inc: { stock: stock } }
    );
    if (updateIfThisIsSellerProduct.matchedCount === 0) {
      return { error: "Product not found" };
    }
    return { message: "Stock updated successfully" };
  } catch (error) {
    return { error: error };
  }
};

module.exports = {
  fetchSellerDataLogic,
  updateProductDetailsLogic,
  addStockLogic,
};
