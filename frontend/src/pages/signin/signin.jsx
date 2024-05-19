import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorAlert, SuccessAlert } from "../../global/alerts";

export function Signin() {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [signingIn, setSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginDetailsChange = (e) => {
    const { name, value, type } = e.target;
    setLoginDetails({
      ...loginDetails,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    setSigningIn(true);

    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginDetails),
    });
    const data = await response.json();

    setSigningIn(false);

    if (data.error) {
      ErrorAlert(data.error);
    } else {
      SuccessAlert("User logged in successfully");
      localStorage.setItem("token", data.token);
      navigate("/");
    }
  };

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
        } else {
          navigate("/");
        }
      }
    };
    isUserLoggedIn();
  }, []);

  return (
    <div className="bg-gray-100 pt-4">
      <h1 className="text-center text-3xl font-bold">Shopmitra</h1>
      <main className="flex min-h-screen items-start justify-center">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or
              <Link
                className="font-medium text-blue-600 hover:text-blue-500"
                to="/signup"
              >
                {" "}
                sign up for a new account
              </Link>
            </p>
          </div>
          <form
            onSubmit={handleSignIn}
            className="mt-8 space-y-6"
            method="POST"
          >
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <input
                  autoComplete="email"
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  id="email"
                  name="email"
                  placeholder="Email address"
                  required
                  type="email"
                  value={loginDetails.email || ""}
                  onChange={handleLoginDetailsChange}
                />
              </div>
              <div>
                <input
                  autoComplete="current-password"
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                  type="password"
                  value={loginDetails.password || ""}
                  onChange={handleLoginDetailsChange}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={loginDetails.rememberMe || false}
                  onChange={handleLoginDetailsChange}
                />
                <label
                  className="ml-2 block text-sm text-gray-900"
                  htmlFor="remember-me"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  className="font-medium text-blue-600 hover:text-blue-500"
                  to="#"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div>
              <button
                className={`group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  signingIn ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={signingIn}
                type="submit"
              >
                {signingIn ? (
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
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
