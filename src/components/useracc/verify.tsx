import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyResetCode, verifyUserEmail } from "../../apiRequests/usersReq";
import "./verify.css";

const Verify: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const from = location.state?.from || "register";
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    if (!code) {
      setIsError(true);
      setMessage("Please enter the verification code.");
      return;
    }

    try {
      if (from === "forgotpassword") {
        const result = await verifyResetCode(email, code);
        setMessage("Code verified successfully!");
        setIsError(false);

        setTimeout(() => {
          navigate("/newpassword", {
            state: { email, resetToken: result.resetToken },
          });
        }, 1200);
      } else {
        await verifyUserEmail(email, code);
        setMessage("Verification successful!");
        setIsError(false);

        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err: any) {
      setIsError(true);
      setMessage(err.error || "Verification failed.");
    }
  };

  return (
    <div className="verify-container">
      <form className="verify-form" onSubmit={handleSubmit}>
        <div className="verify-title">Verify Your Account</div>
        <div className="verify-subtitle">
          Enter the code sent to your email to continue.
        </div>
        {message && (
          <div className={`verify-message ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}
        <label className="verify-label" htmlFor="code">
          Verification Code
        </label>
        <input
          id="code"
          name="code"
          type="text"
          className="verify-input"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit" className="verify-button">
          Verify
        </button>
      </form>
    </div>
  );
};

export default Verify;
