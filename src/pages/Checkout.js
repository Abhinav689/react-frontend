import React, { useState } from "react";
import {
  Box, Typography, Button, Alert, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [openGateway, setOpenGateway] = useState(false);
  const [error, setError] = useState("");

  const handleFakePayment = async () => {
    setOpenGateway(false);
    setLoading(true);
    setError("");

    const txnId = "FAKE_" + new Date().toISOString().replace(/[-T:.Z]/g, "");
    const payload = { txnId };

    console.log("Sending payment update to server:", payload);

    const isSuccess = Math.random() > 0.1;

    setTimeout(async () => {
      if (isSuccess) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/update-payment", payload, {
            headers: { 'Content-Type': 'application/json' }
          });

          if (res.data.success) {
            setStatus("Under Review");
            alert("Payment successful. Redirecting to dashboard.");
            navigate("/dashboard", { state: { txnId } });
          } else {
            setError(res.data.message || "Payment succeeded, but update failed.");
          }
        } catch (err) {
          console.error("Payment update error:", err);
          const serverMsg = err.response?.data?.message || "Server error during payment update.";
          setError(serverMsg);
        }
      } else {
        setError("Fake payment failed. Please try again.");
      }

      setLoading(false);
    }, 1500);
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
      <Typography variant="h6" color={status === "Pending" ? "error" : "primary"} mt={2}>
        Status: {status}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        onClick={() => setOpenGateway(true)}
        variant="contained"
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay ₹15,000"}
      </Button>

      <Dialog open={openGateway} onClose={() => setOpenGateway(false)}>
        <DialogTitle>Fake Payment Gateway</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm payment of ₹15,000 for registration?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGateway(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleFakePayment}
            variant="contained"
            color="success"
            disabled={loading}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Checkout;
