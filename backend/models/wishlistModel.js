const { default: mongoose } = require("mongoose");

const wishlist = new mongoose.Schema({
  email: {
    type: "String",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", wishlist);

module.exports = {
  Wishlist,
};
