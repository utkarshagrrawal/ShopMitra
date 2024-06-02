import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./searchBar";
import { CartIcon } from "../components/cartIcon";
import { LogoutIcon } from "../components/logoutIcon";
import { OrdersIcon } from "../components/ordersIcon";
import { FavouriteIcon } from "../components/favouriteIcon";
import logo from "../assets/logo.png";

export default function Header(props) {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
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
      if (token) {
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
          }
          setIsUserSignedIn(false);
        } else {
          setIsUserSignedIn(true);
          setUserDetails(data.user);
        }
      }
    };
    isUserLoggedIn();
  }, []);

  return (
    <div className="flex w-full justify-between items-center h-[60px] px-4 border-b">
      <a href="/" className="flex items-center gap-2">
        <img src={logo} className="w-16 h-16 mix-blend-normal rounded-full" />
      </a>
      <SearchBar searchQuery={props.searchQuery} />
      <div className="flex items-center gap-4">
        <div className="flex items-center relative">
          <CartIcon />
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {props?.quantity ? (props.quantity > 9 ? "9+" : props.quantity) : 0}
          </span>
        </div>
        <div className="flex flex-col items-center relative">
          {isUserSignedIn ? (
            <>
              <div
                onClick={toggleProfileDropdown}
                className="hover:cursor-pointer"
                ref={(input) => (profileDropdownRef.current = input)}
              >
                <img
                  src={`https://randomuser.me/api/portraits/men/1.jpg`}
                  className="w-8 h-8 rounded-full"
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
                      src={`https://randomuser.me/api/portraits/men/1.jpg`}
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
              className="flex items-center gap-2 hover:cursor-pointer"
              onClick={() => (location.href = "/signin")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
