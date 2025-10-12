import React, { useState } from "react";
import "./newpassword.css";
import { newpasswordReq } from "../../apiRequests/usersReq";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../util/axios";

//todo edit backend so that verifies inside the newpassword controller
const NewPassword: React.FC = () => {
  const location = useLocation();
  const initialEmail = location.state?.email;
  const [email] = useState(initialEmail); // email is now fixed
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!newPassword || !confirmNewPassword) {
      setMessage("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const result = await newpasswordReq(
        email,
        newPassword,
        confirmNewPassword
      );
      if ("message" in result) {
        setIsError(false);
        setMessage(result.message || "Password updated successfully!");
        apiClient.post("/clear-reset-token", {}, { withCredentials: true });
      }

      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setIsError(true);
      if (err && typeof err === "object") {
        setMessage(err.error || err.message || "Can not update password.");
      } else {
        setMessage("Server error.");
      }
    }
  };

  return (
    <div className="newpassword-container">
      <form className="newpassword-form" onSubmit={handleSubmit}>
        <h2 className="newpassword-title">Set New Password</h2>
        {message && (
          <div
            className={`newpassword-message ${isError ? "error" : "success"}`}
          >
            {message}
          </div>
        )}{" "}
        <label className="newpassword-label" htmlFor="newPassword">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          className="newpassword-input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <label className="newpassword-label" htmlFor="confirmNewPassword">
          Confirm New Password
        </label>
        <input
          id="confirmNewPassword"
          type="password"
          className="newpassword-input"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />
        <button type="submit" className="newpassword-button">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default NewPassword;
