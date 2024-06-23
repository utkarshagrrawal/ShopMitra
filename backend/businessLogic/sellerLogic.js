const { Product } = require("../models/productModel");
const { Seller } = require("../models/sellerModel");
const { User } = require("../models/userModel");

const fetchSellerDataLogic = async (user) => {
  try {
    let productDetails, sellerProductsInfo;
    const { email } = user;
    const sellerDetails = await User.findOne({ email: email });
    if (!sellerDetails) {
      return { error: "Seller not found" };
    }
    sellerProductsInfo = await Seller.find({ email: email }).lean();
    if (!sellerProductsInfo || sellerProductsInfo.length === 0) {
      return { sellerDetails, sellerProductsInfo: {}, productDetails: [] };
    }
    productDetails = await Promise.all(
      sellerProductsInfo[0].products.map(async (item) => {
        const productInfo = await Product.findOne({
          _id: item.productId,
        }).lean();
        return productInfo;
      })
    );
    return { sellerDetails, productDetails, sellerProductsInfo };
  } catch (error) {
    return { error: error };
  }
};

const updateProductDetailsLogic = async (body, user, params) => {
  try {
    const { email } = user;
    const { id } = params;
    const { title, price, listPrice, imgUrl } = body;
    const isThisSellerProduct = await Seller.findOne({
      email: email,
      products: { $elemMatch: { productId: id } },
    });
    if (!isThisSellerProduct) {
      return { error: "Product not found" };
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      { title, price, listPrice, imgUrl },
      { new: true }
    );
    if (!updatedProduct) {
      return { error: "Error updating product" };
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
    const isThisSellerProduct = await Seller.findOne({
      email: email,
      products: { $elemMatch: { productId: id } },
    });
    if (!isThisSellerProduct) {
      return { error: "Product not found" };
    }
    const updatedProduct = await Seller.findOneAndUpdate(
      {
        email: email,
        "products.productId": id,
      },
      { $inc: { "products.0.stock": stock } },
      { new: true }
    );
    if (!updatedProduct) {
      return { error: "Error updating product" };
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
