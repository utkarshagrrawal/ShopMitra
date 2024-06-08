import React, { useEffect, useState } from "react";
import Header from "../../layouts/header";
import { useParams } from "react-router-dom";
import { ErrorAlert } from "../../global/alerts";
import Loader from "../../components/loader";
import { StarIcon } from "../../components/starIcon";
import { Comments } from "./comments";

export function ProductDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [removingFromCart, setRemovingFromCart] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + `products/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        if (data.error) {
          ErrorAlert(data.error);
          return;
        }
        setLoading(false);
        setProductDetails(data.product);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductDetails();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "user/cart",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        if (data.error) {
          ErrorAlert(data.error);
          return;
        }
        if (data.cart.some((item) => item._id === id)) {
          setAddedToCart(true);
          setQuantity(data.cart.find((item) => item._id === id).quantity);
        }
      } catch (error) {
        ErrorAlert("An error occurred while fetching cart items");
        console.log(error);
      }
    };
    fetchCartItems();
  }, []);

  const handleRemoveItem = async () => {
    try {
      setRemovingFromCart(true);
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL +
          `products/add-remove-product-in-cart?productId=${id}&operationType=remove`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setRemovingFromCart(false);
      if (data.error) {
        ErrorAlert(data.error);
        return;
      }
      setQuantity(data.quantity || 1);
    } catch (error) {
      ErrorAlert("Something went wrong. Please try again later.");
      return;
    }
    if (quantity === 1) {
      setAddedToCart(false);
    }
  };

  const handleAddItem = async () => {
    if (quantity === 10) {
      ErrorAlert("You can add maximum 10 items at a time.");
      return;
    }
    setAddingToCart(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL +
          `products/add-remove-product-in-cart?productId=${id}&operationType=add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setAddingToCart(false);
      if (data.error) {
        ErrorAlert(data.error);
        return;
      }
      setQuantity(data.quantity);
    } catch (error) {
      ErrorAlert("Something went wrong. Please try again later.");
      return;
    }
    if (quantity === 1 && !addedToCart) {
      setAddedToCart(true);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <main className="flex flex-col w-full">
        <section className="grid w-full md:grid-cols-2 gap-8 p-8">
          <div className="flex justify-center items-center">
            <img
              src={productDetails?.imgUrl}
              alt="Product"
              className="w-full h-96 object-contain"
            />
          </div>
          <div className="flex flex-col justify-start gap-4">
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {productDetails?.title}
            </h1>
            <p className="text-lg text-gray-700">
              {productDetails?.description}
            </p>
            <div className="flex gap-2 items-center">
              <span className="text-2xl font-bold text-gray-800">
                ${productDetails?.price}
              </span>
              <span className="text-lg text-gray-600">/ per item</span>
            </div>
            {productDetails?.listPrice > productDetails?.price && (
              <div className="flex gap-2 items-center">
                MRP:
                <span className="text-lg text-gray-600 line-through">
                  ${productDetails?.listPrice}
                </span>
                <span className="text-lg text-green-600">
                  {Math.floor(
                    ((productDetails?.listPrice - productDetails?.price) /
                      productDetails?.listPrice) *
                      100
                  )}
                  % off
                </span>
              </div>
            )}
            {addedToCart ? (
              <div className="flex items-center border rounded-full overflow-hidden shadow-lg">
                <div
                  className={`px-4 py-3 w-full text-white text-center bg-blue-600 hover:bg-blue-700 hover:cursor-pointer transition duration-300 ${
                    addingToCart && "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleRemoveItem}
                  disabled={addingToCart || removingFromCart}
                >
                  -
                </div>
                <span className="px-4 w-full py-3 text-center text-gray-800 font-medium">
                  {quantity}
                </span>
                <div
                  className={`px-4 py-3 w-full text-white text-center bg-blue-600 hover:bg-blue-700 hover:cursor-pointer transition duration-300 ${
                    addingToCart && "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleAddItem}
                  disabled={addingToCart || removingFromCart}
                >
                  +
                </div>
              </div>
            ) : (
              <button
                className={`bg-blue-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-blue-700 transition duration-300 ${
                  addingToCart && "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleAddItem}
                disabled={addingToCart}
              >
                Add to Cart
              </button>
            )}
          </div>
        </section>
        <section className="p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Rating and Reviews
              </h1>
              <div className="flex items-center gap-2 text-xl font-medium text-gray-800">
                <StarIcon fill="#ffa41c" />
                {productDetails?.stars && productDetails.stars === 0
                  ? "0 ratings"
                  : `${productDetails.stars} out of 5`}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 w-full">
              <Comments
                customerName={"Jane Doe"}
                customerReview={"I absolutely love this product!"}
                rating={"4"}
              />
              <Comments
                customerName={"John Smith"}
                customerReview={"Great quality and excellent service!"}
                rating={"5"}
              />
              {/* Add more ReviewCard components as needed */}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
