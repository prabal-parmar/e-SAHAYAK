import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./Components/Home.jsx";
import Navbar from "./Components/navbar.jsx";
import About from "./Routes/About.jsx";
import Login from "./Routes/Login.jsx";
import ComplaintBox from "./Routes/ComplaintBox.jsx";
import Workers from "./Routes/Workers.jsx";
import Employer from "./Routes/Employer.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/workers" element={<Workers />} />
              <Route path="/employers" element={<Employer />} />
              <Route path="/complaint" element={<ComplaintBox />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
