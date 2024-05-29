import React from "react";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-7xl font-bold tracking-tight text-gray-900">404</h1>
        <p className="mt-4 text-lg font-medium text-gray-500">
          Oops, the page you're looking for doesn't exist.
        </p>
        <a
          className="mt-6 inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-900/90 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
          href="/"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
