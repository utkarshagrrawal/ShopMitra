import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./searchBar";
import { CartIcon } from "../components/cartIcon";
import { LogoutIcon } from "../components/logoutIcon";
import Logo from "../components/logo";

export default function Header(props) {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [cartItemsQuantity, setCartItemsQuantity] = useState(0);
  const [userDetails, setUserDetails] = useState({});
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const profileDropdownRef = useRef(null);

  const toggleProfileDropdown = () => {
    if (isProfileDropdownOpen) {
      setIsProfileDropdownOpen(false);
    } else {
      setIsProfileDropdownOpen(true);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    setIsUserSignedIn(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutsideProfileDropdown = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutsideProfileDropdown);
    return () =>
      document.removeEventListener("click", handleClickOutsideProfileDropdown);
  }, []);

  useEffect(() => {
    const isUserLoggedIn = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "auth/is-logged-in",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        if (data.error === "Unauthorized") {
          localStorage.removeItem("token");
          props?.redirectTo &&
            (location.href = `/signin?redirectTo=${encodeURIComponent(
              props?.redirectTo
            )}`);
        }
        setIsUserSignedIn(false);
      } else {
        setIsUserSignedIn(true);
        setUserDetails(data.user);
      }
    };
    isUserLoggedIn();
  }, []);

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
          return;
        }
        setCartItemsQuantity(data.cart.length);
      } catch (error) {
        ErrorAlert("An error occurred while fetching cart items");
        console.log(error);
      }
    };
    fetchCartItems();
  }, []);

  return windowWidth < 600 ? (
    <div className="flex flex-col w-full justify-between items-center h-auto gap-2 px-4 py-2 border-b">
      <div className="flex w-full justify-between mb-2">
        <a href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span className="text-lg font-semibold">Shopmitra</span>
        </a>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center relative hover:cursor-pointer"
            onClick={() => (location.pathname = "/cart")}
          >
            <CartIcon />
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemsQuantity
                ? cartItemsQuantity > 9
                  ? "9+"
                  : cartItemsQuantity
                : 0}
            </span>
          </div>
          <div className="flex flex-col items-center relative">
            {isUserSignedIn ? (
              <>
                <div
                  onClick={toggleProfileDropdown}
                  className="hover:cursor-pointer min-w-8"
                  ref={(input) => (profileDropdownRef.current = input)}
                >
                  <img
                    src={`https://api.dicebear.com/8.x/notionists/svg?seed=${
                      userDetails.date_of_birth?.split("T")[0]?.split("-")[2]
                    }`}
                    className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                  />
                </div>
                <div
                  className={`absolute z-30 right-0 top-[60px] bg-white border border-gray-200 rounded-lg w-48 h-auto shadow-lg transform transition-transform duration-300 ease-in-out ${
                    isProfileDropdownOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="flex flex-col bg-white rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center h-12 border-b px-4 gap-4 hover:bg-gray-100"
                      onClick={() => (location.href = "/dashboard/orders")}
                    >
                      <img
                        src={`https://api.dicebear.com/8.x/notionists/svg?seed=${
                          userDetails.date_of_birth
                            ?.split("T")[0]
                            ?.split("-")[2]
                        }`}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-gray-800 font-medium">
                        My Account
                      </span>
                    </button>
                    <button
                      className="w-full flex items-center h-12 px-4 gap-4 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        <LogoutIcon />
                      </div>
                      <span className="text-gray-800 font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                className="flex items-center hover:cursor-pointer px-2 py-1"
                onClick={() =>
                  (location.href =
                    "/signin?redirectTo=" +
                    encodeURIComponent(location.pathname))
                }
              >
                <img
                  src={`https://api.dicebear.com/8.x/notionists/svg?seed=${
                    userDetails.date_of_birth?.split("T")[0]?.split("-")[2]
                  }`}
                  className="min-w-8 h-8 border rounded-full shadow-sm"
                />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <SearchBar searchQuery={props.searchQuery} />
      </div>
    </div>
  ) : (
    <div className="flex w-full justify-between items-center h-auto lg:h-[60px] gap-2 px-4 py-2 border-b">
      <a href="/" className="flex items-center gap-2">
        <Logo className="h-6 w-6" />
        <span className="text-lg font-semibold">Shopmitra</span>
      </a>
      <div className="w-full lg:w-auto flex justify-center lg:justify-start">
        <SearchBar searchQuery={props.searchQuery} />
      </div>
      <div className="flex items-center gap-4">
        <div
          className="flex items-center relative hover:cursor-pointer"
          onClick={() => (location.pathname = "/cart")}
        >
          <CartIcon />
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartItemsQuantity
              ? cartItemsQuantity > 9
                ? "9+"
                : cartItemsQuantity
              : 0}
          </span>
        </div>
        <div className="flex flex-col items-center relative">
          {isUserSignedIn ? (
            <>
              <div
                onClick={toggleProfileDropdown}
                className="hover:cursor-pointer min-w-8"
                ref={(input) => (profileDropdownRef.current = input)}
              >
                <img
                  src={`https://api.dicebear.com/8.x/notionists/svg?seed=${
                    userDetails.date_of_birth?.split("T")[0]?.split("-")[2]
                  }`}
                  className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                />
              </div>
              <div
                className={`absolute z-30 right-0 top-[60px] bg-white border border-gray-200 rounded-lg w-48 h-auto shadow-lg transform transition-transform duration-300 ease-in-out ${
                  isProfileDropdownOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="flex flex-col bg-white rounded-lg overflow-hidden">
                  <button
                    className="w-full flex items-center h-12 border-b px-4 gap-4 hover:bg-gray-100"
                    onClick={() => (location.href = "/dashboard/orders")}
                  >
                    <img
                      src={`https://api.dicebear.com/8.x/notionists/svg?seed=${
                        userDetails.date_of_birth?.split("T")[0]?.split("-")[2]
                      }`}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-800 font-medium">
                      My Account
                    </span>
                  </button>
                  <button
                    className="w-full flex items-center h-12 px-4 gap-4 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <LogoutIcon />
                    </div>
                    <span className="text-gray-800 font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              className="flex items-center hover:cursor-pointer px-2 py-1"
              onClick={() =>
                (location.href =
                  "/signin?redirectTo=" + encodeURIComponent(location.pathname))
              }
            >
              <img
                src={`https://api.dicebear.com/8.x/notionists/svg?seed=${
                  userDetails.date_of_birth?.split("T")[0]?.split("-")[2]
                }`}
                className="min-w-8 h-8 border rounded-full shadow-sm"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
