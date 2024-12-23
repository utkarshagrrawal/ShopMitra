import React from "react";
import WarningIcon from "../../components/warningIcon";

export function FallbackPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <WarningIcon className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Oops! Something went wrong.
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          We're sorry, but an unexpected error has occurred on our end. Please
          try again later or reach out to our support team.
        </p>
        <p className="mt-2 text-gray-600 text-base">
          Contact us at{" "}
          <a href="tel:+916350555537" className="text-blue-600 underline">
            +91 63505 55537
          </a>{" "}
          or via email at
          <a
            href="mailto:utkarshagrawal09jan@gmail.com"
            className="text-blue-600 underline"
          >
            utkarshagrawal09jan@gmail.com
          </a>{" "}
          if the issue persists.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center rounded-md bg-blue-600 text-white px-5 py-3 text-base font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
