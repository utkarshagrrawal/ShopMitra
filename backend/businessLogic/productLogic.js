const { Product } = require("../models/productModel");
const { Wishlist } = require("../models/wishlistModel");

const fetchProductsLogic = async (query) => {
  const { q, page } = query;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" }, _id: 1 })
      .skip(skip)
      .limit(limit);

    return { products };
  } catch (error) {
    return { error: error };
  }
};

const addProductToWishlistLogic = async (query, user) => {
  const { productId } = query;
  const { email } = user;

  try {
    const isWishlistExists = await Wishlist.findOne({ email: email });
    if (!isWishlistExists) {
      await Wishlist.create({
        email: email,
        products: [{ product: productId }],
      });
      return { message: "Product added to wishlist" };
    }
    const isProductInWishlist = await Wishlist.findOne({
      email: email,
      products: { $elemMatch: { product: productId } },
    });
    if (isProductInWishlist) {
      await Wishlist.updateOne(
        { email: email },
        { $pull: { products: { product: productId } } }
      );
      return { message: "Product removed from wishlist" };
    } else {
      await Wishlist.updateOne(
        { email: email },
        { $push: { products: { product: productId } } }
      );
      return { message: "Product added to wishlist" };
    }
  } catch (error) {
    return { error: error };
  }
};

module.exports = {
  fetchProductsLogic,
  addProductToWishlistLogic,
};
