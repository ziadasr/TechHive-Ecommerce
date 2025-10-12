import React, { useState } from "react";
import "./forgetpassword.css";
import { Passwordreset } from "../../apiRequests/usersReq";
import { useNavigate } from "react-router-dom";

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email) {
      setIsError(true);
      setMessage("Please enter your email address.");
      return;
    }
    try {
      const response = await Passwordreset(email);
      setIsError(false);
      setMessage(
        response.message || "If the email exists, a reset code has been sent."
      );
      setTimeout(() => {
        navigate("/verify", { state: { email, from: "forgotpassword" } });
      }, 1500);
    } catch (err: any) {
      setIsError(true);
      if (err && typeof err === "object") {
        setMessage(err.error || err.message || "Verification failed.");
      } else {
        setMessage("Verification failed.");
      }
    }
  };

  return (
    <div className="forget-container">
      <form className="forget-form" onSubmit={handleSubmit}>
        <h2 className="forget-title">Forgot Password</h2>
        <div className="forget-subtitle">
          Enter your email to receive a password reset code.
        </div>
        {message && (
          <div className={`forget-message ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}
        <label className="forget-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="forget-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="forget-button">
          Send Reset Code
        </button>
      </form>
    </div>
  );
};

export default ForgetPassword;
