import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/Register/RegisterForm";
import Home from "./components/Home/Home";
import LoginForm from "./components/Login/LoginForm";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}

export default App;
