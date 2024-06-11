const { Product } = require("../models/productModel");
const { Wishlist } = require("../models/wishlistModel");
const { Cart } = require("../models/cartModel");
const { Order } = require("../models/orderModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

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

const fetchProductDetailsLogic = async (params) => {
  const { id } = params;
  try {
    const product = await Product.findOne({ _id: id });
    return { product };
  } catch (error) {
    return { error: error };
  }
};

const addRemoveProductToCartLogic = async (query, user) => {
  const { productId, operationType } = query;
  const { email } = user;

  try {
    if (operationType === "add") {
      const isCartExists = await Cart.findOne({ email: email });
      if (!isCartExists) {
        await Cart.create({
          email: email,
          products: [{ product: productId, quantity: 1 }],
        });
        return { message: "Product added to cart", quantity: 1 };
      }
      const isProductInCart = await Cart.findOne({
        email: email,
        products: { $elemMatch: { product: productId } },
      });
      if (isProductInCart) {
        await Cart.updateOne(
          { email: email, products: { $elemMatch: { product: productId } } },
          { $inc: { "products.$.quantity": 1 } }
        );
        return {
          message: "Product added to cart",
          quantity: isProductInCart.products[0].quantity + 1,
        };
      } else {
        await Cart.updateOne(
          { email: email },
          { $push: { products: { product: productId, quantity: 1 } } }
        );
        return { message: "Product added to cart", quantity: 1 };
      }
    } else {
      const isProductInCart = await Cart.findOne({
        email: email,
        products: { $elemMatch: { product: productId } },
      });
      if (isProductInCart && isProductInCart.products[0].quantity >= 1) {
        await Cart.updateOne(
          { email: email, products: { $elemMatch: { product: productId } } },
          { $inc: { "products.$.quantity": -1 } }
        );
        return {
          message: "Product removed from cart",
          quantity: isProductInCart.products[0].quantity - 1,
        };
      } else {
        return { message: "Product not in cart", quantity: 0 };
      }
    }
  } catch (error) {
    return { error: error };
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
    return { error: error };
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
    const lineItems = await Promise.all(
      cart.products.map(async (product) => {
        const productDetails = await Product.findById(product.product);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: productDetails.title,
              images: [productDetails.imgUrl],
            },
            unit_amount_decimal: (Number(totalPrice) * 100).toFixed(2),
          },
          quantity: product.quantity,
        };
      })
    );
    let orderId = await createOrderId();
    const order = await Order.create({
      orderId,
      email: email,
      products: cart.products,
      total: totalPrice,
      status: "pending",
    });
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
    return { error: error };
  }
};

module.exports = {
  fetchProductsLogic,
  addProductToWishlistLogic,
  fetchProductDetailsLogic,
  addRemoveProductToCartLogic,
  removeItemFromCartLogic,
  checkoutLogic,
};
