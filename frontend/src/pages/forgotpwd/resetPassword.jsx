import React, { useEffect, useState } from "react";
import { ErrorAlert, SuccessAlert } from "../../global/alerts";
import Logo from "../../components/logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckIcon from "../../components/checkIcon";
import WarningIcon from "../../components/warningIcon";

export function ResetPassword() {
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.email) {
      navigate("/forgotpassword");
    }
  }, []);

  const handlePasswordStrength = (e) => {
    const password = e.target.value;
    let score = "";
    if (password.length > 12) score += "M";
    if (password.match(/[a-z]/)) score += "L";
    if (password.match(/[A-Z]/)) score += "U";
    if (password.match(/\d+/)) score += "N";
    if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) score += "S";
    if (password.length === 0) score = "";
    setPasswordStrength(score);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return ErrorAlert("Passwords do not match");
    }
    if (passwordStrength.length !== 5) {
      return ErrorAlert("Password does not meet the requirements");
    }

    setLoading(true);

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
            confirmPassword,
            email: state.email,
          }),
        }
      );

      const data = await response.json();

      if (response.error) {
        setLoading(false);
        return ErrorAlert(data.message);
      } else {
        SuccessAlert("Password changed successfully. Please login.");
        setPasswordStrength("");
        navigate("/signin");
      }
    } catch (error) {
      setLoading(false);
      return ErrorAlert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-gray-100 px-4 py-12">
      <div
        className="flex items-center gap-2"
        onClick={() => (location.href = "/")}
      >
        <Logo className="h-6 w-6" />
        <span className="text-lg font-semibold">Shopmitra</span>
      </div>
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
            Reset Password
          </h2>
        </div>
        <form
          onSubmit={handleChangePassword}
          className="space-y-6"
          method="POST"
        >
          <div>
            <label className="block text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="mt-1">
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your new password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  handlePasswordStrength(e);
                }}
                required={true}
                value={password}
              />
            </div>
          </div>
          <ul
            className={`text-sm text-gray-500 space-y-2 list-outside ${
              passwordStrength === "" && "hidden"
            }`}
          >
            <li className="flex items-center">
              {passwordStrength.includes("L") ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
              ) : (
                <WarningIcon className="h-4 w-4 text-red-500" />
              )}
              <span className="ml-2">At least one lowercase letter</span>
            </li>
            <li className="flex items-center">
              {passwordStrength.includes("U") ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
              ) : (
                <WarningIcon className="h-4 w-4 text-red-500" />
              )}
              <span className="ml-2">At least one uppercase letter</span>
            </li>
            <li className="flex items-center">
              {passwordStrength.includes("N") ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
              ) : (
                <WarningIcon className="h-4 w-4 text-red-500" />
              )}
              <span className="ml-2">At least one number</span>
            </li>
            <li className="flex items-center">
              {passwordStrength.includes("S") ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
              ) : (
                <WarningIcon className="h-4 w-4 text-red-500" />
              )}
              <span className="ml-2">At least one special character</span>
            </li>
            <li className="flex items-center">
              {passwordStrength.includes("M") ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
              ) : (
                <WarningIcon className="h-4 w-4 text-red-500" />
              )}
              <span className="ml-2">At least 12 characters</span>
            </li>
          </ul>
          <div>
            <label className="block text-gray-700" htmlFor="confirmPassword">
              Confirm password
            </label>
            <div className="mt-1">
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your new password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                value={confirmPassword}
                required={true}
              />
            </div>
          </div>
          <div>
            <button
              className={`group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading && "cursor-not-allowed opacity-50"
              }`}
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                "Change password"
              )}
            </button>
          </div>
        </form>
        <div>
          <p className="text-sm text-center text-gray-600">
            Remember your password?{" "}
            <Link
              to="/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
