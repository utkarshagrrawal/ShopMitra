import React, { useState } from "react";

export default function SearchBar() {
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");

  const handleSearchInputChange = (e) => {
    if (e.target.value === "") {
      setIsSearchResultVisible(false);
    } else {
      setIsSearchResultVisible(true);
    }
    setSearchInputValue(e.target.value);
  };

  const handleSearchResultsVisibility = () => {
    setIsSearchResultVisible(false);
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex items-center relative">
        <div>
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearchInputChange}
            onBlur={handleSearchResultsVisibility}
            onFocus={handleSearchInputChange}
            value={searchInputValue}
            name="searchInput"
            className={`w-[30rem] h-10 text-black border border-black px-2 pr-[48px] focus:outline-none duration-300 ${
              isSearchResultVisible || "rounded-lg"
            }`}
          />
        </div>
        <div
          className={`flex items-center justify-center bg-[#febd68] border border-t-black border-b-black border-r-black absolute right-0 h-full w-[45px] duration-300 text-md font-semibold ${
            isSearchResultVisible || "rounded-r-lg"
          }`}
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
        <div className="absolute top-10 bg-white border-b border-l border-r border-black w-full h-48 px-2 transition ease-in-out">
          <div className="">sdfsfs</div>
          <div className="">sdfsfs</div>
          <div className="">sdfsfs</div>
          <div className="">sdfsfs</div>
          <div className="">sdfsfs</div>
          <div className="">sdfsfs</div>
          <div className="">sdfsfs</div>
          <div className="">sdfsfs</div>
        </div>
      )}
    </div>
  );
}
