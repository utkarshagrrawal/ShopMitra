const {
  fetchProductsLogic,
  addProductToWishlistLogic,
} = require("../businessLogic/productLogic");

const fetchProductsController = async (req, res) => {
  const response = await fetchProductsLogic(req.query);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ products: response.products });
};

const addProductToWishlistController = async (req, res) => {
  const response = await addProductToWishlistLogic(req.query, req.user.payload);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

module.exports = {
  fetchProductsController,
  addProductToWishlistController,
};
