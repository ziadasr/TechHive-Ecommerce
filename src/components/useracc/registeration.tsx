import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { registerUser } from "../../apiRequests/usersReq";

const Registration: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    city: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    if (
      !form.name ||
      !form.dateOfBirth ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.phoneNumber ||
      !form.city
    ) {
      setIsError(true);
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      // === Call API ===
      const result = await registerUser({
        ...form,
        dateOfBirth: new Date(form.dateOfBirth),
      });

      // ✅ On success, show the success message and redirect
      setIsError(false);
      setMessage(result.message || "Registration successful! Redirecting...");
      setTimeout(
        () => navigate("/verify", { state: { email: form.email } }),
        1500
      );
    } catch (err: any) {
      // ❌ On failure, show the error message from the ApiError object
      setIsError(true);
      setMessage(err.message || "An unknown registration error occurred.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Create Account</h2>
        <div className="register-subtitle">Register to get started</div>
        {message && (
          <div className={`register-error ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="form-columns">
          <div className="form-column">
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="register-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                className="login-input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="login-label" htmlFor="dateOfBirth">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                className="login-input"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="login-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="login-input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="login-label" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                className="login-input"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-column">
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="login-label" htmlFor="city">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Enter your city"
                className="login-input"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}></div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="login-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="login-input"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <label className="login-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="login-input"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="login-button">
          Register
        </button>
        <div
          className="Register-link"
          style={{ marginTop: "10px", textAlign: "center" }}
        >
          <p>
            Already have an account? <a href="/login">Log In</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Registration;
