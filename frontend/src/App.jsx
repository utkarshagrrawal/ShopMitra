import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/landing";
import { Signin } from "./pages/signin/signin";
import { Signup } from "./pages/signup/singup";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import { ForgotPassword } from "./pages/forgotpwd/forgotPassword";
import { ResetPassword } from "./pages/forgotpwd/resetPassword";
import { Profile } from "./pages/dashboard/dashboard";
import { NotFound } from "./global/404";
import { SearchResults } from "./pages/search/results";
import { ProductDetails } from "./pages/product/productDetails";
import { useEffect } from "react";
import { Cart } from "./pages/cart/cart";
import { CheckoutPage } from "./pages/checkout/checkoutPage";
import { PaymentSuccess } from "./pages/checkout/paymentSuccess";
import { PaymentFailed } from "./pages/checkout/paymentFailed";

function App() {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= 3) // Is toast index over limit?
      .forEach((t) => toast.remove(t.id));
  }, [toasts]);

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
        <Route path="/resetpassword" element={<ResetPassword />}></Route>
        <Route path="/dashboard/:section" element={<Profile />}></Route>
        <Route path="/results" element={<SearchResults />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/checkout" element={<CheckoutPage />}></Route>
        <Route path="/payment-success" element={<PaymentSuccess />}></Route>
        <Route path="/payment-failed" element={<PaymentFailed />}></Route>
        <Route path="/product/:id" element={<ProductDetails />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
