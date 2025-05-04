import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Otp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const email = location.state?.email || localStorage.getItem("email");

    const handleVerify = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/verify-otp", {
                otp,
            });

            if (response.data.success) {
                // Store email for later steps like payment
                localStorage.setItem("email", email);
                navigate("/checkout", { state: { email } });
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

export default Otp;
