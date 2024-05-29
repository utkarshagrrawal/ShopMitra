import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRightIcon } from "../../components/chevronRightIcon";
import { ChevronDownIcon } from "../../components/chevronDownIcon";
import { ErrorAlert, SuccessAlert } from "../../global/alerts";
import ToggleSwitch from "../../components/toggleButton";
import DeleteConfirmationModal from "../../components/modal";

export function Profile() {
  const { section } = useParams();
  const [currentSection, setCurrentSection] = useState(section || "orders");
  const [userProfileData, setUserProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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
        }
        ErrorAlert("You are not logged in. Please login to view this page.");
      } else {
        setUserProfileData(data.user);
      }
    };
    fetchUserProfile();
  }, []);

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
      !userProfileData.dob
    ) {
      ErrorAlert("Please fill all the fields");
      return;
    }
    setEditMode(false);
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "user/update-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfileData),
      }
    );
    const data = await response.json();
    if (data.error) {
      ErrorAlert(data.error);
    } else {
      SuccessAlert(data.message);
    }
  };

  const handleSavePassword = async () => {};

  const handleDeleteAccount = async () => {
    setDeleteModalOpen(true);
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
    let score = 1;
    if (password.length > 12) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/\d+/)) score++;
    if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) score++;
    setPasswordStrength(score);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid md:grid-cols-[200px_1fr] gap-8">
        <div className="flex flex-col items-center gap-4">
          <img
            className="w-24 h-24 rounded-full"
            src={`https://randomuser.me/api/portraits/men/1.jpg`}
            alt="John Doe"
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
                <div className="border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium hover:underline hover:cursor-pointer text-blue-600">
                      Order #12345
                    </div>
                    <div className="text-sm text-green-500">Delivered</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Placed on June 15, 2023
                  </div>
                  <div className="mt-4 grid gap-2">
                    <div className="flex items-center justify-between">
                      <div>Wireless Headphones</div>
                      <div>x1</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Leather Wallet</div>
                      <div>x1</div>
                    </div>
                  </div>
                  <div className="mt-4 text-right text-sm font-medium">
                    Total: ₹149.99
                  </div>
                </div>
                <div className="border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium hover:underline hover:cursor-pointer text-blue-600">
                      Order #54321
                    </div>
                    <div className="text-sm text-yellow-500">Processing</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Placed on May 30, 2023
                  </div>
                  <div className="mt-4 grid gap-2">
                    <div className="flex items-center justify-between">
                      <div>Outdoor Backpack</div>
                      <div>x1</div>
                    </div>
                  </div>
                  <div className="mt-4 text-right text-sm font-medium">
                    Total: ₹79.99
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors duration-300 ease-in-out hover:cursor-pointer mt-4">
                <div className="text-sm font-medium">View more</div>
                <ChevronDownIcon />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Wishlist</h3>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="relative group overflow-hidden border rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-2">
                  <img
                    alt="Product 1"
                    className="object-contain w-full h-48"
                    src="https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png"
                  />
                  <div className="bg-white p-4">
                    <h4 className="font-semibold">Makeup kit</h4>
                    <p className="text-sm text-gray-500">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quae aspernatur hic sed aliquam sit ratione tempore
                      inventore rerum libero doloribus fugiat quibusdam, dolor
                      dolore ullam blanditiis deserunt id quod possimus.
                    </p>
                    <div className="mt-2 text-sm font-medium">₹49.99</div>
                  </div>
                </div>
                <div className="relative group overflow-hidden border rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-2">
                  <img
                    alt="Product 2"
                    className="object-contain w-full h-48"
                    src="https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
                  />
                  <div className="bg-white p-4">
                    <h4 className="font-semibold">Eye lash</h4>
                    <p className="text-sm text-gray-500">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Magni, corrupti. Expedita, ratione dolor quos obcaecati
                      autem eligendi maiores fugit consequatur tempore iure illo
                      cupiditate animi id, quisquam veritatis doloribus vitae!
                    </p>
                    <div className="mt-2 text-sm font-medium">₹79.99</div>
                  </div>
                </div>
                <div className="relative group overflow-hidden border rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-2">
                  <img
                    alt="Product 3"
                    className="object-contain w-full h-48"
                    src="https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png"
                  />
                  <div className="bg-white p-4">
                    <h4 className="font-semibold">Foundation</h4>
                    <p className="text-sm text-gray-500">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Corporis blanditiis impedit reiciendis repellat ipsam
                      cupiditate est obcaecati minima quibusdam recusandae
                      numquam tenetur, ullam cum ducimus repellendus doloremque,
                      soluta ea! Impedit.
                    </p>
                    <div className="mt-2 text-sm font-medium">₹99.99</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors duration-300 ease-in-out hover:cursor-pointer mt-4">
                <div className="text-sm font-medium">View more</div>
                <ChevronDownIcon />
              </div>
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
                placeholder={userProfileData.name}
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
                placeholder={userProfileData.email}
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
                placeholder={userProfileData.phone}
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
                placeholder={userProfileData.address}
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
                name="dob"
                placeholder={userProfileData.dob}
                value={userProfileData.date_of_birth?.split("T")[0] || ""}
                onChange={handleNewProfileDetails}
                disabled={!editMode}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className={`text-white px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out ${
                  editMode
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleEditProfile}
              >
                {editMode ? "Save" : "Edit"}
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
                  <ToggleSwitch />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">Promotions</div>
                <div>
                  <ToggleSwitch />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">Newsletter</div>
                <div>
                  <ToggleSwitch />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Push Notifications</h3>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">Order Updates</div>
                <div>
                  <ToggleSwitch />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">Promotions</div>
                <div>
                  <ToggleSwitch />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">Newsletter</div>
                <div>
                  <ToggleSwitch />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 transition-colors duration-200 ease-in-out">
                Save Preferences
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
                />
                <div className="flex flex-col">
                  <input
                    className="w-full border rounded-lg p-2 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 transition-all"
                    type="password"
                    name="password"
                    placeholder="New Password"
                    onKeyDown={handlePasswordStrength}
                  />
                  <div className="flex w-full h-4 my-2 transition-colors duration-200">
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
                          } ${
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
                      : "Very strong"}
                  </span>
                </div>
                <input
                  className="w-full border rounded-lg p-2 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 transition-all"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                />
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 transition-colors duration-200 ease-in-out"
                  onClick={handleSavePassword}
                >
                  Save Password
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
