import React from "react";
import styled from "styled-components";
import { ThemeConsumer } from "../context/ThemeContexts";

export default function CartTotals({ value }) {
  const { cartSubTotal, cartShipping, cartTotal, clearCart } = value;

  const handleSubmitOrder = () => {
    window.location.href = "/submit-order";
  };

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <TotalsWrapper theme={theme}>
          <div className="totals-container">
            <button className="btn clear-btn" onClick={clearCart}>
              Clear Cart
            </button>

            <div className="totals-info">
              <div className="totals-row">
                <span>Products Price:</span>
                <strong>{cartSubTotal} EGP</strong>
              </div>
              <div className="totals-row">
                <span>Shipping:</span>
                <strong>{cartShipping} EGP</strong>
              </div>
              <div className="totals-row total">
                <span>Total:</span>
                <strong>{cartTotal} EGP</strong>
              </div>
            </div>

            <button className="btn submit-btn" onClick={handleSubmitOrder}>
              Submit Order
            </button>
          </div>
        </TotalsWrapper>
      )}
    </ThemeConsumer>
  );
}
const TotalsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;

  .totals-container {
    background: ${(props) =>
      props.theme ? "#f8fafc" : "#fff"}; /* match app background */
    color: ${(props) =>
      props.theme ? "#1e293b" : "#222"}; /* match app text */
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 6px 15px rgba(30, 41, 59, 0.07); /* softer shadow */
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1.5rem;
    min-width: 250px;
  }

  .totals-info {
    width: 100%;
  }

  .totals-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 1rem;

    &.total {
      font-weight: bold;
      font-size: 1.15rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 0.5rem;
      margin-top: 0.5rem;
    }

    span,
    strong {
      color: ${(props) => (props.theme ? "#1e293b" : "#222")};
    }
  }

  .btn {
    width: 100%;
    padding: 0.5rem 1.2rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    font-size: 1rem;
    box-shadow: 0 2px 8px rgba(30, 41, 59, 0.07);
  }

  .clear-btn {
    background-color: #ef4444; /* Tailwind red-500 */
    color: #fff;

    &:hover {
      background-color: #b91c1c; /* Tailwind red-700 */
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);
    }
  }

  .submit-btn {
    background-color: #2563eb; /* Tailwind blue-600 */
    color: #fff;

    &:hover {
      background-color: #1e40af; /* Tailwind blue-800 */
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
    }
  }

  @media (max-width: 768px) {
    .totals-container {
      width: 100%;
      align-items: stretch;
    }
  }
`;
