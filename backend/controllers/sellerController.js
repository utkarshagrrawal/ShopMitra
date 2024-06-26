const {
  fetchSellerDataLogic,
  updateProductDetailsLogic,
  addStockLogic,
  fetchSellerOrdersLogic,
  fetchProductsInOrderLogic,
} = require("../businessLogic/sellerLogic");

const fetchSellerDataController = async (req, res) => {
  const response = await fetchSellerDataLogic(req.user.payload, req.query);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({
    sellerDetails: response.sellerDetails,
    sellerProducts: response.sellerProducts,
    totalSellerProducts: response.totalSellerProducts,
  });
};

const fetchSellerOrdersController = async (req, res) => {
  const response = await fetchSellerOrdersLogic(req.user.payload);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({
    sellerDetails: response.sellerDetails,
    sellerProducts: response.sellerProducts,
    totalSellerOrders: response.totalSellerOrders,
  });
};

const updateProductDetailsController = async (req, res) => {
  const response = await updateProductDetailsLogic(
    req.body,
    req.user.payload,
    req.params
  );
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

const addStockController = async (req, res) => {
  const response = await addStockLogic(req.body, req.user.payload, req.params);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

const fetchProductsInOrderController = async (req, res) => {
  const response = await fetchProductsInOrderLogic(
    req.user.payload,
    req.params
  );
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({
    productsInOrder: response.productsInOrder,
  });
};

module.exports = {
  fetchSellerDataController,
  fetchSellerOrdersController,
  updateProductDetailsController,
  addStockController,
  fetchProductsInOrderController,
};
