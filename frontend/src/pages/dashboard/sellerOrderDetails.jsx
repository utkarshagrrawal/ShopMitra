import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../layouts/header";
import { ErrorAlert } from "../../global/alerts";
import Loader from "../../components/loader";

export function SellerOrderDetails() {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + `seller/order/${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        if (data.error) {
          ErrorAlert(data.error);
        } else {
          setLoading(false);
          setOrderDetails(data.productsInOrder);
        }
      } catch (error) {
        ErrorAlert("An error occurred. Please try again later.");
      }
      return;
    };
    fetchOrderDetails();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-6 py-8">
        {orderDetails?.length > 0 &&
          orderDetails?.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
                <div className="flex justify-center items-center">
                  <img
                    src={order.imgUrl}
                    alt={order.title}
                    className="object-contain h-32 w-full rounded-lg"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <h2
                      className="text-md lg:text-xl font-bold mb-2 text-gray-800 hover:underline hover:cursor-pointer"
                      onClick={() => (location.href = "/product/" + order._id)}
                    >
                      {order.title}
                    </h2>
                    <div className="flex items-center mb-2 text-gray-600">
                      <span className="text-lg mr-1">$</span>
                      <span className="text-2xl font-semibold text-gray-900">
                        {order.price}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Quantity: {order.quantity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        <div className="flex justify-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => (location.href = "/seller/dashboard/orders")}
          >
            Go back
          </button>
        </div>
      </div>
    </>
  );
}
