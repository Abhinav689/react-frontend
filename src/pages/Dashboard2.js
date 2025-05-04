import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Avatar,
  Box
} from "@mui/material";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users");
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      setMessage("Failed to fetch users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Registered Participants</h2>

      {message && (
        <div style={{ marginBottom: "20px", color: "#d9534f", fontWeight: "bold", textAlign: "center" }}>
          {message}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading users...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                width: "280px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                padding: "15px",
                backgroundColor: "#fff",
                cursor: "pointer"
              }}
              onClick={() => setSelectedUser(user)}
            >
              <h3 style={{ marginBottom: "5px" }}>{user.full_name}</h3>
              <p><strong>S.No:</strong> {user.id}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Status:</strong> {user.status}</p>
              <p><strong>Txn ID:</strong> {user.payment_id || "N/A"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Popup for user details */}
      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="md" fullWidth>
        {selectedUser && (
          <>
            <DialogTitle>{selectedUser.full_name}'s Profile</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Avatar
                    alt="Profile"
                    src={`http://127.0.0.1:8000/storage/${selectedUser.image}`}
                    sx={{ width: 150, height: 150 }}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
                  <Typography><strong>Phone:</strong> {selectedUser.phone}</Typography>
                  <Typography><strong>Status:</strong> {selectedUser.status}</Typography>
                  <Typography><strong>Txn ID:</strong> {selectedUser.payment_id}</Typography>
                  <Typography><strong>ID Type:</strong> {selectedUser.id_proof_type}</Typography>
                  <Typography><strong>ID Number:</strong> {selectedUser.id_proof_number}</Typography>
                  <Typography><strong>Address:</strong> {`${selectedUser.address}, ${selectedUser.city}, ${selectedUser.state}, ${selectedUser.country}`}</Typography>
                  <Typography><strong>Nationality:</strong> {selectedUser.nationality}</Typography>
                  <Typography><strong>DOB:</strong> {selectedUser.dob}</Typography>
                  <Typography><strong>Age:</strong> {selectedUser.age}</Typography>
                  <Typography><strong>Gender:</strong> {selectedUser.gender}</Typography>
                </Grid>
                {selectedUser.id_proof_upload && (
                  <Grid item xs={12}>
                    <Typography><strong>ID Proof Upload:</strong></Typography>
                    <img
                      src={`http://127.0.0.1:8000/storage/${selectedUser.id_proof_upload}`}
                      alt="ID Proof"
                      style={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
                    />
                  </Grid>
                )}
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
