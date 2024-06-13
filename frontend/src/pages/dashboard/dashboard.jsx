import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRightIcon } from "../../components/chevronRightIcon";
import { ChevronDownIcon } from "../../components/chevronDownIcon";
import { ErrorAlert, SuccessAlert } from "../../global/alerts";
import ToggleSwitch from "../../components/toggleButton";
import DeleteConfirmationModal from "../../layouts/deleteModal";

export function Profile() {
  const { section } = useParams();
  const [currentSection, setCurrentSection] = useState(section || "orders");
  const [userProfileData, setUserProfileData] = useState({
    name: "",
    phone: "",
    address: "",
    date_of_birth: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({});
  const [notificationPreferencesUpdating, setNotificationPreferencesUpdating] =
    useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [changingPassword, setChangingPassword] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderPage, setOrderPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const dateTimeFormatter = Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "auth/is-logged-in",
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        if (data.error === "Unauthorized") {
          localStorage.removeItem("token");
          ErrorAlert("You are not logged in. Please login to view this page.");
          window.location.href = "/";
        }
        ErrorAlert(data.error);
      } else {
        setUserProfileData({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          address: data.user.address,
          date_of_birth: data.user.date_of_birth,
        });
        setNotificationPreferences({
          orderUpdates: data.user.notification_preferences?.orderUpdates,
          promotions: data.user.notification_preferences?.promotions,
          newsletter: data.user.notification_preferences?.newsletter,
        });
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "user/wishlist",
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
        setWishlistLoading(false);
        setWishlist(data.wishlist);
      }
    };
    fetchWishlist();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "user/orders?page=" + orderPage,
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
          setOrdersLoading(false);
          if (orderPage === 1) {
            setTotalOrders(data.totalOrders);
            setOrders(data.orders);
          } else {
            setOrders([...orders, ...data.orders]);
          }
        }
      } catch (error) {
        ErrorAlert("An error occurred while fetching orders");
        console.log(error);
      }
    };
    fetchOrders();
  }, [orderPage]);

  const handleNewProfileDetails = (e) => {
    setUserProfileData({ ...userProfileData, [e.target.name]: e.target.value });
  };

  const handleEditProfile = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }
    if (
      !userProfileData.name ||
      !userProfileData.phone ||
      !userProfileData.date_of_birth
    ) {
      ErrorAlert("Please fill all the fields");
      return;
    }

    setEditMode(false);
    setIsSaving(true);

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "user/update-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(userProfileData),
      }
    );
    const data = await response.json();

    setIsSaving(false);

    if (data.error) {
      ErrorAlert(data.error);
    } else {
      SuccessAlert(data.message);
    }
  };

  const handleEditNotificationPreferences = (e) => {
    setNotificationPreferences({
      ...notificationPreferences,
      [e.target.id]: e.target.checked,
    });
  };

  const handleSaveNotificationPreferences = async () => {
    setNotificationPreferencesUpdating(true);

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "user/notification-preferences",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(notificationPreferences),
      }
    );
    const data = await response.json();

    setNotificationPreferencesUpdating(false);

    if (data.error) {
      ErrorAlert(data.error);
    } else {
      SuccessAlert(data.message);
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-500";
      case 5:
        return "bg-green-700";
      default:
        return "bg-gray-200";
    }
  };

  const handlePasswordStrength = (e) => {
    const password = e.target.value;
    let score = 0;
    if (password.length > 12) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/\d+/)) score++;
    if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) score++;
    if (password.length === 0) score = 0;
    setPasswordStrength(score);
  };

  const handlePasswordDetails = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    if (e.target.name === "newPassword") handlePasswordStrength(e);
  };

  const handleSavePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      ErrorAlert("Please fill all the fields");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      ErrorAlert("Passwords do not match");
      return;
    }
    if (passwordStrength < 3) {
      ErrorAlert("Password is too weak");
      return;
    }

    setChangingPassword(true);

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "user/change-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(passwordData),
      }
    );
    const data = await response.json();

    setChangingPassword(false);

    if (data.error) {
      ErrorAlert(data.error);
    } else {
      SuccessAlert(data.message);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-4">
      <div className="grid md:grid-cols-[200px_1fr] gap-8">
        <div className="flex flex-col items-center gap-4">
          <img
            className="w-24 h-24 rounded-full border border-gray-200 shadow-md"
            src={`https://api.dicebear.com/8.x/notionists/svg?seed=${
              userProfileData.date_of_birth?.split("T")[0]?.split("-")[2]
            }`}
            alt={userProfileData.name}
          />
          <div className="text-center">
            <h2 className="text-xl font-bold">{userProfileData.name}</h2>
            <p className="text-gray-500">
              I'm a passionate ecommerce enthusiast and love discovering new
              products.
            </p>
          </div>
          <div className="mt-8 w-full">
            <h3 className="text-lg font-semibold text-center">My account</h3>
            <div className="mt-4 grid gap-4">
              <Link
                className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                  currentSection === "orders" ? "bg-gray-200" : "bg-gray-100"
                } hover:bg-gray-200 shadow-md rounded-lg text-gray-800 hover:text-gray-900`}
                onClick={() => setCurrentSection("orders")}
                to="/dashboard/orders"
              >
                <div className="text-sm font-medium">Orders and wishlist</div>
                <ChevronRightIcon />
              </Link>
              <Link
                className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                  currentSection === "profile" ? "bg-gray-200" : "bg-gray-100"
                } hover:bg-gray-200 shadow-md rounded-lg text-gray-800 hover:text-gray-900`}
                onClick={() => setCurrentSection("profile")}
                to="/dashboard/profile"
              >
                <div className="text-sm font-medium">Profile Information</div>
                <ChevronRightIcon />
              </Link>
              <Link
                className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                  currentSection === "payments" ? "bg-gray-200" : "bg-gray-100"
                } hover:bg-gray-200 shadow-md rounded-lg text-gray-800 hover:text-gray-900`}
                onClick={() => setCurrentSection("payments")}
                to="/dashboard/payments"
              >
                <div className="text-sm font-medium">Payment Methods</div>
                <ChevronRightIcon />
              </Link>
              <Link
                className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                  currentSection === "notification"
                    ? "bg-gray-200"
                    : "bg-gray-100"
                } hover:bg-gray-200 shadow-md rounded-lg text-gray-800 hover:text-gray-900`}
                onClick={() => setCurrentSection("notification")}
                to="/dashboard/notification"
              >
                <div className="text-sm font-medium">
                  Notification Preferences
                </div>
                <ChevronRightIcon />
              </Link>
              <Link
                className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                  currentSection === "security" ? "bg-gray-200" : "bg-gray-100"
                } hover:bg-gray-200 shadow-md rounded-lg text-gray-800 hover:text-gray-900`}
                onClick={() => setCurrentSection("security")}
                to="/dashboard/security"
              >
                <div className="text-sm font-medium">Security and Privacy</div>
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
        </div>

        {currentSection === "orders" && (
          <div className="grid gap-8">
            <div>
              <h3 className="text-lg font-semibold">Orders</h3>
              <div className="mt-4 grid gap-4">
                {ordersLoading ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded-md mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded-md"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-gray-500 text-center">
                    No orders found
                  </div>
                ) : (
                  orders.map((order, i) => (
                    <div
                      key={i}
                      className="p-4 border border-gray-200 rounded-lg mb-1"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className="text-sm font-medium text-blue-600 hover:underline hover:cursor-pointer"
                          onClick={() =>
                            (location.href =
                              "/order-tracking/" + order.order.orderId)
                          }
                        >
                          Order #{order.order.orderId}
                        </div>
                        <div className="text-sm font-semibold text-green-500">
                          {order.status}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        Placed on{" "}
                        {dateTimeFormatter.format(
                          new Date(order.order.createdAt)
                        )}
                      </div>
                      <div className="grid gap-4 border-t border-gray-200 pt-4">
                        {order.order.products.map((product, i) => (
                          <div
                            className="flex items-center justify-between"
                            key={i}
                          >
                            <div className="text-sm font-medium text-gray-700 text-clip">
                              {
                                order.products.find(
                                  (item) => item._id === product.product
                                ).title
                              }
                              ...
                            </div>
                            <div className="text-sm text-gray-600">
                              x{" "}
                              {
                                order.order.products.find(
                                  (item) => item.product === product.product
                                ).quantity
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-right text-sm font-semibold text-gray-800">
                        Total: ${order.order.total}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div
                className={`flex items-center justify-center bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors duration-300 ease-in-out hover:cursor-pointer mt-4 ${
                  totalOrders <= orderPage * 3 && "hidden"
                }`}
                onClick={() => setOrderPage(orderPage + 1)}
              >
                <div className="text-sm font-medium">View more</div>
                <ChevronDownIcon />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Wishlist</h3>
              <div
                className={`mt-4 ${
                  wishlist.length > 0 ||
                  (wishlistLoading &&
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4")
                }`}
              >
                {wishlistLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="relative group overflow-hidden border rounded-lg shadow-lg hover:shadow-xl duration-300"
                    >
                      <div className="animate-pulse">
                        <div className="bg-gray-300 object-contain w-full h-48"></div>
                        <div className="bg-white p-4">
                          <div className="h-6 bg-gray-300 rounded-md mb-2"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded-md"></div>
                            <div className="h-4 bg-gray-300 rounded-md"></div>
                            <div className="h-4 bg-gray-300 rounded-md"></div>
                          </div>
                          <div className="mt-2 h-6 bg-gray-300 rounded-md"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : wishlist.length === 0 ? (
                  <div className="border rounded-lg p-4 shadow-sm">
                    <div className="text-gray-500 text-center">
                      No items in wishlist
                    </div>
                  </div>
                ) : (
                  wishlist.map((product, i) => (
                    <div
                      key={i}
                      className="relative group overflow-hidden border rounded-lg shadow-lg hover:shadow-xl duration-300"
                    >
                      <img
                        alt="Product 1"
                        className="object-contain w-full h-32"
                        src={product.imgUrl}
                      />
                      <div
                        className="bg-white p-4 hover:cursor-pointer"
                        onClick={() =>
                          (location.href = "/product/" + product._id)
                        }
                      >
                        <p className="text-sm text-gray-500 hover:underline">
                          {product.title}
                        </p>
                        <div className="mt-2 text-sm font-medium">
                          <span>$</span> {product.price}
                          {product.listPrice > product.price && (
                            <span className="text-gray-500 line-through ml-2">
                              {product.listPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {!wishlistLoading && wishlist.length > 3 && (
                <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors duration-300 ease-in-out hover:cursor-pointer mt-4">
                  <div className="text-sm font-medium">View more</div>
                  <ChevronDownIcon />
                </div>
              )}
            </div>
          </div>
        )}

        {currentSection === "profile" && (
          <div className="flex flex-col space-y-6">
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Name</h3>
              <input
                className="w-full border rounded-lg p-2 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 transition-all"
                type="text"
                name="name"
                value={userProfileData.name || ""}
                onChange={handleNewProfileDetails}
                disabled={!editMode}
              />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Email</h3>
                <span className="text-sm text-gray-500">
                  *Email cannot be changed
                </span>
              </div>
              <input
                className="w-full border rounded-lg p-2 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 transition-all cursor-not-allowed"
                type="email"
                name="email"
                value={userProfileData.email || ""}
                disabled
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Phone</h3>
              <input
                className="w-full border rounded-lg p-2 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 transition-all"
                type="tel"
                name="phone"
                value={userProfileData.phone || ""}
                onChange={handleNewProfileDetails}
                disabled={!editMode}
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Address</h3>
              <textarea
                className="w-full border rounded-lg p-2 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 transition-all"
                type="text"
                name="address"
                value={userProfileData.address || ""}
                onChange={handleNewProfileDetails}
                disabled={!editMode}
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Date of Birth</h3>
              <input
                className="w-full border rounded-lg p-2 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 transition-all"
                type="date"
                name="date_of_birth"
                value={userProfileData.date_of_birth?.split("T")[0] || ""}
                onChange={handleNewProfileDetails}
                disabled={!editMode}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className={`text-white px-4 py-2 rounded-lg flex justify-center ${
                  editMode
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleEditProfile}
              >
                {isSaving ? (
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
                ) : editMode ? (
                  "Save"
                ) : (
                  "Edit"
                )}
              </button>
            </div>
          </div>
        )}

        {currentSection === "payments" && (
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-lg font-semibold">Cards</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src="https://logowik.com/content/uploads/images/219_visa.jpg"
                      alt="Credit Card Icon"
                      className="h-8 w-8 mr-3 object-contain"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">Visa</h3>
                      <p className="text-gray-600">Ending in 1234</p>
                    </div>
                  </div>
                  <button className="text-gray-600 hover:text-red-500 focus:outline-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-8">UPI</h3>
              </div>
            </div>
          </div>
        )}

        {currentSection === "notification" && (
          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Email Notifications</h3>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">Order Updates</div>
                <div>
                  <ToggleSwitch
                    id="orderUpdates"
                    notificationPreferences={notificationPreferences}
                    onChange={handleEditNotificationPreferences}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">Promotions</div>
                <div>
                  <ToggleSwitch
                    id="promotions"
                    notificationPreferences={notificationPreferences}
                    onChange={handleEditNotificationPreferences}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">Newsletter</div>
                <div>
                  <ToggleSwitch
                    id="newsletter"
                    notificationPreferences={notificationPreferences}
                    onChange={handleEditNotificationPreferences}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 flex justify-center"
                onClick={handleSaveNotificationPreferences}
              >
                {notificationPreferencesUpdating ? (
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
                  "Save Preferences"
                )}
              </button>
            </div>
          </div>
        )}

        {currentSection === "security" && (
          <div className="flex flex-col space-y-8">
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Change Password</h3>
              <div className="flex flex-col space-y-4">
                <input
                  className="w-full border rounded-lg p-2 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 transition-all"
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  onChange={handlePasswordDetails}
                />
                <div className="flex flex-col">
                  <input
                    className="w-full border rounded-lg p-2 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 transition-all"
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    onChange={handlePasswordDetails}
                  />
                  <div
                    className={`flex w-full h-4 my-2 transition-colors duration-200 ${
                      passwordStrength === 0 ? "hidden" : "block"
                    }`}
                  >
                    {[...Array(5)].map((_, i) => {
                      return (
                        <div
                          key={i}
                          className={`${
                            i === 0
                              ? "border rounded-l-lg w-full"
                              : i === 4
                              ? "border rounded-r-lg w-full"
                              : "border w-full"
                          } transition-colors duration-300 ${
                            passwordStrength > i &&
                            getStrengthColor(passwordStrength)
                          }`}
                        ></div>
                      );
                    })}
                  </div>
                  <span className="self-end">
                    {passwordStrength === 1
                      ? "Very weak"
                      : passwordStrength === 2
                      ? "Weak"
                      : passwordStrength === 3
                      ? "Medium"
                      : passwordStrength === 4
                      ? "Strong"
                      : passwordStrength === 5
                      ? "Very strong"
                      : ""}
                  </span>
                </div>
                <input
                  className="w-full border rounded-lg p-2 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 transition-all"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  onChange={handlePasswordDetails}
                />
                <button
                  className={`bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 transition-colors duration-200 ease-in-out flex justify-center ${
                    changingPassword && "cursor-not-allowed opacity-50"
                  }`}
                  disabled={changingPassword}
                  onClick={handleSavePassword}
                >
                  {changingPassword ? (
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
                    "Save Password"
                  )}
                </button>
              </div>
            </div>
            <div className="mt-4 bg-gray-100 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-red-600">
                Delete Account
              </h3>
              <p className="text-gray-600 mt-2">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <button
                className="text-white px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 focus:outline-none mt-4"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
      />
    </div>
  );
}
