import React, { useEffect, useRef, useState } from "react";
import { ErrorAlert } from "../global/alerts";

export default function SearchBar(props) {
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState(
    props.searchQuery || ""
  );
  const [searchResults, setSearchResults] = useState([]);
  const timeoutId = useRef(null);

  const handleSearchInputChange = (e) => {
    if (e.target.value.length > 2) {
      setIsSearchResultVisible(true);
    } else {
      setIsSearchResultVisible(false);
    }
    setSearchInputValue(e.target.value);
    setSearchResults(null);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const fetchResults = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL +
            `products/search?q=${searchInputValue}&page=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
            signal: abortController.signal,
          }
        );
        const data = await response.json();
        if (data.error) {
          ErrorAlert(data.error);
          return;
        }
        setSearchResults(data.products);
      } catch (error) {
        if (error.name === "AbortError") return;
        ErrorAlert("An error occurred while fetching search results");
      }
    };
    if (searchInputValue && searchInputValue.length > 2) {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(fetchResults, 1000);
    }
    return () => abortController.abort();
  }, [searchInputValue]);

  const handleSearchResultsVisibility = () => {
    setIsSearchResultVisible(false);
  };

  return (
    <div className="flex w-full flex-col relative">
      <div className="flex w-full items-center relative">
        <input
          type="text"
          placeholder="Enter three or more characters to search"
          onChange={handleSearchInputChange}
          onFocus={handleSearchInputChange}
          value={searchInputValue}
          name="searchInput"
          className={`w-full lg:min-w-[42rem] h-10 text-black border border-black px-2 pr-[48px] focus:outline-none duration-300 ${
            isSearchResultVisible || "rounded-lg"
          }`}
        />
        <div
          className={`flex items-center justify-center bg-[#febd68] border border-t-black border-b-black border-r-black absolute right-0 h-full w-[45px] duration-300 text-md font-semibold hover:cursor-pointer ${
            isSearchResultVisible || "rounded-r-lg"
          }`}
          onClick={() => {
            if (searchInputValue && searchInputValue.length > 2) {
              setIsSearchResultVisible(true);
              if (searchResults && searchResults.length > 0) {
                location.href = "/results?q=" + searchInputValue;
              }
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>
      {isSearchResultVisible && (
        <div className="absolute top-10 bg-white border-b border-l border-r border-black w-full transition ease-in-out z-50 max-h-96 overflow-auto">
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div
                key={result._id}
                onClick={() => {
                  location.href = "/product/" + result._id;
                  console.log("yes");
                }}
                className="flex items-center gap-2 hover:cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              >
                <img
                  src={result.imgUrl}
                  alt={result.name}
                  className="w-8 h-8 object-contain rounded-md"
                />
                <span className="text-sm text-gray-800">{result.title}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 hover:cursor-pointer hover:bg-gray-100 p-2 rounded-md">
              <span className="text-sm text-gray-800">
                {searchResults ? "No results found" : "Loading..."}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
