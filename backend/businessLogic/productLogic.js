const { User } = require("../models/userModel");
const { Product } = require("../models/productModel");
const { Wishlist } = require("../models/wishlistModel");
const { Cart } = require("../models/cartModel");
const { Order } = require("../models/orderModel");
const { Category } = require("../models/categoryModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");
const Review = require("../models/reviewModel");
const { OrderedProducts } = require("../models/orderedProducts");
const { default: mongoose } = require("mongoose");

const fetchProductsLogic = async (query) => {
  const { q, page } = query;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const [products, totalProducts] = await Promise.all([
      Product.find({ $text: { $search: q } }, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" }, _id: 1, stock: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments({
        $text: { $search: q },
      }),
    ]);

    return { products, totalProducts };
  } catch (error) {
    return { error: error.toString() };
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
    return { error: error.toString() };
  }
};

const fetchProductDetailsLogic = async (params, user) => {
  const { id } = params;
  try {
    const product = await Product.findOne({ _id: id });
    const isProductInWishlist = await Wishlist.findOne({
      products: { $elemMatch: { product: id } },
      email: user?.email,
    });
    return { product, isProductInWishlist: isProductInWishlist ? true : false };
  } catch (error) {
    return { error: error.toString() };
  }
};

const addRemoveProductToCartLogic = async (query, user) => {
  const { productId, operationType } = query;
  const { email } = user;

  try {
    const isProductInCart = await Cart.findOne({
      email: email,
      products: { $elemMatch: { product: productId } },
    });
    if (operationType === "add") {
      const doesCartExists = await Cart.findOne({ email: email });
      const doesThisProductExists = await Product.findById(productId);
      if (!doesThisProductExists) {
        return { error: "Product not found" };
      }
      if (!doesCartExists) {
        await Cart.create({
          email: email,
          products: [{ product: productId, quantity: 1 }],
        });
        return { message: "Product added to cart", quantity: 1 };
      }
      if (isProductInCart) {
        const productCurrentQuantity =
          isProductInCart.products.filter((product) => {
            return product.product.toHexString() === productId;
          })[0]?.quantity || 0;
        await Cart.updateOne(
          { email: email, products: { $elemMatch: { product: productId } } },
          { $inc: { "products.$.quantity": 1 } }
        );
        return {
          message: "Product added to cart",
          quantity: productCurrentQuantity + 1,
        };
      } else {
        await Cart.updateOne(
          { email: email },
          { $push: { products: { product: productId, quantity: 1 } } }
        );
        return { message: "Product added to cart", quantity: 1 };
      }
    } else {
      if (!isProductInCart) {
        return { message: "Product not in cart", quantity: 0 };
      }
      const productToBeRemoved = isProductInCart.products.filter(
        (product) => product.product.toHexString() === productId
      )[0];
      if (productToBeRemoved.quantity > 1) {
        await Cart.updateOne(
          { email: email, products: { $elemMatch: { product: productId } } },
          { $inc: { "products.$.quantity": -1 } }
        );
        return {
          message: "Product removed from cart",
          quantity: productToBeRemoved.quantity - 1,
        };
      } else if (productToBeRemoved.quantity === 1) {
        await Cart.updateOne(
          { email: email, products: { $elemMatch: { product: productId } } },
          { $pull: { products: { product: productId } } }
        );
        return { message: "Product removed from cart", quantity: 0 };
      } else {
        return { message: "Product not in cart", quantity: 0 };
      }
    }
  } catch (error) {
    return { error: error.toString() };
  }
};

const removeItemFromCartLogic = async (query, user) => {
  const { productId } = query;
  const { email } = user;

  try {
    const isProductInCart = await Cart.findOne({
      email: email,
      products: { $elemMatch: { product: productId } },
    });
    if (isProductInCart && isProductInCart.products[0].quantity >= 1) {
      await Cart.updateOne(
        { email: email, products: { $elemMatch: { product: productId } } },
        { $pull: { products: { product: productId } } }
      );
      return { message: "Product removed from cart" };
    } else {
      return { message: "Product not in cart" };
    }
  } catch (error) {
    return { error: error.toString() };
  }
};

const isOrderIdDuplicate = async (orderId) => {
  const order = await Order.findOne({ orderId });
  if (order) {
    return true;
  }
  return false;
};

const createOrderId = async () => {
  let orderId = uuidv4();
  if (await isOrderIdDuplicate(orderId)) {
    return createOrderId();
  }
  return orderId;
};

