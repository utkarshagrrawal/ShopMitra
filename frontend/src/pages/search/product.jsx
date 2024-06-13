import React from "react";
import { Rating } from "../../components/rating";
import { FavouriteIcon } from "../../components/favouriteIcon";
import { ErrorAlert, SuccessAlert } from "../../global/alerts";

export function Product(props) {
  const handleAddToCart = async (id) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL +
          "products/add-remove-product-in-cart?productId=" +
          id +
          "&operationType=add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        ErrorAlert(data.error);
      } else {
        SuccessAlert(data.message);
      }
    } catch (error) {
      ErrorAlert("An error occurred while adding the product to cart");
      console.log(error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-2 p-4">
      <div className="grid grid-cols-[200px_1fr] gap-4">
        <div className="flex justify-center items-center">
          <img
            src={props.product.imgUrl}
            alt={props.product.title}
            className="object-contain h-32 w-full rounded-lg"
          />
        </div>
        <div className="p-4 flex flex-col justify-between">
          <div>
            <h2
              className="text-xl font-bold mb-2 text-gray-800 hover:underline hover:cursor-pointer"
              onClick={() => (location.href = "/product/" + props.product?._id)}
            >
              {props.product.title}
            </h2>
            <div className="flex items-center mb-2 text-gray-600">
              <span className="text-lg mr-1">$</span>
              <span className="text-2xl font-semibold text-gray-900">
                {props.product.price}
              </span>
            </div>
            {props.product.listPrice > props.product.price && (
              <div className="flex items-center text-gray-500">
                <span className="text-sm mr-1">MRP:</span>
                <span className="text-sm line-through">
                  {props.product.listPrice}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <Rating stars={props.product.stars} />
              <span className="text-gray-600 text-sm ml-2">
                ({props.product.reviews} reviews)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              onClick={() => handleAddToCart(props.product?._id)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
