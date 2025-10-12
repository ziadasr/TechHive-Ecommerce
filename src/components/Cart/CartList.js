import React from "react";
import CartItem from "./CartItem";
import styled from "styled-components";

export default function CartList({ value }) {
  const { cart } = value;

  return (
    <CartListWrapper>
      {cart.map((item) => (
        <CartItem key={item.product.id} item={item} value={value} />
      ))}
    </CartListWrapper>
  );
}

const CartListWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  border-radius: 1rem;
  padding: 1rem 0;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
`;
