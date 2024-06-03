import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/landing";
import { Signin } from "./pages/signin/signin";
import { Signup } from "./pages/signup/singup";
import { Toaster } from "react-hot-toast";
import { ForgotPassword } from "./pages/forgotpwd/forgotPassword";
import { ResetPassword } from "./pages/forgotpwd/resetPassword";
import { Profile } from "./pages/dashboard/dashboard";
import { NotFound } from "./global/404";
import { SearchResults } from "./pages/search/results";

function App() {
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
        <Route path="/search" element={<SearchResults />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
