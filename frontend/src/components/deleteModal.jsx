import React, { useState } from "react";
import InfoIcon from "./infoIcon";
import Loader from "./loader";
import { ErrorAlert } from "../global/alerts";

export default function DeleteConfirmationModal(props) {
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleCancelDeletion = () => {
    props.setIsOpen(false);
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "user/delete",
      {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();

    setDeletingAccount(false);

    if (data.error) {
      ErrorAlert(data.error);
    } else {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-60 backdrop-blur ${
        props.isOpen || "hidden"
      }`}
    >
      {deletingAccount ? (
        <Loader />
      ) : (
        <div className="bg-white w-96 p-8 rounded-lg">
          <div className="grid grid-cols-12 gap-4 place-items-center">
            <div className="col-span-1">
              <InfoIcon />
            </div>
            <div className="col-span-11">
              <h1 className="text-xl font-bold">
                Are you sure you want to delete your account?
              </h1>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone. This will permanently delete your
            account.
          </p>
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-200 px-4 py-2 rounded-md"
              onClick={handleCancelDeletion}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={handleDeleteAccount}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
