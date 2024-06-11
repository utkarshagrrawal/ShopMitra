import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ErrorAlert } from "../../global/alerts";

export function PaymentFailed() {
  const [searchQuery, setSearchQuery] = useSearchParams();

  useEffect(() => {
    const orderId = searchQuery.get("orderId");
    if (searchQuery.get("orderId") === null) {
      window.location.href = "/";
    }
    let retryCount = 0,
      retryLimit = 3;
    const cancelOrder = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL +
            `orders/cancel-order?orderId=${orderId}`,
          {
            method: "DELETE",
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
      } catch (error) {
        console.log(error);
        if (retryCount < retryLimit) {
          retryCount++;
          cancelOrder();
        } else {
          ErrorAlert("An error occurred while cancelling the order");
        }
      }
    };
    cancelOrder();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="rounded-lg p-8 max-w-lg text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-20 w-20 mx-auto mb-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Failed!
        </h1>
        <p className="text-gray-600 mb-8">
          Your transaction has been declined. Please try again.
        </p>
        <span className="flex justify-center">
          Transaction is being cancelled. Please wait...
        </span>
      </div>
    </div>
  );
}
