import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/landing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
