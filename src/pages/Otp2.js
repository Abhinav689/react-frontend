import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Otp2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const email = location.state?.email || localStorage.getItem("email");

    const handleVerify = async () => {
        if (!email) {
            setError("User email not found. Please login again.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/verify-otp", {
                otp,
            });

            if (response.data.success) {
                // ✅ Save email for future fetches
                localStorage.setItem("email", email);

                // ✅ Redirect to dashboard — which fetches status using this email
                navigate("/dashboard", { state: { email } });
            } else {
                setError("Invalid OTP");
            }
        } catch (err) {
            console.error("OTP Verification failed", err);
            setError("OTP verification failed.");
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
            <Typography variant="h5" gutterBottom>OTP Verification</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="normal"
            />
            <Button variant="contained" fullWidth onClick={handleVerify}>Verify OTP</Button>
        </Box>
    );
};

export default Otp2;
