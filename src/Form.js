import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, MenuItem, Grid, Card, CardContent,
  FormControl, FormLabel, RadioGroup, Radio, FormControlLabel
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Form.css"; // Custom CSS with background and styles

const RegisterForm = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState(null);

  const [formData, setFormData] = useState({
    phone: "", email: "", password: "", full_name: "", dob: "",
    age: "", gender: "", address: "", city: "", state: "", country: "India",
    pincode: "", nationality: "Indian", image: null, id_proof_type: "",
    id_proof_upload: null, id_proof_number: ""
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      if (name === "image") setImagePreview(URL.createObjectURL(file));
      if (name === "id_proof_upload") setIdProofPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });

      if (name === "dob") {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        setFormData(prev => ({ ...prev, age: age.toString() }));
      }
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
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Registration successful!", { position: "top-center" });
      localStorage.setItem("email", formData.email);
      localStorage.setItem("phone", formData.phone);

      setFormData({
        phone: "", email: "", password: "", full_name: "", dob: "",
        age: "", gender: "", address: "", city: "", state: "", country: "India",
        pincode: "", nationality: "Indian", image: null, id_proof_type: "",
        id_proof_upload: null, id_proof_number: ""
      });
      setImagePreview(null);
      setIdProofPreview(null);
      navigate("/otp");

    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      toast.error("Registration failed. Please check input values.", { position: "top-center" });
    }
  };

  return (
    <Box className="form-container">
      <Card elevation={4} className="register-card">
        <CardContent>
          <Typography variant="h4" gutterBottom>Registration</Typography>
          <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField name="phone" label="Phone Number" fullWidth required onChange={handleChange} /></Grid>
              <Grid item xs={12}><TextField name="email" type="email" label="Email" fullWidth required onChange={handleChange} /></Grid>
              <Grid item xs={12}><TextField name="password" type="password" label="Password" fullWidth required onChange={handleChange} /></Grid>
              <Grid item xs={12}><TextField name="full_name" label="Full Name" fullWidth required onChange={handleChange} /></Grid>
              <Grid item xs={12}><TextField name="dob" type="date" label="Date of Birth" fullWidth required onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12}><TextField name="age" label="Age" value={formData.age} fullWidth disabled /></Grid>
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
                    <FormControlLabel value="M" control={<Radio />} label="Male" />
                    <FormControlLabel value="F" control={<Radio />} label="Female" />
                    <FormControlLabel value="O" control={<Radio />} label="Other" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}><TextField name="address" label="Address" fullWidth required onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={4}><TextField name="city" label="City" fullWidth required onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={4}><TextField name="state" label="State" fullWidth required onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={4}><TextField name="country" label="Country" fullWidth required value={formData.country} onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField name="pincode" label="Pincode" fullWidth required onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="nationality" label="Nationality" fullWidth select value={formData.nationality} onChange={handleChange}>
                  <MenuItem value="Indian">Indian</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>

              {/* Profile + ID Section */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormLabel>Upload Profile Image</FormLabel>
                    <TextField
                      name="image"
                      type="file"
                      fullWidth
                      required
                      inputProps={{ accept: "image/png, image/jpeg" }}
                      onChange={handleChange}
                      sx={{ mt: 1 }}
                    />
                    {imagePreview && (
                      <Box mt={2}><img src={imagePreview} alt="Profile" className="image-preview" /></Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormLabel>ID Proof Type</FormLabel>
                    <TextField
                      name="id_proof_type"
                      select
                      fullWidth
                      required
                      value={formData.id_proof_type}
                      onChange={handleChange}
                      sx={{ mt: 1 }}
                    >
                      <MenuItem value="">Select ID Proof Type</MenuItem>
                      <MenuItem value="Aadhaar">Aadhaar</MenuItem>
                      <MenuItem value="Passport">Passport</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormLabel>Upload ID Proof</FormLabel>
                    <TextField
                      name="id_proof_upload"
                      type="file"
                      fullWidth
                      required
                      inputProps={{ accept: "image/png, image/jpeg" }}
                      onChange={handleChange}
                      sx={{ mt: 1 }}
                    />
                    {idProofPreview && (
                      <Box mt={2}><img src={idProofPreview} alt="ID Proof" className="id-preview" /></Box>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><TextField name="id_proof_number" label="ID Proof Number" fullWidth required onChange={handleChange} /></Grid>
            </Grid>

            <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth>Register</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterForm;
