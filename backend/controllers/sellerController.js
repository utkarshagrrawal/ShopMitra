const {
  fetchSellerDataLogic,
  updateProductDetailsLogic,
  addStockLogic,
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

module.exports = {
  fetchSellerDataController,
  updateProductDetailsController,
  addStockController,
};
