import React from "react";
import toast from "react-hot-toast";

export function SuccessAlert(message) {
  return toast.success(message, {
    duration: 4000,
    position: "bottom-left",
  });
}

export function ErrorAlert(message) {
  return toast.error(message, {
    duration: 4000,
    position: "bottom-left",
  });
}

export function LoadingAlert(message) {
  return toast.loading(message, {
    duration: 4000,
    position: "bottom-left",
  });
}

export function DismissAlert(id) {
  toast.dismiss(id);
}
