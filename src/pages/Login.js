import React, { useState } from "react";
import {
    Box, Button, TextField, Typography, Alert, Link
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await axios.post("http://127.0.0.1:8000/api/login", formData);
            alert("Login successful!");
            navigate("/otp/login", { state: { email: formData.email } }); 
        } catch (err) {
            console.error(err);
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
            <Typography variant="h4" gutterBottom>Login</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={handleSubmit}>
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
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                    Login
                </Button>
            </form>
            <Box mt={2} textAlign="center">
                <Typography variant="body2">
                    Not registered?{" "}
                    <Link href="/register" underline="hover">
                        Sign up
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;
