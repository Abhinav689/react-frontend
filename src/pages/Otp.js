import React, { useRef, useState } from "react";
import {
    Box, Typography, TextField, Button, Card, CardContent
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import './Otp.css';

const Otp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef([]);

    const email = location.state?.email || localStorage.getItem("email");

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return; // allow only 0-9

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move focus
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
        if (enteredOtp.length < 6) {
            toast.error("Please enter complete 6-digit OTP", { position: "top-right" });
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/verify-otp", {
                otp: enteredOtp,
            });

            if (response.data.success) {
                toast.success("OTP Verified Successfully", { position: "top-right" });
                localStorage.setItem("email", email);
                navigate("/checkout", { state: { email } });
            } else {
                toast.error("Invalid OTP", { position: "top-right" });
            }
        } catch (err) {
            console.error("OTP verification failed", err);
            toast.error("Verification failed. Please try again.", { position: "top-right" });
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                backgroundColor: "#f0f2f5"
            }}
        >
            <Card elevation={6} sx={{ borderRadius: 4, width: "100%", maxWidth: 400 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        OTP Verification
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 1,
                            mt: 3,
                            mb: 3,
                        }}
                    >
                        {otp.map((digit, index) => (
                            <TextField
                                key={index}
                                inputRef={(el) => (inputsRef.current[index] = el)}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                inputProps={{
                                    maxLength: 1,
                                    style: {
                                        textAlign: "center",
                                        fontSize: "20px",
                                        padding: "10px",
                                        width: "3rem",
                                    },
                                }}
                            />
                        ))}
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleVerify}
                        sx={{ mt: 2, borderRadius: 2 }}
                    >
                        Verify OTP
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Otp;
