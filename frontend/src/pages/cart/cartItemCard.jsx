import React, { useState } from "react";
import { ErrorAlert } from "../../global/alerts";

export function CartItemCard(props) {
  const [updatingQuantity, setUpdatingQuantity] = useState(false);

  const handleDecreaseItemQuantity = async () => {
    try {
      setUpdatingQuantity(true);
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL +
          `products/add-remove-product-in-cart?productId=${props?.productId}&operationType=remove`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setUpdatingQuantity(false);
      if (data.error) {
        ErrorAlert(data.error);
        return;
      }
      props?.setCartItems((prev) =>
        prev.map((item) => {
          if (item._id === props?.productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
      );
      props?.setLoading(true);
    } catch (error) {
      ErrorAlert("Something went wrong. Please try again later.");
      return;
    }
  };

  const handleIncreaseItemQuantity = async () => {
    try {
      setUpdatingQuantity(true);
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL +
          `products/add-remove-product-in-cart?productId=${props?.productId}&operationType=add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setUpdatingQuantity(false);
      if (data.error) {
        ErrorAlert(data.error);
        return;
      }
      props?.setCartItems((prev) =>
        prev.map((item) => {
          if (item._id === props?.productId) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        })
      );
      props?.setLoading(true);
    } catch (error) {
      ErrorAlert("Something went wrong. Please try again later.");
      return;
    }
  };

  const handleRemoveItem = async () => {
    try {
      setUpdatingQuantity(true);
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL +
          `products/remove-item-from-cart?productId=${props?.productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setUpdatingQuantity(false);
      if (data.error) {
        ErrorAlert(data.error);
        return;
      }
      props?.setCartItems((prev) =>
        prev.filter((item) => item._id !== props?.productId)
      );
      props?.setLoading(true);
    } catch (error) {
      ErrorAlert("Something went wrong. Please try again later.");
      return;
    }
  };

  return (
    <div
      className={`space-y-6 ${
        updatingQuantity && "opacity-50 pointer-events-none"
      }`}
    >
      <div className="grid gap-4 border rounded-lg p-4">
        <div className="grid grid-cols-[80px_1fr_80px] items-center gap-4">
          <img
            src={props?.productImage}
            width="80"
            height="80"
            alt="Product image"
            className="rounded-md object-contain w-full h-16"
          />
          <div className="space-y-1">
            <h3 className="font-medium">{props?.productName}</h3>
          </div>
          <div className="flex items-center justify-between border rounded-lg">
            <button
              className="p-2 bg-gray-200 hover:bg-gray-300 transition-colors ease-in-out duration-300 rounded-l-lg"
              onClick={handleDecreaseItemQuantity}
            >
              -<span className="sr-only">Decrease quantity</span>
            </button>
            <span>{props?.productQuantity}</span>
            <button
              className="p-2 bg-gray-200 hover:bg-gray-300 transition-colors ease-in-out duration-300 rounded-r-lg"
              onClick={handleIncreaseItemQuantity}
            >
              +<span className="sr-only">Increase quantity</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-500">${props?.productPrice || 0}</p>
          <p className="font-medium">
            $
            {props?.productPrice
              ? props?.productPrice * props?.productQuantity
              : 0}
          </p>
        </div>
        <button
          className="w-full bg-gray-200 hover:bg-gray-300 transition-colors ease-in-out duration-300 rounded-md py-2 text-base"
          onClick={handleRemoveItem}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
