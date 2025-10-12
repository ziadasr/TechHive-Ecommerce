import React from "react";
import styled, { keyframes } from "styled-components";
import { ThemeConsumer } from "../context/ThemeContexts";
import { ButtonContainer } from "../Button";

const fadeIn = keyframes`
  from {opacity: 0; transform: translateY(-20px);}
  to {opacity: 1; transform: translateY(0);}
`;

export default function LoginRequiredModal({ show, onClose, onLogin }) {
  if (!show) return null;

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <ModalOverlay>
          <ModalContent
            className={theme ? "bg-dark text-light" : "bg-white text-dark"}
          >
            <h5 className="mb-3 fs-6 text-center">
              You need to log in to add products to your cart.
            </h5>

            {/* Buttons stacked */}
            <div className="d-flex flex-column gap-2 mt-3">
              <ButtonContainer onClick={onLogin} className="w-100 py-1 fs-7">
                Log In
              </ButtonContainer>
              <ButtonContainer
                cart
                onClick={onClose}
                className="w-100 py-1 fs-7"
              >
                Continue Browsing
              </ButtonContainer>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </ThemeConsumer>
  );
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
`;
