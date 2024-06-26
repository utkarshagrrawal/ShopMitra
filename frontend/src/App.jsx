import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/landing";
import { Signin } from "./pages/signin/signin";
import { Signup } from "./pages/signup/singup";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import { ForgotPassword } from "./pages/forgotpwd/forgotPassword";
import { ResetPassword } from "./pages/forgotpwd/resetPassword";
import { CustomerDashboard } from "./pages/dashboard/customerDashboard";
import { NotFound } from "./global/404";
import { SearchResults } from "./pages/search/results";
import { ProductDetails } from "./pages/product/productDetails";
import { useEffect } from "react";
import { Cart } from "./pages/cart/cart";
import { CheckoutPage } from "./pages/checkout/checkoutPage";
import { PaymentSuccess } from "./pages/checkout/paymentSuccess";
import { PaymentFailed } from "./pages/checkout/paymentFailed";
import { AboutPage } from "./pages/about";
import { LearnMorePage } from "./pages/learnMore";
import { Order } from "./pages/order";
import { SellerDashboard } from "./pages/dashboard/sellerDashboard";
import { SellerProductDetails } from "./pages/dashboard/sellerProductDetails";
import { SellerOrderDetails } from "./pages/dashboard/sellerOrderDetails";

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
        <Route
          path="/dashboard/:section"
          element={<CustomerDashboard />}
        ></Route>
        <Route
          path="/seller/dashboard/:section"
          element={<SellerDashboard />}
        ></Route>
        <Route path="/results" element={<SearchResults />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/checkout" element={<CheckoutPage />}></Route>
        <Route path="/payment-success" element={<PaymentSuccess />}></Route>
        <Route path="/payment-failed" element={<PaymentFailed />}></Route>
        <Route path="/product/:id" element={<ProductDetails />}></Route>
        <Route path="/about" element={<AboutPage />}></Route>
        <Route path="/order-tracking/:orderId" element={<Order />}></Route>
        <Route path="/learn-more" element={<LearnMorePage />}></Route>
        <Route
          path="/seller/product/:id"
          element={<SellerProductDetails />}
        ></Route>
        <Route
          path="/seller/order/:orderId"
          element={<SellerOrderDetails />}
        ></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
