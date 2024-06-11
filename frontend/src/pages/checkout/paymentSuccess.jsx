import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function PaymentSuccess() {
  const [searchQuery, setSearchQuery] = useSearchParams();

  useEffect(() => {
    const orderId = searchQuery.get("orderId");
    if (searchQuery.get("orderId") === null) {
      window.location.href = "/";
    }
    const confirmOrder = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL +
            `orders/validate-order?orderId=${orderId}`,
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
          window.location.href = "/";
        }
        window.location.href = "/dashboard/orders";
      } catch (error) {
        console.log(error);
        window.location.href = "/";
      }
    };
    confirmOrder();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="rounded-lg p-8 max-w-lg text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 mx-auto mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2l4 -4"
          />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your transaction has been completed
          successfully.
        </p>
        <span className="flex justify-center">
          Transaction is being processed. Please wait...
        </span>
      </div>
    </div>
  );
}
