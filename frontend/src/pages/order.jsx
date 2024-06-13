import React, { useEffect, useState } from "react";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import { useParams } from "react-router-dom";
import { CircleCheckIcon } from "../components/circleCheckIcon";
import { ErrorAlert } from "../global/alerts";

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

export function Order() {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState({});
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + `orders/${orderId}`,
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
          setOrderDetails(data.order);
          setProductDetails(data.productDetails);
        }
      } catch (error) {
        ErrorAlert("An error occurred. Please try again later.");
      }
      return;
    };
    fetchOrderDetails();
  }, [orderId]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="grid gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Order #{orderId}</h2>
                <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                  {orderDetails.status?.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Order Timeline</h2>
              <div className="grid gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`${
                      (orderDetails?.status === "pending" && "bg-green-500") ||
                      "bg-gray-300"
                    } text-white w-8 h-8 rounded-full flex items-center justify-center`}
                  >
                    <CircleCheckIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Order Placed</h3>
                    <p className="text-gray-500 text-sm">June 10, 2023</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`${
                      (orderDetails?.status === "processed" &&
                        "bg-green-500") ||
                      "bg-gray-300"
                    } text-white w-8 h-8 rounded-full flex items-center justify-center`}
                  >
                    <CircleCheckIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Shipped</h3>
                    <p className="text-gray-500 text-sm">June 11, 2023</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`${
                      (orderDetails?.status === "otd" && "bg-green-500") ||
                      "bg-gray-300"
                    } text-white w-8 h-8 rounded-full flex items-center justify-center`}
                  >
                    <CircleCheckIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Out for Delivery</h3>
                    <p className="text-gray-500 text-sm">June 14, 2023</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`${
                      (orderDetails?.status === "delivered" &&
                        "bg-green-500") ||
                      "bg-gray-300"
                    } text-white w-8 h-8 rounded-full flex items-center justify-center`}
                  >
                    <CircleCheckIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Delivered</h3>
                    <p className="text-gray-500 text-sm">June 15, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Order Details</h2>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-500">Order #</div>
                <div>{orderDetails?.orderId}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-gray-500">Status</div>
                <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                  {orderDetails.status?.toUpperCase()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-gray-500">Estimated Delivery</div>
                <div>
                  {orderDetails.createdAt &&
                    dateTimeFormatter.format(
                      new Date().setDate(
                        new Date(orderDetails?.createdAt).getDate() + 5
                      )
                    )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-gray-500">Shipping Method</div>
                <div>Standard Shipping</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-gray-500">Payment Method</div>
                <div>Visa - 1234</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-gray-500">Total</div>
                <div>${orderDetails?.total}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow mt-8">
          {productDetails.map((product, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-4 ${
                productDetails.length > 1 &&
                index < productDetails.length - 1 &&
                "border-b border-gray-200"
              }`}
            >
              <div className="flex gap-4 items-center">
                <img
                  src={product.productDetails?.imgUrl}
                  alt={product.productDetails?.title}
                  className="w-16 h-16 object-contain rounded-md"
                />
                <div className="flex flex-col">
                  <h3 className="text-base font-medium text-gray-800">
                    {product.productDetails?.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Qty: {product.quantity}
                  </p>
                </div>
              </div>
              <div className="text-gray-700 text-sm font-medium">
                Total: $
                {(product.quantity * product.productDetails?.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
