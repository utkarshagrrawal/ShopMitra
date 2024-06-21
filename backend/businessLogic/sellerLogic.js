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

module.exports = { fetchSellerDataLogic };
