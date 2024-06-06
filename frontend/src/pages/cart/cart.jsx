import React, { useEffect, useState } from "react";
import Header from "../../layouts/header";
import { ErrorAlert } from "../../global/alerts";
import Footer from "../../layouts/footer";
import { CartItemCard } from "./cartItemCard";

export function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

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
        console.log(error);
      }
    };
    fetchCartItems();
  }, []);

  useEffect(() => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalAmount(total);
  }, [cartItems]);

  return (
    <>
      <div className="flex flex-col min-h-[100dvh]">
        <Header
          redirectTo={"signin?redirectTo=" + encodeURIComponent("/cart")}
          quantity={cartItems?.length}
        />
        <main className="flex justify-center py-8 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold">Your Cart</h1>
                  <p className="text-gray-500">
                    Review the items in your cart and proceed to checkout.
                  </p>
                </div>
                {cartItems.map(
                  (item, id) =>
                    item.quantity > 0 && (
                      <CartItemCard
                        key={id}
                        productId={item._id}
                        productName={item.title}
                        productImage={item.imgUrl}
                        productPrice={item.price}
                        productQuantity={item.quantity}
                        setLoading={setLoading}
                        setCartItems={setCartItems}
                      />
                    )
                )}
              </div>
              <div className="space-y-6 bg-gray-100 p-6 rounded-lg">
                <div>
                  <h2 className="text-lg font-bold">Order Summary</h2>
                  <p className="text-gray-500">Review your order details.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p>Subtotal</p>
                    <p>${totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Taxes</p>
                    <p>
                      ${totalAmount && ((totalAmount * 18) / 100).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <p>Total</p>
                    <p>
                      $
                      {totalAmount &&
                        (totalAmount + (totalAmount * 18) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="w-full border border-gray-300 rounded-lg py-2"
                    onClick={() => (location.href = "/")}
                  >
                    Continue Shopping
                  </button>
                  <button
                    className="w-full border bg-black text-white rounded-lg py-2"
                    onClick={() => console.log("hi")}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
