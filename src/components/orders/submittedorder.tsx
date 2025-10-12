import React from "react";
import "./submittedorder.css";
import { useLocation } from "react-router-dom";

const SubmittedOrder: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="submitted-order-frame">
      <div className="submitted-order-container">
        <div className="success-icon">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="#e6f9ec"
              stroke="#34c759"
              strokeWidth="4"
            />
            <polyline
              points="30,55 45,70 70,40"
              fill="none"
              stroke="#34c759"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="success-title">Order Submitted !</h2>
        <p className="success-message">
          Your order has been placed.
          <br />
          <span className="order-id">
            Order ID: <strong>{orderId}</strong>
          </span>
          <br />
          Thank you for shopping with us.
        </p>
        <button className="success-btn" onClick={handleGoHome}>
          Go to Main Page
        </button>
      </div>
    </div>
  );
};

export default SubmittedOrder;
