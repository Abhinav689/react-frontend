import React, { useState } from "react";
import {
    Box, TextField, Button, Typography, MenuItem, Grid, Alert,
    FormControl, FormLabel, RadioGroup, Radio, FormControlLabel
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        phone: "", email: "", password: "", full_name: "", dob: "",
        age: "", gender: "", address: "", city: "", state: "", country: "India",
        pincode: "", nationality: "Indian", image: null, id_proof_type: "",
        id_proof_upload: null, id_proof_number: ""
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        if (name === "dob") {
            const age = new Date().getFullYear() - new Date(value).getFullYear();
            setFormData((prev) => ({ ...prev, age: age.toString() }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== "") {
                data.append(key, formData[key]);
            }
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/signup", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Registration successful!");

            localStorage.setItem("email", formData.email);
            localStorage.setItem("phone", formData.phone);
            
            setFormData({
                phone: "", email: "", password: "", full_name: "", dob: "",
                age: "", gender: "", address: "", city: "", state: "", country: "India",
                pincode: "", nationality: "Indian", image: null, id_proof_type: "",
                id_proof_upload: null, id_proof_number: ""
            });
            navigate("/otp");
        } catch (err) {
            console.error("Registration Error:", err.response?.data || err.message);
            setError("Registration failed. Please check input values.");
        }
    };

    return (
        <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
            <Typography variant="h4">Registration</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data" sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}><TextField name="phone" label="Phone Number" fullWidth required onChange={handleChange} /></Grid>
                    <Grid item xs={12}><TextField name="email" type="email" label="Email" fullWidth required onChange={handleChange} /></Grid>
                    <Grid item xs={12}><TextField name="password" type="password" label="Password" fullWidth required onChange={handleChange} /></Grid>
                    <Grid item xs={12}><TextField name="full_name" label="Full Name" fullWidth required onChange={handleChange} /></Grid>
                    <Grid item xs={12}><TextField name="dob" type="date" label="Date of Birth" fullWidth required onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
                    <Grid item xs={12}><TextField name="age" label="Age" value={formData.age} fullWidth disabled /></Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel>Gender</FormLabel>
                            <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
                                <FormControlLabel value="M" control={<Radio />} label="Male" />
                                <FormControlLabel value="F" control={<Radio />} label="Female" />
                                <FormControlLabel value="O" control={<Radio />} label="Other" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}><TextField name="address" label="Address" fullWidth required onChange={handleChange} /></Grid>
                    <Grid item xs={4}><TextField name="city" label="City" fullWidth required onChange={handleChange} /></Grid>
                    <Grid item xs={4}><TextField name="state" label="State" fullWidth required onChange={handleChange} /></Grid>
                    <Grid item xs={4}><TextField name="country" label="Country" fullWidth required value={formData.country} onChange={handleChange} /></Grid>
                    <Grid item xs={6}><TextField name="pincode" label="Pincode" fullWidth required onChange={handleChange} /></Grid>
                    <Grid item xs={6}><TextField name="nationality" label="Nationality" fullWidth select value={formData.nationality} onChange={handleChange}>
                        <MenuItem value="Indian">Indian</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField></Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="image"
                            type="file"
                            fullWidth
                            required
                            inputProps={{ accept: "image/png, image/jpeg" }}
                            onChange={handleChange}
                            value={undefined}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            name="id_proof_type"
                            label="ID Proof Type"
                            select
                            fullWidth
                            required
                            value={formData.id_proof_type}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Aadhaar">Aadhaar</MenuItem>
                            <MenuItem value="Passport">Passport</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            name="id_proof_upload"
                            type="file"
                            fullWidth
                            required
                            onChange={handleChange}
                            value={undefined}
                        />
                    </Grid>
                    <Grid item xs={12}><TextField name="id_proof_number" label="ID Proof Number" fullWidth required onChange={handleChange} /></Grid>
                </Grid>
                <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth>Register</Button>
            </Box>
        </Box>
    );
};

export default RegisterForm;
