import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Page Components
import Form from "./Form";                   // Registration Form
import Login from "./pages/Login";           // Login Page
import Otp from "./pages/Otp";               // OTP Page
import Otp2 from "./pages/Otp2";             // OTP Login Page
import Checkout from "./pages/Checkout";     // Checkout Page
import Dashboard from "./pages/Dashboard";   // Success Dashboard
import Dashboard2 from "./pages/Dashboard2"; // Failure Dashboard

const App = () => {
    return (
        <Router>
            <CssBaseline />
            <ToastContainer position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover />
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Form />} />
                    <Route path="/otp" element={<Otp />} />
                    <Route path="/otp/login" element={<Otp2 />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard2" element={<Dashboard2 />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
