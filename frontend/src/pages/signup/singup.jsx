import React, { useState } from "react";
import { getExactYearsDifference } from "../../global/helpers";
import { ErrorAlert, SuccessAlert } from "../../global/alerts";
import { Link } from "react-router-dom";

export function Signup() {
  const [signupDetails, setSignupDetails] = useState({
    email: "",
    phone: "",
    password: "",
    name: "",
    gender: "",
    dob: "",
  });
  const [registering, setRegistering] = useState(false);

  const handleSignupDetailsChange = (e) => {
    setSignupDetails({ ...signupDetails, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (
      !signupDetails.email ||
      !signupDetails.phone ||
      !signupDetails.password ||
      !signupDetails.name ||
      !signupDetails.gender ||
      !signupDetails.dob
    ) {
      ErrorAlert("All fields are required");
      return;
    }
    if (
      signupDetails.dob &&
      getExactYearsDifference(new Date(signupDetails.dob), new Date()) < 18
    ) {
      ErrorAlert("You must be 18 years or older to sign up");
      return;
    }

    setRegistering(true);

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupDetails),
      }
    );
    const data = await response.json();

    setRegistering(false);

    if (data.error) {
      ErrorAlert(data.error);
    } else {
      SuccessAlert("User registered successfully");
      setSignupDetails({
        email: "",
        phone: "",
        password: "",
        name: "",
        gender: "",
        dob: "",
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-4">
      <h1 className="text-center text-3xl font-bold">Shopmitra</h1>
      <main className="flex items-start justify-center">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
              Sign up for your account
            </h2>
          </div>
          <form
            onSubmit={handleSignUp}
            className="mt-8 space-y-6"
            method="POST"
          >
            <div className="-space-y-px rounded-md shadow-sm">
              <label htmlFor="email">Email address</label>
              <input
                autoComplete="email"
                id="email"
                name="email"
                value={signupDetails.email || ""}
                onChange={handleSignupDetailsChange}
                placeholder="name@example.com"
                required
                type="email"
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div className="-space-y-px rounded-md shadow-sm">
              <label htmlFor="phone">Phone number</label>
              <input
                autoComplete="tel"
                id="phone"
                name="phone"
                value={signupDetails.phone || ""}
                onChange={handleSignupDetailsChange}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="99999 99999"
                required
                type="tel"
              />
            </div>
            <div className="-space-y-px rounded-md shadow-sm">
              <label htmlFor="password">Password</label>
              <input
                autoComplete="current-password"
                id="password"
                name="password"
                value={signupDetails.password || ""}
                onChange={handleSignupDetailsChange}
                placeholder="********"
                required
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                type="password"
              />
            </div>
            <div className="-space-y-px rounded-md shadow-sm">
              <label htmlFor="name">Full name</label>
              <input
                autoComplete="name"
                id="name"
                name="name"
                value={signupDetails.name || ""}
                onChange={handleSignupDetailsChange}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="John Doe"
                required
                type="text"
              />
            </div>
            <div className="-space-y-px rounded-md shadow-sm">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={signupDetails.gender || ""}
                onChange={handleSignupDetailsChange}
                required
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="-space-y-px rounded-md shadow-sm">
              <label htmlFor="dob">Date of birth</label>
              <input
                autoComplete="bday"
                id="dob"
                name="dob"
                value={signupDetails.dob || ""}
                onChange={handleSignupDetailsChange}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
                type="date"
              />
            </div>
            <div>
              <button
                className={`group flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  registering ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={registering}
                type="submit"
              >
                {registering ? (
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
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
          <div>
            <h2 className="mt-6 font-medium text-blue-600 hover:text-blue-500 text-center">
              <Link to="/signin">Already have an account? Sign in</Link>
            </h2>
          </div>
        </div>
      </main>
    </div>
  );
}
