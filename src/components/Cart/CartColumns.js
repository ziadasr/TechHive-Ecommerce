import React from "react";
import styled from "styled-components";
import { ThemeConsumer } from "../context/ThemeContexts";

export default function CartColumns() {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <ColumnsWrapper theme={theme}>
          <div className="columns-container">
            <div className="column">Products</div>
            <div className="column">Name</div>
            <div className="column">Price</div>
            <div className="column">Quantity</div>
            <div className="column">Remove</div>
            <div className="column">Total</div>
          </div>
        </ColumnsWrapper>
      )}
    </ThemeConsumer>
  );
}

const ColumnsWrapper = styled.div`
  display: none;
  @media (min-width: 992px) {
    display: block;
  }

  .columns-container {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    text-align: center;
    padding: 0.75rem 1rem;
    background: ${(props) => (props.theme ? "#767676ff" : "#f8f9fa")};
    color: ${(props) => (props.theme ? "#f3f3f3" : "#333")};
    text-transform: uppercase;
    font-weight: 600;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .column {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
