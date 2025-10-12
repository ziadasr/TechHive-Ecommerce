import React from "react";
import styled from "styled-components";
import { ThemeConsumer } from "../context/ThemeContexts";

export default function CartItem({ item, value }) {
  const { increment, decrement, removeItem } = value;
  const total = item.product.price * item.quantity;

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <CartItemWrapper theme={theme}>
          <div className="product-img">
            <img src={item.product.imgurl} alt={item.product.title} />
          </div>

          <div className="product-title">{item.product.title}</div>

          <div className="product-price">{item.product.price} EGP</div>

          <div className="product-quantity">
            <button
              onClick={() => decrement(item.product.id)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button onClick={() => increment(item.product.id)}>+</button>
          </div>

          <div
            className="product-remove"
            onClick={() => removeItem(item.product.id)}
          >
            <i className="fas fa-trash"></i>
          </div>

          <div className="product-total">
            <strong>{total} EGP</strong>
          </div>
        </CartItemWrapper>
      )}
    </ThemeConsumer>
  );
}

const CartItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 80px 140px 50px 100px;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  color: ${(props) => (props.theme ? "#1a1a1aff" : "#1a1a1aff")};

  .product-img img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 0.25rem;
  }

  .product-title {
    font-weight: 500;
    text-align: left;
    padding-left: 0.5rem;
  }

  .product-price,
  .product-total {
    font-weight: 600;
  }

  .product-quantity {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;

    button {
      background: ${(props) => (props.theme ? "#f3f3f3" : "#007bff")};
      color: ${(props) => (props.theme ? "#000" : "#fff")};
      border: none;
      border-radius: 0.25rem;
      width: 28px;
      height: 28px;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.1);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    span {
      min-width: 20px;
      display: inline-block;
      text-align: center;
    }
  }

  .product-remove {
    cursor: pointer;
    color: ${(props) => (props.theme ? "#ff6b6b" : "#dc3545")};
    font-size: 1.1rem;

    &:hover {
      transform: scale(1.2);
      transition: transform 0.2s;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 60px 1fr 60px 100px 40px 80px;
    padding: 0.75rem 0;
  }

  @media (max-width: 576px) {
    grid-template-columns: 50px 1fr;
    grid-template-rows: repeat(3, auto);
    gap: 0.5rem;
    text-align: left;

    .product-price,
    .product-quantity,
    .product-remove,
    .product-total {
      grid-column: 2 / 3;
    }

    .product-quantity {
      justify-content: flex-start;
    }
  }
`;