const checkoutLogic = async (user, body) => {
  const { email } = user;
  const { totalPrice } = body;

  try {
    const cart = await Cart.findOne({ email: email });
    if (!cart) {
      return { error: "Cart is empty" };
    } else if (cart.products.length === 0) {
      return { error: "Cart is empty" };
    }

    const isStockAvailable = await Promise.all(
      cart.products.map(async (product) => {
        const productDetails = await Product.findOne({
          _id: product.product,
        });
        if (!productDetails) {
          return false;
        }
        if (productDetails.stock < product.quantity) {
          return false;
        }
        return true;
      })
    );
    if (isStockAvailable.includes(false)) {
      return { error: "Stock not available" };
    }
    let cartItems = cart.products;
    if (cartItems && cartItems.length === 0) {
      return { error: "Cart is empty" };
    }
    cartItems = cartItems.filter((item) => item.quantity > 0);
    const lineItems = await Promise.all(
      cartItems.map(async (product) => {
        const productDetails = await Product.findById(product.product);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: productDetails.title,
              images: [productDetails.imgUrl],
            },
            unit_amount_decimal: (
              Number(productDetails.price) * 100 +
              Number(productDetails.price) * 0.18 * 100
            ).toFixed(0),
          },
          quantity: product.quantity,
        };
      })
    );
    let orderId = await createOrderId();
    const order = await Order.create({
      orderId,
      email: email,
      total: totalPrice,
      status: "pending",
    });
    for (let i = 0; i < cart.products.length; i++) {
      const product = cart.products[i];
      const productDetails = await Product.findById(product.product);
      await OrderedProducts.create({
        orderId,
        product: product.product,
        quantity: product.quantity,
        sellerId: productDetails.sellerId,
        productTitle: productDetails.title,
        price: productDetails.price,
      });
    }
    if (!order) {
      return { error: "An error occurred while creating order" };
    }
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: lineItems,
      mode: "payment",
      success_url:
        process.env.STRIPE_SUCCESS_URL +
        `?orderId=${decodeURIComponent(orderId)}`,
      cancel_url:
        process.env.STRIPE_CANCEL_URL +
        `?orderId=${decodeURIComponent(orderId)}`,
    });
    return { sessionId: session.id };
  } catch (error) {
    console.log(error);
    return { error: error.toString() };
  }
};

const fetchProductReviewsLogic = async (query, params) => {
  const { page } = query;
  const { id } = params;
  try {
    const reviews = await Review.find({ productId: id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * 5)
      .limit(5);
    const totalReviewsForThisProduct = await Review.countDocuments({
      productId: id,
    });
    const averageRatingForThisProduct = await Review.aggregate([
      { $match: { productId: id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    return { reviews, totalReviewsForThisProduct, averageRatingForThisProduct };
  } catch (error) {
    return { error: error.toString() };
  }
};

const isReviewIdDuplicate = async (reviewId) => {
  const review = await Review.findOne({ reviewId });
  if (review) {
    return true;
  }
  return false;
};

const createReviewId = async () => {
  let reviewId = uuidv4();
  if (await isReviewIdDuplicate(reviewId)) {
    return createReviewId();
  }
  return reviewId;
};

const addProductReviewLogic = async (user, body) => {
  const { email } = user;
  const { productId, rating, review } = body;
  try {
    const reviewId = await createReviewId();
    const userDetails = await User.findOne({ email, is_deleted: false }).lean();
    if (!userDetails) {
      return { error: "User not found" };
    }
    const reviewEntry = await Review.create({
      name: userDetails.name,
      email,
      reviewId,
      productId,
      rating,
      review,
    });
    if (!reviewEntry) {
      return { error: "An error occurred while adding review" };
    }
    return { message: "Review added successfully" };
  } catch (error) {
    return { error: error.toString() };
  }
};

const fetchCategoriesLogic = async () => {
  try {
    const categories = await Category.find().sort({ category_name: 1 });
    return { categories };
  } catch (error) {
    return { error: error.toString() };
  }
};

const addProductLogic = async (body, user) => {
  try {
    const {
      productTitle,
      productPrice,
      productListPrice,
      category,
      stock,
      imgUrl,
    } = body;
    const { email } = user;
    let sellerDetails = await User.findOne({
      email: email,
      user_type: "seller",
      is_deleted: false,
    });
    if (!sellerDetails) {
      return { error: "Seller not found" };
    }
    const productDetails = await Product.create({
      title: productTitle,
      price: productPrice,
      listPrice: productListPrice,
      category_id: category,
      stock: stock,
      imgUrl: imgUrl,
      stars: 0,
      boughtInLastMonth: 0,
      isBestSeller: false,
      productUrl: "",
      reviews: 0,
      stock: stock,
      sellerId: sellerDetails._id,
    });
    if (!productDetails) {
      return { error: "An error occurred while adding product" };
    }
    return { message: "Product added successfully" };
  } catch (error) {
    return { error: error.toString() };
  }
};

module.exports = {
  fetchProductsLogic,
  addProductToWishlistLogic,
  fetchProductDetailsLogic,
  addRemoveProductToCartLogic,
  removeItemFromCartLogic,
  checkoutLogic,
  fetchProductReviewsLogic,
  addProductReviewLogic,
  fetchCategoriesLogic,
  addProductLogic,
};
