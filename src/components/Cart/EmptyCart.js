import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ButtonContainer } from "../Button";
import styled from "styled-components";
import { ProductContext } from "../../context";

export default function EmptyCart() {
  const { isLoggedIn } = useContext(ProductContext);

  return (
    <EmptyCartWrapper>
      <CartIcon>
        <span role="img" aria-label="Shopping Cart">
          🛒
        </span>
      </CartIcon>
      <h1>Your cart is empty</h1>
      {!isLoggedIn ? (
        <>
          <p>You must be logged in to view your cart.</p>
          <Link to="/login">
            <ButtonContainer className="mt-3 py-2 px-4 fs-7">
              Login
            </ButtonContainer>
          </Link>
        </>
      ) : (
        <>
          <p>Add some products to your cart to get started!</p>
          <Link to="/">
            <ButtonContainer className="mt-3 py-2 px-4 fs-7">
              Back to Shopping
            </ButtonContainer>
          </Link>
        </>
      )}
    </EmptyCartWrapper>
  );
}

const EmptyCartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 70vh;
  padding: 2rem 1rem;
  background: #f5f5f5;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--mainBlue);
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: #555;
    margin-bottom: 1.5rem;
  }
`;

const CartIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1rem;
  color: var(--mainBlue);
`;
