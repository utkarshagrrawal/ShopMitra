import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorAlert } from "../../global/alerts";
import Loader from "../../components/loader";
import Header from "../../layouts/header";

export function SellerProductDetails() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [updatedProductDetails, setUpdatedProductDetails] = useState({});
  const [updatingProductDetails, setUpdatingProductDetails] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [updatingStock, setUpdatingStock] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + `products/${id}`
        );
        const data = await response.json();
        setLoading(false);
        if (data.error) {
          if (data.error === "Please login to proceed") {
            window.location.href =
              "/login?redirectTo" +
              window.encodeURIComponent(window.location.pathname);
          }
        } else {
          setProductDetails(data.product);
          setUpdatedProductDetails({
            title: data.product.title,
            price: data.product.price,
            listPrice: data.product.listPrice,
            imgUrl: data.product.imgUrl,
          });
        }
      } catch (error) {
        ErrorAlert("Error fetching product details");
        return;
      }
    };
    fetchProductDetails();
  }, []);

  const handleUpdateProductDetails = async (e) => {
    e.preventDefault();
    try {
      const urlRegex = new RegExp(
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
      );
      if (
        !updatedProductDetails.imgUrl ||
        !urlRegex.test(updatedProductDetails.imgUrl)
      ) {
        ErrorAlert("Invalid image URL");
        return;
      }
      setUpdatingProductDetails(true);
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + `seller/product/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(updatedProductDetails),
        }
      );
      const data = await response.json();
      setUpdatingProductDetails(false);
      if (data.error) {
        ErrorAlert(data.error);
      } else {
        window.location.reload();
      }
    } catch (error) {
      setUpdatingProductDetails(false);
      ErrorAlert("Error updating product details");
      return;
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (quantity <= 0) {
      ErrorAlert("Quantity should be greater than 0");
      return;
    }
    try {
      setUpdatingStock(true);
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + `seller/product/${id}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ stock: quantity }),
        }
      );
      const data = await response.json();
      setUpdatingStock(false);
      if (data.error) {
        ErrorAlert(data.error);
      } else {
        window.location.reload();
      }
    } catch (error) {
      setUpdatingStock(false);
      ErrorAlert("Error adding stock");
      return;
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div>
      <Header />
      <div className="container mx-auto mb-4">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 p-4 bg-white border rounded-lg">
          <div className="flex justify-center items-center">
            <img
              src={productDetails?.imgUrl}
              alt="Product"
              className="w-full h-96 object-contain rounded-md"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-semibold mb-2">
              {productDetails?.title}
            </h1>
            <p className="text-gray-600 mb-4">{productDetails?.description}</p>
            <p className="text-3xl font-bold mb-2">${productDetails?.price}</p>
            {productDetails?.listPrice > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                <p className="font-semibold">MRP:</p>
                <p className="text-gray-500 line-through">
                  ${productDetails?.listPrice}
                </p>
                <p className="text-green-500 font-bold">
                  {Math.floor(
                    ((productDetails?.listPrice - productDetails?.price) /
                      productDetails?.listPrice) *
                      100
                  )}
                  % off
                </p>
              </div>
            )}
          </div>
        </section>
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Edit product Details</h2>
          <form
            onSubmit={handleUpdateProductDetails}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-1 p-2 w-full border rounded-md"
                value={updatedProductDetails?.title || ""}
                onChange={(e) => {
                  setUpdatedProductDetails({
                    ...updatedProductDetails,
                    title: e.target.value,
                  });
                }}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium">
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                className="mt-1 p-2 w-full border rounded-md"
                value={updatedProductDetails?.price || ""}
                onChange={(e) => {
                  setUpdatedProductDetails({
                    ...updatedProductDetails,
                    price: e.target.value,
                  });
                }}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="listPrice" className="block text-sm font-medium">
                MRP
              </label>
              <input
                type="number"
                name="listPrice"
                id="listPrice"
                className="mt-1 p-2 w-full border rounded-md"
                value={updatedProductDetails?.listPrice || ""}
                onChange={(e) => {
                  setUpdatedProductDetails({
                    ...updatedProductDetails,
                    listPrice: e.target.value,
                  });
                }}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="imgUrl" className="block text-sm font-medium">
                Image URL
              </label>
              <input
                type="text"
                name="imgUrl"
                id="imgUrl"
                className="mt-1 p-2 w-full border rounded-md"
                value={updatedProductDetails?.imgUrl || ""}
                onChange={(e) => {
                  setUpdatedProductDetails({
                    ...updatedProductDetails,
                    imgUrl: e.target.value,
                  });
                }}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md w-full col-span-2 self-end"
            >
              {updatingProductDetails ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Update Product"
              )}
            </button>
          </form>
        </section>
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Add stock</h2>
          <form
            onSubmit={handleAddStock}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                className="mt-1 p-2 w-full border rounded-md"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md w-full col-span-2 self-end"
            >
              {updatingStock ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Add Stock"
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
