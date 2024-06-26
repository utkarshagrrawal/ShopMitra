const {
  fetchProductsLogic,
  addProductToWishlistLogic,
  fetchProductDetailsLogic,
  addRemoveProductToCartLogic,
  removeItemFromCartLogic,
  checkoutLogic,
  fetchProductReviewsLogic,
  addProductReviewLogic,
  checkIsProductInWishlistLogic,
  fetchCategoriesLogic,
  addProductLogic,
} = require("../businessLogic/productLogic");

const fetchProductsController = async (req, res) => {
  const response = await fetchProductsLogic(req.query);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res
    .status(200)
    .json({
      products: response.products,
      totalProducts: response.totalProducts,
    });
};

const addProductToWishlistController = async (req, res) => {
  const response = await addProductToWishlistLogic(req.query, req.user.payload);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

const fetchProductDetailsController = async (req, res) => {
  const response = await fetchProductDetailsLogic(req.params);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({
    product: response.product,
  });
};

const checkIsProductInWishlistController = async (req, res) => {
  const response = await checkIsProductInWishlistLogic(
    req.params,
    req.user.payload
  );
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({
    isProductInWishlist: response.isProductInWishlist,
  });
};

const addRemoveProductToCartController = async (req, res) => {
  const response = await addRemoveProductToCartLogic(
    req.query,
    req.user.payload
  );
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res
    .status(200)
    .json({ message: response.message, quantity: response.quantity });
};

const removeItemFromCartController = async (req, res) => {
  const response = await removeItemFromCartLogic(req.query, req.user.payload);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

const checkoutController = async (req, res) => {
  const response = await checkoutLogic(req.user.payload, req.body);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res
    .status(200)
    .json({ sessionId: response.sessionId, orderId: response.orderId });
};

const fetchProductReviewsController = async (req, res) => {
  const response = await fetchProductReviewsLogic(req.query, req.params);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ reviews: response.reviews });
};

const addProductReviewController = async (req, res) => {
  const response = await addProductReviewLogic(req.user.payload, req.body);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

const fetchCategoriesController = async (req, res) => {
  const response = await fetchCategoriesLogic();
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ categories: response.categories });
};

const addProductController = async (req, res) => {
  const response = await addProductLogic(req.body, req.user.payload);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

module.exports = {
  fetchProductsController,
  addProductToWishlistController,
  fetchProductDetailsController,
  checkIsProductInWishlistController,
  addRemoveProductToCartController,
  removeItemFromCartController,
  checkoutController,
  fetchProductReviewsController,
  addProductReviewController,
  fetchCategoriesController,
  addProductController,
};
