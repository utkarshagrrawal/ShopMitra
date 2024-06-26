import React, { useEffect, useState } from "react";
import Header from "../../layouts/header";
import Footer from "../../layouts/footer";
import Loader from "../../components/loader";
import ButtonLoader from "../../components/buttonLoader";
import { ErrorAlert } from "../../global/alerts";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

export function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

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
        }
        setCartItems(data.cart);
      } catch (error) {
        ErrorAlert("An error occurred while fetching cart items");
        console.log(error);
      }
      setLoading(false);
    };
    fetchCartItems();
  }, []);

  useEffect(() => {
    const isUserSeller = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "auth/is-logged-in",
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
        } else {
          setUserType(data.user.user_type);
        }
      } catch (error) {
        ErrorAlert("An error occurred while checking user type");
        console.log(error);
      }
    };
    isUserSeller();
  }, []);

  useEffect(() => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setSubtotal(total);
  }, [cartItems]);

  const handlePayment = async () => {
    try {
      setProcessingPayment(true);
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "products/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            totalPrice: (subtotal + subtotal * 0.18).toFixed(2),
          }),
        }
      );
      const data = await response.json();
      if (data.error) {
        setProcessingPayment(false);
        ErrorAlert(data.error);
        return;
      }
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (result.error) {
        ErrorAlert("An error occurred while processing payment");
      }
      setProcessingPayment(false);
    } catch (error) {
      setProcessingPayment(false);
      ErrorAlert("An error occurred while processing payment");
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Header redirectTo="/checkout" />
      <div className="grid lg:grid-cols-2 gap-8 mx-auto py-12 px-4 md:px-6 min-h-[70vh]">
        <div className="flex flex-col gap-4 space-y-6 border rounded-lg p-4 md:p-6 h-fit">
          {cartItems?.length > 0 &&
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white rounded-lg"
              >
                <img
                  src={item.imgUrl}
                  alt={item.title}
                  className="h-24 w-24 object-contain rounded-lg"
                />
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-gray-800">
                    {item.title}
                  </h2>
                  <p className="text-gray-500">
                    Unit Price: ${item.price.toFixed(2)}
                  </p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-gray-700 font-semibold">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
        </div>
        <div className="flex flex-col">
          <div className="bg-white rounded-lg p-4 md:p-6 border">
            <h2 className="text-xl font-semibold text-gray-800">
              Order Summary
            </h2>
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800">
                ${subtotal && subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-800">$0.00</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-800">
                ${subtotal && (subtotal * 0.18).toFixed(2)}
              </span>
            </div>
            <hr className="my-4 border-gray-200" />
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-600 font-semibold">Total</span>
              <span className="text-gray-800 font-semibold">
                ${subtotal && (subtotal + subtotal * 0.18).toFixed(2)}
              </span>
            </div>
          </div>
          {userType === "customer" ? (
            <div className="flex flex-col">
              <button
                className={`border border-gray-300 rounded-lg py-2 mt-4 ${
                  processingPayment && "cursor-not-allowed opacity-50"
                }`}
                onClick={() => navigate("/")}
                disabled={processingPayment}
              >
                Cancel order
              </button>
              <button
                className={`border bg-black text-white rounded-lg py-2 mt-4 flex justify-center ${
                  processingPayment && "cursor-not-allowed opacity-50"
                }`}
                onClick={handlePayment}
                disabled={processingPayment}
              >
                {processingPayment ? <ButtonLoader /> : "Proceed to pay"}
              </button>
            </div>
          ) : (
            <div className="flex justify-center mt-4 border rounded-md p-4">
              <span className="text-red-500 font-semibold">
                <strong>NOTE: </strong>Sellers cannot purchase products
              </span>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
