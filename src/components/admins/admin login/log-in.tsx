import React, { useState, ChangeEvent, FormEvent } from "react";
import "./Login.css";
import { loginAdmin } from "../../../apiRequests/adminReq";

const Login: React.FC = () => {
  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //=================================================================
  //e is the event triggered by form submission
  // fromevent is a generic type for form events in React means that the event is specifically from an HTML form element
  //HTMLFormElement is a built-in TypeScript type that represents a standard HTML <form> element
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      // Call the API request
      const result = await loginAdmin(form.email, form.password);
      // Check if result has a message property
      if (result && typeof result === "object" && "message" in result) {
        setMessage((result as { message: string }).message); // Show message from backend (success or error)

        window.location.href = "/admin/dashboard";
      } else {
        setMessage("Unexpected response from server.");
      }
    } catch (err) {
      if (typeof err === "object" && err !== null) {
        if ("message" in err) {
          setMessage((err as { message: string }).message);
        } else if ("error" in err) {
          setMessage((err as { error: string }).error);
        } else {
          setMessage("Unknown error occurred.");
        }
      } else {
        setMessage("Unknown error occurred.");
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>
        <div className="login-subtitle">Admin Log In</div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label className="login-label">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="login-input"
          />
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label className="login-label">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            className="login-input"
          />
        </div>

        <button type="submit" className="login-button">
          Log In
        </button>

        {message && <div className="login-message">{message}</div>}

        <div className="login-forgot"></div>
      </form>
    </div>
  );
};

export default Login;
