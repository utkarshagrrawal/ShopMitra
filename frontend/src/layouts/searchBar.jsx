import React, { useEffect, useState } from "react";
import { ErrorAlert } from "../global/alerts";

export default function SearchBar(props) {
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState(
    props.searchQuery || ""
  );
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchInputChange = (e) => {
    if (e.target.value === "") {
      setIsSearchResultVisible(false);
    } else if (e.target.value.length > 2) {
      setIsSearchResultVisible(true);
    }
    setSearchInputValue(e.target.value);
  };

  useEffect(() => {
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
          }
        );
        const data = await response.json();
        if (data.error) {
          ErrorAlert(data.error);
          return;
        }
        setSearchResults(data.products);
      } catch (error) {
        ErrorAlert("An error occurred while fetching search results");
        console.log(error);
      }
    };
    if (searchInputValue && searchInputValue.length > 2) {
      fetchResults();
    }
  }, [searchInputValue]);

  const handleSearchResultsVisibility = () => {
    setIsSearchResultVisible(false);
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex items-center relative">
        <div>
          <input
            type="text"
            placeholder="Enter three or more characters to search"
            onChange={handleSearchInputChange}
            onBlur={handleSearchResultsVisibility}
            onFocus={handleSearchInputChange}
            value={searchInputValue}
            name="searchInput"
            className={`w-96 h-10 text-black border border-black px-2 pr-[48px] focus:outline-none duration-300 ${
              isSearchResultVisible || "rounded-lg"
            }`}
          />
        </div>
        <div
          className={`flex items-center justify-center bg-[#febd68] border border-t-black border-b-black border-r-black absolute right-0 h-full w-[45px] duration-300 text-md font-semibold hover:cursor-pointer ${
            isSearchResultVisible || "rounded-r-lg"
          }`}
          onClick={() => {
            if (searchInputValue && searchInputValue.length > 2) {
              setIsSearchResultVisible(true);
              location.href = "/results?q=" + searchInputValue;
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
        <div className="absolute top-10 bg-white border-b border-l border-r border-black w-full transition ease-in-out z-50">
          {searchResults.map((result) => (
            <div
              key={result._id}
              onClick={() => (location.href = "/product/" + result._id)}
              className="flex items-center gap-2 hover:cursor-pointer hover:bg-gray-100 p-2 rounded-md"
            >
              <img
                src={result.imgUrl}
                alt={result.name}
                className="w-8 h-8 object-contain rounded-md"
              />
              <span className="text-sm text-gray-800">
                {result.title?.substring(0, 52)}...
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
