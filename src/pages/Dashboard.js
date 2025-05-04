import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent
} from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || localStorage.getItem("email");
  const txnId = location.state?.txnId || localStorage.getItem("txnId");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email || email === "null") {
      console.warn("No valid email found. Redirecting to login.");
      navigate("/login");
      return;
    }

    // Save email and txnId for future use
    localStorage.setItem("email", email);
    if (txnId) {
      localStorage.setItem("txnId", txnId);
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/user-info/${encodeURIComponent(email)}`);
        if (res.data.success) {
          setUser(res.data);
        } else {
          console.warn("User info not found.");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [email, txnId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("txnId");
    navigate("/login");
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 10, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 8 }}>
      <Card elevation={4} sx={{ borderRadius: 4, p: 3, bgcolor: "#f9f9f9" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome, <span style={{ color: "#1976d2" }}>
              {user?.full_name || "User"}
            </span>
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Payment Status:{" "}
            <span style={{ color: user?.status === "Under Review" ? "green" : "red" }}>
              {user?.status || "Incomplete"}
            </span>
          </Typography>

          {txnId && (
            <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic", color: "#444" }}>
              Transaction ID: <strong>{txnId}</strong>
            </Typography>
          )}

          {!user?.is_paid && (
            <Button
              onClick={() => navigate("/checkout", { state: { email } })}
              variant="contained"
              sx={{ mt: 4, bgcolor: "#2e7d32" }}
            >
              Pay Now
            </Button>
          )}

          <Button
            onClick={handleLogout}
            variant="outlined"
            color="error"
            sx={{ mt: 3, ml: 2 }}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
