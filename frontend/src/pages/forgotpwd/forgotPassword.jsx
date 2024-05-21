import React, { useRef, useState } from "react";
import { ErrorAlert } from "../../global/alerts";
import emailjs from "@emailjs/browser";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const [emailSent, setEmailSent] = useState(false);
  const otpElementRef = useRef([]);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    if (/^[0-9]{1}$/.test(e.target.value) && index <= 5) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = e.target.value;
      setOtpDigits(newOtpDigits);
      index < 5 && otpElementRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index, digit) => {
    if (e.key === "Backspace" && index !== 0 && !digit) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index - 1] = "";
      setOtpDigits(newOtpDigits);
      otpElementRef.current[index - 1].focus();
    } else if (e.key === "Backspace" && index !== 0 && digit) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = "";
      setOtpDigits(newOtpDigits);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    if (/^[0-9]{6}$/.test(paste)) {
      const newOtpDigits = paste.split("");
      setOtpDigits(newOtpDigits);
      otpElementRef.current[5].focus();
    } else {
      ErrorAlert("Invalid OTP");
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();

    if (data.error) {
      setLoading(false);
      ErrorAlert(data.error);
    } else {
      const otpDigits = data.otp.split("");
      try {
        await emailjs.send(
          data.email_service_id,
          data.email_template_id,
          {
            to_email: email,
            first: otpDigits[0],
            second: otpDigits[1],
            third: otpDigits[2],
            fourth: otpDigits[3],
            fifth: otpDigits[4],
            sixth: otpDigits[5],
          },
          {
            publicKey: data.email_public_key,
            privateKey: data.email_private_key,
          }
        );
        setEmailSent(true);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        ErrorAlert(err.message);
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otp = otpDigits.join("");

    if (otp.length !== 6) {
      ErrorAlert("OTP must be 6 digits");
      return;
    }

    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "auth/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      }
    );
    const data = await response.json();

    setLoading(false);

    if (data.error) {
      ErrorAlert(data.error);
    } else {
      navigate("/resetpassword", { state: { email: email } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-gray-100 px-4 py-12">
      <img src={logo} className="w-20 h-20 mix-blend-normal rounded-full" />
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a otp to be able to
            reset your password.
          </p>
        </div>
        <form
          onSubmit={emailSent ? handleVerifyOtp : handleSendOtp}
          className="space-y-6"
          method="POST"
        >
          <div>
            <label className="block text-gray-700" htmlFor="email">
              Email address
            </label>
            <div className="mt-1">
              <input
                autoComplete="email"
                className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 duration-200 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 ${
                  emailSent ? "bg-gray-100" : ""
                }`}
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                readOnly={emailSent}
                required
                type="email"
              />
            </div>
          </div>
          {emailSent && (
            <div>
              <label className="block text-gray-700" htmlFor="otp">
                One Time Password (OTP)
              </label>
              <div className="mt-1 flex w-full object-contain gap-4">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    className="w-1/6 text-center appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    ref={(input) => (otpElementRef.current[index] = input)}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index, digit)}
                    onPaste={handlePaste}
                    placeholder="0"
                    required
                    type="text"
                  />
                ))}
              </div>
            </div>
          )}
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
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              ) : emailSent ? (
                "Verify OTP"
              ) : (
                "Send OTP"
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
