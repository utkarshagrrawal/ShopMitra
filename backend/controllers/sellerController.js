const { fetchSellerDataLogic } = require("../businessLogic/sellerLogic");

const fetchSellerDataController = async (req, res) => {
  const response = await fetchSellerDataLogic(req.user.payload);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res
    .status(200)
    .json({
      sellerDetails: response.sellerDetails,
      productDetails: response.productDetails,
      sellerProductsInfo: response.sellerProductsInfo,
    });
};

module.exports = { fetchSellerDataController };
