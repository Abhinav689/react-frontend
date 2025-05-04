import React, { useState } from "react";
import {
  Box, Typography, Button, Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError("");
    const email = localStorage.getItem("email");

    if (!email) {
      setError("Email not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post("http://127.0.0.1:8000/api/create-order", {
        amount: 15000,
      });

      const options = {
        key: data.key,
        amount: 15000 * 100,
        currency: "INR",
        name: "Event Registration",
        description: "Race Registration Fee",
        order_id: data.order_id,
        handler: async (response) => {
          try {
            const verification = await axios.post("http://127.0.0.1:8000/api/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              email: email,
            });

            if (verification.data.success) {
              alert("Payment successful!");
              navigate("/dashboard", {
                state: {
                  txnId: response.razorpay_payment_id,
                  email: email,
                },
              });
            } else {
              setError("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            setError("Payment was made but verification failed.");
          }
        },
        prefill: { email },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => setLoading(false));
      rzp.open();
    } catch (err) {
      console.error("Order creation failed:", err);
      setError("Unable to create order. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout Page</Typography>
      <Typography variant="h6" gutterBottom>
        Registration Fee: <strong>Rs. 15,000</strong>
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        "This fee only gives access to participate in the race subject to approval by the host and organizers of the race."
      </Typography>

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      )}

      <Button
        onClick={handleRazorpayPayment}
        variant="contained"
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay ₹15,000"}
      </Button>
    </Box>
  );
};

export default Checkout;
