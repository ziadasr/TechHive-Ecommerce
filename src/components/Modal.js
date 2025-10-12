import React, { Component } from "react";
import styled, { keyframes } from "styled-components";
import { ProductConsumer } from "../context";
import { ButtonContainer } from "./Button";
import { Link } from "react-router-dom";
import { ThemeConsumer } from "./context/ThemeContexts";

const fadeIn = keyframes`
  from {opacity: 0; transform: translateY(-20px);}
  to {opacity: 1; transform: translateY(0);}
`;

export default class Modal extends Component {
  render() {
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <ProductConsumer>
            {(value) => {
              const { modalOpen, closeModal, modalProduct } = value;
              if (!modalOpen || !modalProduct) return null;

              const { imgurl, title, price } = modalProduct;

              return (
                <ModalOverlay>
                  <ModalContent
                    className={
                      theme ? "bg-dark text-light" : "bg-white text-dark"
                    }
                  >
                    <h5 className="mb-3 fs-6 text-center">
                      Item added to cart
                    </h5>
                    <img src={imgurl} alt={title} />
                    <h5 className="mt-2 fs-6 text-center">{title}</h5>
                    <h5 className="fs-6 text-center text-muted">
                      Price: {price} <span>EGP</span>
                    </h5>

                    {/* Buttons in a column */}
                    <div className="d-flex flex-column gap-2 mt-3">
                      <Link to="/">
                        <ButtonContainer
                          onClick={closeModal}
                          className="w-100 py-1 fs-7"
                        >
                          Continue Shopping
                        </ButtonContainer>
                      </Link>
                      <Link to="/cart">
                        <ButtonContainer
                          cart
                          onClick={closeModal}
                          className="w-100 py-1 fs-7"
                        >
                          Go to Cart
                        </ButtonContainer>
                      </Link>
                    </div>
                  </ModalContent>
                </ModalOverlay>
              );
            }}
          </ProductConsumer>
        )}
      </ThemeConsumer>
    );
  }
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1050;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  max-width: 360px;
  width: 100%;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  animation: ${fadeIn} 0.25s ease-out;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  img {
    width: 100%;
    max-height: 280px;
    object-fit: contain;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  h5 {
    margin-bottom: 0.5rem;
  }

  .d-flex > * {
    width: 100%; /* ensures buttons are same width */
  }
`;
