import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./searchBar";
import { CartIcon } from "../components/cartIcon";
import { LogoutIcon } from "../components/logoutIcon";
import { OrdersIcon } from "../components/ordersIcon";
import { FavouriteIcon } from "../components/favouriteIcon";

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
          "http://localhost:3000/auth/is-logged-in",
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
          localStorage.removeItem("token");
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
      <span className="text-2xl font-semibold text-black">Shopmitra</span>
      <SearchBar />
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <CartIcon />
          <span className="text-black ml-2">{props?.quantity || 0}</span>
        </div>
        <div className="flex flex-col items-center relative">
          {isUserSignedIn ? (
            <>
              <div
                onClick={toggleProfileDropdown}
                className="hover:cursor-pointer"
                ref={(input) => (profileDropdownRef.current = input)}
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
              </div>
              <div
                className={`absolute mr-44 top-[60px] bg-white border border-black rounded-lg w-48 h-auto duration-300 z-10 ${
                  isProfileDropdownOpen ? "block" : "hidden"
                }`}
              >
                <div className="flex flex-col">
                  <button className="w-full flex items-center h-12 border-b px-4 gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-[18px] h-[18px] text-black"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    Profile
                  </button>
                  <button className="w-full flex items-center h-12 border-b px-4 gap-4">
                    <FavouriteIcon />
                    Favourites
                  </button>
                  <button className="w-full flex items-center h-12 border-b px-4 gap-4">
                    <OrdersIcon />
                    Orders
                  </button>
                  <button
                    className="w-full flex items-center h-12 px-4 gap-4"
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                    Logout
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
