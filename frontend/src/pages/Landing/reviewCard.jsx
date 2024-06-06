import React from "react";

export function ReviewCard(props) {
  const random = Math.floor(Math.random() * 10);
  return (
    <div className="flex flex-col w-full items-start bg-white border border-gray-200 rounded-lg shadow-lg mb-4 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <img
          src={`https://api.dicebear.com/8.x/notionists/svg?seed=${random}`}
          alt="avatar"
          className="rounded-full w-12 h-12"
        />
        <div>
          <div className="font-bold text-lg">{props?.customerName}</div>
          <div className="text-gray-500 text-sm">Verified Customer</div>
        </div>
      </div>
      <p className="text-gray-600 text-base italic">
        "{props?.customerReview}"
      </p>
    </div>
  );
}
