import React from "react";
import Logo from "../components/logo";

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-gray-800">Shopmitra</h1>
        </div>
        <h2 className="text-5xl font-extrabold text-gray-800 mt-6">404</h2>
        <p className="text-gray-600 text-base mt-2">Page not found</p>
        <p className="text-gray-600 text-sm mt-2">
          Sorry, we couldn’t find the page you’re looking for. Double-check the
          URL or return to the homepage.
        </p>
        <div className="flex mt-6 space-x-4">
          <button
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => (window.location.href = "/")}
          >
            Go to Homepage
          </button>
          <button
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
