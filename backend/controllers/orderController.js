const {
  cancelOrderDueToPaymentFailureLogic,
  processOrderLogic,
} = require("../businessLogic/orderLogic");

const cancelOrderDueToPaymentFailureController = async (req, res) => {
  const response = await cancelOrderDueToPaymentFailureLogic(req.query);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

const processOrderController = async (req, res) => {
  const response = await processOrderLogic(req.query);
  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
  return res.status(200).json({ message: response.message });
};

module.exports = {
  cancelOrderDueToPaymentFailureController,
  processOrderController,
};
