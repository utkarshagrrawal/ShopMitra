import React, { useEffect, useRef, useState } from "react";

export function Select(props) {
  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    setAllCategories(props?.options);
  }, [props?.options]);

  const handleChange = (e) => {
    setCategory(e.target.value);
    const filteredCategories = props?.options?.filter((option) =>
      option.category_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    if (filteredCategories.length > 0) setAllCategories(filteredCategories);
    else setAllCategories([{ category_name: "No results found" }]);
  };

  useEffect(() => {
    const closeDropdownEvent = document.addEventListener("click", (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setDropdownVisible(false);
      }
    });
    return () => document.removeEventListener("click", closeDropdownEvent);
  }, []);

  return (
    <div
      className="flex flex-col w-full relative"
      ref={(reference) => (selectRef.current = reference)}
    >
      <input
        className="w-full h-10 px-3 text-base placeholder-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        type="text"
        name="category"
        placeholder={props?.placeholder || "Select"}
        onChange={handleChange}
        value={props?.selected?.category_name || category}
        onFocus={() => setDropdownVisible(true)}
      />
      <div
        className={`flex flex-col w-full mt-1 bg-white border rounded-lg shadow-md z-30 absolute top-10 max-h-48 overflow-scroll ${
          dropdownVisible ? "block" : "hidden"
        }`}
      >
        {allCategories.length > 0 &&
          allCategories.map((option, index) => (
            <div
              key={index}
              className={`flex items-center justify-between w-full px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                props?.selected === option.id && "bg-blue-100"
              }`}
              onClick={() => {
                props?.setSelected((prev) => ({
                  ...prev,
                  ["category"]: option.id,
                }));
                setDropdownVisible(false);
                setCategory(option.category_name);
              }}
            >
              <span>{option.category_name}</span>
              {props?.selected === option.id && (
                <span className="text-blue-500">✓</span>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
