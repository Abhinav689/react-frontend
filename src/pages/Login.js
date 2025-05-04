import React, { useState } from "react";
import {
    Box, Button, TextField, Typography, Link, Card, CardContent
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./login.css"; // Import your external CSS

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://127.0.0.1:8000/api/login", formData);
            toast.success("Login successful!", { position: "top-right" });
            navigate("/otp/login", { state: { email: formData.email } });
        } catch (err) {
            toast.error("Invalid credentials. Please try again.", { position: "top-right" });
        }
    };

    return (
        <Box className="login-container">
            <Card className="login-card" elevation={6}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2, borderRadius: 2 }}
                        >
                            Login
                        </Button>
                    </Box>
                    <Box mt={3} textAlign="center">
                        <Typography variant="body2">
                            Not registered?{" "}
                            <Link href="/register" underline="hover">
                                Sign up
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
