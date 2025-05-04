import React, { useRef, useState } from "react";
import {
    Box, Typography, TextField, Button, Card, CardContent
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Otp2.css"; // Import your external CSS

const Otp2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef([]);

    const email = location.state?.email || localStorage.getItem("email");

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const enteredOtp = otp.join("");

        if (!email) {
            toast.error("User email not found. Please login again.", { position: "top-right" });
            return;
        }

        if (enteredOtp.length < 6) {
            toast.error("Please enter a valid 6-digit OTP", { position: "top-right" });
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/verify-otp", {
                otp: enteredOtp,
            });

            if (response.data.success) {
                toast.success("OTP Verified. Redirecting to dashboard...", { position: "top-right" });
                localStorage.setItem("email", email);
                navigate("/dashboard", { state: { email } });
            } else {
                toast.error("Invalid OTP. Please try again.", { position: "top-right" });
            }
        } catch (err) {
            console.error("OTP verification failed", err);
            toast.error("Server error. Please try again later.", { position: "top-right" });
        }
    };

    return (
        <Box className="otp-container">
            <Card className="otp-card" elevation={6}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        OTP Verification
                    </Typography>

                    <Box className="otp-inputs">
                        {otp.map((digit, index) => (
                            <TextField
                                key={index}
                                inputRef={(el) => (inputsRef.current[index] = el)}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                inputProps={{ maxLength: 1 }}
                            />
                        ))}
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleVerify}
                        sx={{ mt: 1, borderRadius: 2 }}
                    >
                        Verify OTP
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Otp2;
