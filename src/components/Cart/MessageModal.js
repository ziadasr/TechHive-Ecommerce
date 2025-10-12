import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {opacity: 0; transform: translateY(-20px);}
  to {opacity: 1; transform: translateY(0);}
`;

const ModalBackground = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  background: white;
  padding: 1.5rem 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: ${fadeIn} 0.25s ease-out;
  max-width: 400px;
  width: 100%;
`;

const OkButton = styled.button`
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #0056b3;
  }
`;

export default function MessageModal({ open, message, onClose }) {
  if (!open) return null;
  return (
    <ModalBackground onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <OkButton onClick={onClose}>OK</OkButton>
      </ModalBox>
    </ModalBackground>
  );
}
