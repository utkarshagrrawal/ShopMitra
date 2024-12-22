import React from "react";
import WarningIcon from "../../components/warningIcon";

export function FallbackPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <WarningIcon className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Oops, something went wrong!
        </h1>
        <p className="mt-4 text-muted-foreground">
          We're sorry, but an unexpected error has occurred on our end. Please
          try again later or contact our support team at{" "}
          <a href="tel:+916350555537" className="text-blue-600 underline">
            +91 63505 55537
          </a>{" "}
          or at{" "}
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
            className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
