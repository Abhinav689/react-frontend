import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";

// Page Components
import Form from "./Form";             // Registration Form Component
import Login from "./pages/Login";     // Login Page
import Otp from "./pages/Otp";         // OTP Page
import Checkout from "./pages/Checkout"; // Checkout Page
import Dashboard from "./pages/Dashboard"; // Dashboard
import Otp2 from "./pages/Otp2";       // OTP Verification Page
import Dashboard2 from "./pages/Dashboard2";

const App = () => {
    return (
        <Router>
            <CssBaseline />
            <Container maxWidth="md" sx={{ mt: 4 }}>
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
