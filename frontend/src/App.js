// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyOTP from "./components/VerifyOTP";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ConfirmPassword from "./components/ConfirmPassword";
import Dashboard from "./components/Dashboard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Meditation from "./components/Meditation/Meditation";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";

function App() {
  const isAuthenticated = useSelector((state) => state.authentication.value);
  return (
    <Router>
      <Box
        className="App"
        height="100vh"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <Navbar />
        <Box flex="1" position="relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/verify" element={<VerifyOTP />} /> */}
            <Route
              path="/verify"
              element={
                <ProtectedRoute
                  element={<VerifyOTP />}
                  isAuthenticated={isAuthenticated}
                />
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
            <Route
              path="/reset-password"
              element={
                <ProtectedRoute
                  element={<ResetPassword />}
                  isAuthenticated={isAuthenticated}
                />
              }
            />
            <Route path="/confirm-password" element={<ConfirmPassword />} />
            <Route path="/meditation" element={<Meditation />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
