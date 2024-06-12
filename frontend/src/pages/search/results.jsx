import React, { useEffect, useState } from "react";
import Header from "../../layouts/header";
import { useSearchParams } from "react-router-dom";
import { ErrorAlert } from "../../global/alerts";
import { Product } from "./product";
import { ChevronDownIcon } from "../../components/chevronDownIcon";
import Loader from "../../components/loader";

export function SearchResults() {
  const [searchQuery, setSearchQuery] = useSearchParams();
  const [searching, setSearching] = useState(true);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = searchQuery.get("q");
    if (!query) {
      location.href = "/";
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL +
            `products/search?q=${query}&page=${page}`,
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
          if (data.error === "Unauthorized") {
            localStorage.removeItem("token");
            window.location.href = "/signin";
          }
          return;
        }
        setLoading(false);
        if (page === 1) setSearching(false);
        setResults([...results, ...data.products]);
      } catch (error) {
        ErrorAlert("An error occurred while fetching search results");
        console.log(error);
      }
    };
    if (query) {
      fetchResults();
    }
  }, [page, searchQuery]);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (value === "p_lth") {
      setResults([...results].sort((a, b) => a.price - b.price));
    } else {
      setResults([...results].sort((a, b) => b.price - a.price));
    }
  };

  return !searching ? (
    <>
      <Header searchQuery={searchQuery.get("q")} />
      <div className="grid lg:grid-cols-[300px_1fr] gap-4 p-4">
        <div className="p-6 h-max bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Search Results for:{" "}
            <span className="font-bold">{searchQuery.get("q")}</span>
          </h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col">
              <span className="text-gray-600 text-sm mr-2">Sort by:</span>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="p_lth"
                  className="flex items-center text-gray-700 text-sm hover:cursor-pointer"
                >
                  <input
                    type="radio"
                    name="sort"
                    id="p_lth"
                    value="p_lth"
                    className="mr-1"
                    onClick={handleFilterChange}
                  />
                  Low to High
                </label>
                <label
                  htmlFor="p_htl"
                  className="flex items-center text-gray-700 text-sm hover:cursor-pointer"
                >
                  <input
                    type="radio"
                    name="sort"
                    id="p_htl"
                    value="p_htl"
                    className="mr-1"
                    onClick={handleFilterChange}
                  />
                  High to Low
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {results.map((product) => (
            <Product key={product._id} product={product} />
          ))}
          <button
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 border w-full flex justify-center items-center gap-2 border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-all duration-300 ${
              loading ? "bg-gray-300 cursor-not-allowed" : "bg-white"
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-gray-500"
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
              <>
                <span>Load More</span>
                <ChevronDownIcon />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  ) : (
    <Loader />
  );
}
