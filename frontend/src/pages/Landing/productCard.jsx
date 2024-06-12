import React from "react";

export function ProductCard(props) {
  return (
    <div
      className="flex flex-col items-center bg-white border border-gray-200 rounded-lg hover:cursor-pointer shadow-sm mb-2 p-6"
      onClick={props?.onClick}
    >
      <img
        src={props?.productImage}
        alt="product"
        width={200}
        height={200}
        className="aspect-square object-contain rounded-lg mb-4"
      />
      <div className="text-center">
        <h3 className="text-lg font-semibold">{props?.productName}</h3>
        <p className="text-gray-500 dark:text-gray-400">
          ${props?.productPrice}
        </p>
      </div>
    </div>
  );
}
