import React, { useEffect, useState } from "react";
import Header from "../../layouts/header";
import { useParams } from "react-router-dom";
import { ErrorAlert, SuccessAlert } from "../../global/alerts";
import Loader from "../../components/loader";
import { StarIcon } from "../../components/starIcon";
import { Comments } from "./comments";
import InfoIcon from "../../components/infoIcon";

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
  const [page, setPage] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewSectionVisible, setReviewSectionVisible] = useState(false);

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
          Authorization: localStorage.getItem("token"),
        },
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
    const checkIsProductInWishlist = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + `products/is-in-wishlist/${id}`,
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
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        if (data.error) {
          ErrorAlert(data.error);
          return;
        }
        setReviews(data.reviews);
        setAverageRating(
          data.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
            data.reviews.length
        );
      } catch (error) {
        ErrorAlert("An error occurred while fetching reviews");
        console.log(error);
      }
    };
    fetchProductReviews();
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
            Authorization: localStorage.getItem("token"),
          },
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
            <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
              {productDetails?.title}
            </h1>
            <p className="text-lg text-gray-700">
              {productDetails?.description}
            </p>
            <div className="flex gap-2 items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl font-semibold text-gray-800">
                  ${productDetails?.price}
                </span>
                <span className="text-lg text-gray-600">/per item</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-md ${
                    liked
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={handleLikeProduct}
                >
                  {liked && <InfoIcon className="w-5 h-5" />}
                  {liked ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
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
              <div className="flex items-center border rounded-md overflow-hidden shadow-lg">
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
                className={`bg-blue-600 text-white px-8 py-3 rounded-md font-medium shadow-lg hover:bg-blue-700 transition duration-300 ${
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
            <div className="flex flex-col items-start gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Rating and Reviews ({reviews?.length || 0} reviews)
              </h1>
              <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                <StarIcon className="text-yellow-500" />
                {averageRating
                  ? `${averageRating.toFixed(2)} out of 5.00`
                  : "No ratings yet"}
              </div>
            </div>
            <div className="w-full mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
              <div
                className={`w-full px-4 py-2 text-sm font-medium flex justify-center items-center rounded-t-lg cursor-pointer transition-colors duration-300 ${
                  reviewSectionVisible
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setReviewSectionVisible(!reviewSectionVisible)}
              >
                {reviewSectionVisible ? "Close" : "Write a Review"}
              </div>
              <form
                onSubmit={handleSubmit}
                className={`transition-all duration-100 ${
                  reviewSectionVisible ? "p-6 block" : "hidden"
                }`}
              >
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="rating">
                    Rating:
                  </label>
                  <div className="flex items-center gap-2">
                    <StarRating rating={rating} onRatingChange={setRating} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="review">
                    Your Review:
                  </label>
                  <textarea
                    id="review"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-600 transition-colors duration-300 resize-none"
                    rows="4"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900 transition-colors duration-300"
                >
                  Submit Review
                </button>
              </form>
            </div>
            <div className="grid md:grid-cols-2 gap-6 w-full">
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
