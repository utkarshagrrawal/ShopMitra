import React, { useCallback, useEffect, useState } from "react";
import Header from "../../layouts/header";
import { useParams } from "react-router-dom";
import { ErrorAlert, SuccessAlert } from "../../global/alerts";
import Loader from "../../components/loader";
import { StarIcon } from "../../components/starIcon";
import { Comments } from "./comments";
import { CartIcon } from "../../components/cartIcon";
import HeartIcon from "../../components/heartIcon";
import ShareIcon from "../../components/shareIcon";

const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={(hoverRating || rating) >= star ? "#ffa41c" : "#e9ecef"}
          stroke="currentColor"
          className="w-6 h-6 border-black cursor-pointer"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onRatingChange(star)}
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};

const applyDebounce = (fn, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export function ProductDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [removingFromCart, setRemovingFromCart] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewSectionVisible, setReviewSectionVisible] = useState(false);
  const scrollListener = useCallback(() => {
    if (
      window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 100 &&
      totalReviews > reviews?.length
    ) {
      setPage((prev) => prev + 1);
    }
  }, [totalReviews, reviews]);

  useEffect(() => {
    const debouncedScrollListener = applyDebounce(scrollListener, 500);
    window.addEventListener("scroll", debouncedScrollListener);
    return () => window.removeEventListener("scroll", debouncedScrollListener);
  }, [scrollListener]);

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
            },
            credentials: "include",
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
    const checkIsProductInWishlist = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + `products/is-in-wishlist/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.error) {
          if (data.error !== "Please login to proceed") ErrorAlert(data.error);
          return;
        }
        setLiked(data.isProductInWishlist);
      } catch (error) {
        ErrorAlert("An error occurred while fetching wishlist items");
        console.log(error);
      }
    };
    checkIsProductInWishlist();
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
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.error) {
          if (data.error !== "Please login to proceed") ErrorAlert(data.error);
          return;
        }
        let itemIndex = data.cart.findIndex((item) => item._id === id);
        if (data.cart[itemIndex] && data.cart[itemIndex].quantity > 0) {
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

  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL +
            `products/fetch-reviews/${id}?page=${page}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.error) {
          ErrorAlert(data.error);
          return;
        }
        if (page === 1) setReviews(data.reviews || []);
        else setReviews((prev) => [...prev, ...data.reviews]);
        setAverageRating(data.averageRatingForThisProduct);
        setTotalReviews(data.totalReviewsForThisProduct);
      } catch (error) {
        ErrorAlert("An error occurred while fetching reviews");
        console.log(error);
      }
    };
    fetchProductReviews();
  }, [page]);

  const handleLikeProduct = async () => {
    setLiked(!liked);
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL +
        "products/add-to-wishlist?productId=" +
        id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.error) {
      setLiked(!liked);
      ErrorAlert(data.error);
    } else {
      SuccessAlert(data.message);
    }
  };

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
          },
          credentials: "include",
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
          },
          credentials: "include",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      ErrorAlert("Please select a rating");
      return;
    }
    if (!review) {
      ErrorAlert("Please write a review");
      return;
    }
    if (review.trim().length === 0) {
      ErrorAlert("Review cannot be empty");
      return;
    }
    if (review.length < 10 || review.length > 500) {
      ErrorAlert("Review should be between 10 and 500 characters");
      return;
    }
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "products/add-review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            productId: id,
            rating,
            review,
          }),
        }
      );
      const data = await response.json();
      if (data.error) {
        ErrorAlert(data.error);
        return;
      }
      SuccessAlert(data.message);
      location.reload();
    } catch (error) {
      ErrorAlert("An error occurred while submitting the review");
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <div
        className={`fixed flex items-center justify-center inset-0 bg-black/50 z-50 ${
          reviewSectionVisible ? "block" : "hidden"
        }`}
      >
        <div className="bg-white w-full max-w-xl p-8 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Write a Review
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mt-4">
              <label className="text-gray-700 mb-2" htmlFor="rating">
                Rating
              </label>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={rating} onRatingChange={setRating} />
              </div>
            </div>
            <div>
              <label className="text-gray-700 mb-2" htmlFor="review">
                Your Review
              </label>
              <textarea
                id="review"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-600 transition-colors duration-300 resize-none mt-2"
                rows="4"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                className="text-gray-700 bg-gray-100 py-2 px-4 rounded-md font-medium"
                type="button"
                onClick={() => setReviewSectionVisible(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors duration-300"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
      <main className="flex flex-col w-full">
        <span className="text-gray-700 text-sm px-8 py-4">
          Home {">"} Products {"> "}{" "}
          <strong>
            {productDetails?.title.length > 20
              ? productDetails?.title.substring(0, 20)
              : productDetails?.title}
            {productDetails?.title.length > 20 && "..."}
          </strong>
        </span>
        <section className="grid w-full md:grid-cols-2 gap-8 px-8 py-4">
          <div className="flex justify-center items-center">
            <img
              src={productDetails?.imgUrl}
              alt="Product"
              className="w-full h-96 border p-4 object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-start gap-4">
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">
              {productDetails?.title}
            </h1>
            <div className="flex items-center gap-2">
              <StarIcon className="text-white size-5" fill="#facc15" />
              <span className="text-md text-gray-600">
                {averageRating ? averageRating : "0"} out of 5 (
                {totalReviews || 0} reviews)
              </span>
            </div>
            <div className="flex gap-2 items-center">
              MRP:
              <span
                className={`text-lg text-gray-400 ${
                  productDetails?.listPrice > productDetails?.price
                    ? "line-through block"
                    : "hidden"
                }`}
              >
                ${productDetails?.listPrice}
              </span>
              <span
                className={`text-lg text-gray-800 ${
                  productDetails?.listPrice > productDetails?.price &&
                  "text-gray-900"
                }`}
              >
                ${productDetails?.price}
              </span>
              {productDetails?.listPrice > productDetails?.price && (
                <span className="text-lg text-green-600">
                  {Math.floor(
                    ((productDetails?.listPrice - productDetails?.price) /
                      productDetails?.listPrice) *
                      100
                  )}
                  % off
                </span>
              )}
            </div>
            <div className="flex w-full items-center gap-2">
              {addedToCart ? (
                <div className="flex w-full items-center border rounded-md overflow-hidden shadow-lg">
                  <div
                    className={`p-2 w-full text-white text-center bg-blue-600 hover:bg-blue-700 hover:cursor-pointer transition duration-300 ${
                      addingToCart && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={handleRemoveItem}
                    disabled={addingToCart || removingFromCart}
                  >
                    -
                  </div>
                  <span className="p-2 w-full text-center text-gray-800 font-medium">
                    {quantity}
                  </span>
                  <div
                    className={`p-2 w-full text-white text-center bg-blue-600 hover:bg-blue-700 hover:cursor-pointer transition duration-300 ${
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
                  className={`flex justify-center items-center gap-2 bg-blue-600 w-full text-white p-2 rounded-md font-medium shadow-lg hover:bg-blue-700 transition duration-300 ${
                    addingToCart && "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleAddItem}
                  disabled={addingToCart}
                >
                  <CartIcon />
                  Add to Cart
                </button>
              )}
              <button
                className="p-2 border border-gray-300 rounded-md"
                onClick={handleLikeProduct}
              >
                {liked ? (
                  <HeartIcon className="size-5 text-white" fill="red" />
                ) : (
                  <HeartIcon className="size-5" />
                )}
              </button>
              <button
                className="p-2 border border-gray-300 rounded-md"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  SuccessAlert("Copied product link to clipboard");
                }}
              >
                <ShareIcon className="size-5" />
              </button>
            </div>
          </div>
        </section>
        <section className="p-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-xl font-bold text-gray-900">
              Customer Reviews
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 place-content-center gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="text-5xl font-bold text-gray-900">
                    {averageRating ? averageRating : "0"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          fill={averageRating >= star ? "#ffa41c" : "#e9ecef"}
                          className="size-5"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      Based on {totalReviews || 0} reviews
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Share your thoughts
                  </h3>
                  <p className="text-sm text-gray-500">
                    Help others make their decision
                  </p>
                </div>
                <button
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => setReviewSectionVisible((prev) => !prev)}
                >
                  Write a Review
                </button>
              </div>
            </div>
            <div className="grid gap-4 w-full">
              {reviews?.length > 0 &&
                reviews.map((review, index) => (
                  <Comments
                    key={index}
                    customerName={review.name}
                    customerReview={review.review}
                    rating={review.rating}
                  />
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
