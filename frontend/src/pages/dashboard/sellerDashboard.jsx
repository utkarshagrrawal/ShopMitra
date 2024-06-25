import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRightIcon } from "../../components/chevronRightIcon";
import { ErrorAlert, SuccessAlert } from "../../global/alerts";
import Loader from "../../components/loader";
import { ChevronDownIcon } from "../../components/chevronDownIcon";

export function SellerDashboard() {
  const { section } = useParams();
  const [currentSection, setCurrentSection] = useState(section || "status");
  const [loading, setLoading] = useState(true);
  const [sellerBasicInfo, setSellerBasicInfo] = useState({});
  const [sellerProductsInfo, setSellerProductsInfo] = useState([]);
  const [productsPage, setProductsPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isNewProductSectionOpen, setIsNewProductSectionOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productTitle: "",
    productPrice: "",
    productListPrice: "",
    category: "",
    stock: 0,
    imgUrl: "",
  });
  const [addingNewProduct, setAddingNewProduct] = useState(false);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL +
            "seller/dashboard?page=" +
            productsPage,
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
          if (data.error === "Please login to proceed") {
            localStorage.removeItem("token");
            window.location.href =
              "/signin?redirectTo=" +
              encodeURIComponent(window.location.pathname);
            ErrorAlert("Please login to continue");
            return;
          }
          ErrorAlert(data.error);
          return;
        } else {
          setLoading(false);
          setSellerBasicInfo(data.sellerDetails);
          setSellerProductsInfo([
            ...sellerProductsInfo,
            ...data.sellerProducts,
          ]);
          setTotalProducts(data.totalSellerProducts);
        }
      } catch (error) {
        ErrorAlert("An error occurred. Please try again later");
        return;
      }
    };
    fetchSellerData();
  }, [productsPage]);

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "products/categories",
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
          if (data.error === "Please login to proceed") {
            localStorage.removeItem("token");
            window.location.href =
              "/signin?redirectTo=" +
              encodeURIComponent(window.location.pathname);
            ErrorAlert("Please login to continue");
            return;
          }
          ErrorAlert(data.error);
          return;
        } else {
          setIsNewProductSectionOpen(true);
          setAvailableCategories(data.categories);
        }
      } catch (error) {
        ErrorAlert("An error occurred. Please try again later");
        return;
      }
    };
    if (currentSection === "products" && isNewProductSectionOpen) {
      fetchProductCategories();
    }
  }, [isNewProductSectionOpen, currentSection]);

  const handleNewProductDetails = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddNewProduct = async (e) => {
    e.preventDefault();

    const urlRegex = new RegExp(
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
    );

    if (!urlRegex.test(newProduct.imgUrl)) {
      ErrorAlert("Please enter a valid image URL");
      return;
    }

    const priceRegex = new RegExp(/^\d+(\.\d{1,2})?$/);
    if (!priceRegex.test(newProduct.productPrice)) {
      ErrorAlert("Please enter a valid price");
      return;
    }
    if (!priceRegex.test(newProduct.productListPrice)) {
      ErrorAlert("Please enter a valid list price");
      return;
    }

    try {
      setAddingNewProduct(true);
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "products/add-new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(newProduct),
        }
      );
      const data = await response.json();
      setAddingNewProduct(false);
      if (data.error) {
        if (data.error === "Please login to proceed") {
          localStorage.removeItem("token");
          window.location.href =
            "/signin?redirectTo=" +
            encodeURIComponent(window.location.pathname);
          ErrorAlert("Please login to continue");
          return;
        }
        ErrorAlert(data.error);
        return;
      } else {
        SuccessAlert(data.message);
        location.reload();
      }
    } catch (error) {
      ErrorAlert("An error occurred. Please try again later");
      return;
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="container mx-auto py-8 px-4">
      <div className="grid md:grid-cols-[200px_1fr] gap-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full flex flex-col justify-center border border-4 border-green-500 relative">
            <img
              src="https://freerangestock.com/sample/119157/business-man-profile-vector.jpg"
              className="rounded-full w-24 h-24 object-contain mix-blend-multiply"
            />
            <span className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
          </div>
          <div className="mt-4 font-bold">{sellerBasicInfo?.name}</div>
          <div className="text-sm mt-4 text-gray-500 w-full"></div>
          <div className="mt-4 gap-4 w-full flex flex-col items-center">
            <Link
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                currentSection === "statistics" ? "bg-gray-200" : "bg-gray-100"
              } hover:bg-gray-200 shadow-md rounded-lg text-gray-800 hover:text-gray-900`}
              onClick={() => setCurrentSection("statistics")}
              to="/seller/dashboard/statistics"
            >
              <div className="text-sm font-medium">Status (Coming soon)</div>
              <ChevronRightIcon />
            </Link>
            <Link
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                currentSection === "products" ? "bg-gray-200" : "bg-gray-100"
              } hover:bg-gray-200 shadow-md rounded-lg text-gray-800 hover:text-gray-900`}
              onClick={() => setCurrentSection("products")}
              to="/seller/dashboard/products"
            >
              <div className="text-sm font-medium">Products</div>
              <ChevronRightIcon />
            </Link>
            <Link
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                currentSection === "orders" ? "bg-gray-200" : "bg-gray-100"
              } hover:bg-gray-200 shadow-md rounded-lg text-gray-800 hover:text-gray-900`}
              onClick={() => setCurrentSection("orders")}
              to="/seller/dashboard/orders"
            >
              <div className="text-sm font-medium">Orders</div>
              <ChevronRightIcon />
            </Link>
            <Link
              className="text-sm flex gap-1 items-center justify-center hover:underline hover:text-blue-600 transition-colors duration-100 ease-in-out"
              to="/"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Back to shop
            </Link>
          </div>
        </div>
        {currentSection === "statistics" && (
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Sales", value: "$0.00" },
                { title: "Total Orders", value: "0" },
                { title: "Total Products", value: "0" },
                { title: "Total Earnings", value: "$0.00" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white max-h-48 p-6 rounded-lg flex flex-col justify-center items-center shadow-md transition-transform transform hover:scale-105"
                >
                  <div className="text-lg font-semibold text-gray-600">
                    {item.title}
                  </div>
                  <div className="text-4xl font-extrabold text-gray-800">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {currentSection === "products" && (
          <div className="grid gap-4">
            <form className="w-full" onSubmit={handleAddNewProduct}>
              <div
                className="bg-blue-600 rounded-lg p-2 max-h-12 text-white font-semibold flex justify-center items-center gap-4 hover:bg-blue-700 hover:cursor-pointer transition-colors duration-100 ease-in-out"
                onClick={() =>
                  setIsNewProductSectionOpen(!isNewProductSectionOpen)
                }
              >
                Add a new product
                <span
                  className={`transition-transform duration-300 ${
                    !isNewProductSectionOpen ? "rotate-0" : "-rotate-180"
                  }`}
                >
                  <ChevronDownIcon />
                </span>
              </div>
              <div
                className={`flex flex-col bg-white p-4 ${
                  isNewProductSectionOpen ? "block" : "hidden"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label
                      className="mb-2 text-gray-700 font-medium"
                      htmlFor="productTitle"
                    >
                      Product Title
                    </label>
                    <input
                      type="text"
                      id="productTitle"
                      name="productTitle"
                      value={newProduct.productTitle || ""}
                      onChange={handleNewProductDetails}
                      placeholder="Enter product title"
                      className="p-2 border border-gray-300 focus:outline-none focus:border-blue-500 rounded-lg"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="mb-2 text-gray-700 font-medium"
                      htmlFor="productPrice"
                    >
                      Product Price
                    </label>
                    <input
                      type="text"
                      id="productPrice"
                      name="productPrice"
                      value={newProduct.productPrice || ""}
                      onChange={handleNewProductDetails}
                      placeholder="Enter product price"
                      className="p-2 border border-gray-300 focus:outline-none focus:border-blue-500 rounded-lg"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="mb-2 text-gray-700 font-medium"
                      htmlFor="productListPrice"
                    >
                      Product List Price
                    </label>
                    <input
                      type="text"
                      id="productListPrice"
                      name="productListPrice"
                      value={newProduct.productListPrice || ""}
                      onChange={handleNewProductDetails}
                      placeholder="Enter product list price"
                      className="p-2 border border-gray-300 focus:outline-none focus:border-blue-500 rounded-lg"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="mb-2 text-gray-700 font-medium"
                      htmlFor="category"
                    >
                      Category
                    </label>
                    <select
                      className="p-2 border border-gray-300 focus:outline-none focus:border-blue-500 rounded-lg"
                      id="category"
                      name="category"
                      value={newProduct.category || ""}
                      onChange={handleNewProductDetails}
                      required
                    >
                      {!isNewProductSectionOpen ? (
                        <option>Loading...</option>
                      ) : (
                        availableCategories?.length > 0 &&
                        availableCategories?.map((category, index) => {
                          if (index === 0) {
                            return (
                              <option key={index} value="" defaultValue="">
                                Select a category
                              </option>
                            );
                          } else {
                            return (
                              <option key={index} value={category.id}>
                                {category.category_name}
                              </option>
                            );
                          }
                        })
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="mb-2 text-gray-700 font-medium"
                      htmlFor="stock"
                    >
                      Stock
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={newProduct.stock || ""}
                      onChange={handleNewProductDetails}
                      placeholder="Enter stock"
                      className="p-2 border border-gray-300 focus:outline-none focus:border-blue-500 rounded-lg"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="mb-2 text-gray-700 font-medium"
                      htmlFor="imgUrl"
                    >
                      Product Image URL
                    </label>
                    <input
                      type="text"
                      id="imgUrl"
                      name="imgUrl"
                      value={newProduct.imgUrl || ""}
                      onChange={handleNewProductDetails}
                      placeholder="Enter product image URL"
                      className="p-2 border border-gray-300 focus:outline-none focus:border-blue-500 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <button
                  className={`w-fit rounded-lg self-end mt-4 bg-blue-600 text-white p-2 px-4 hover:bg-blue-700 transition-colors ${
                    addingNewProduct && "cursor-not-allowed opacity-50"
                  }`}
                  disabled={addingNewProduct}
                >
                  {addingNewProduct ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 bg-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.009 8.009 0 014.709 10H2c3.042 0 5.791 1.358 7.646 3.5l-2.646 2.646z"
                      ></path>
                    </svg>
                  ) : (
                    "Add Product"
                  )}
                </button>
              </div>
            </form>
            <div className="">
              <h3 className="text-2xl font-bold text-gray-800">
                Existing Products
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sellerProductsInfo?.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg border mt-4 hover:cursor-pointer hover:shadow-md transition-transform transform hover:scale-105"
                    onClick={() =>
                      (location.href = `/seller/product/${product._id}`)
                    }
                  >
                    <img
                      src={product.imgUrl}
                      alt={product.title}
                      className="w-full h-64 object-contain rounded-lg aspect-square max-w-sm"
                    />
                    <div className="mt-4">
                      <h3 className="text-lg font-bold text-gray-800 truncate">
                        {product.title}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-2xl font-semibold text-gray-700">
                          ${product.price}
                        </span>
                        {product.listPrice && (
                          <span className="text-base line-through text-gray-400">
                            ${product.listPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className={`flex mt-4 justify-center items-center ${
                  totalProducts > productsPage * 10 || "hidden"
                }`}
              >
                <button
                  className="bg-blue-600 w-full text-white p-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => setProductsPage(productsPage + 1)}
                >
                  Load More
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
