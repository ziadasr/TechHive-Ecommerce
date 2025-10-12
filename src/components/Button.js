import styled from "styled-components";

export const ButtonContainer = styled.button`
  text-transform: capitalize;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;

  background: transparent;
  border: 2px solid
    ${(props) => (props.cart ? "var(--mainYellow)" : "var(--lightBlue)")};
  border-radius: 0.75rem;

  color: ${(props) => (props.cart ? "var(--mainYellow)" : "var(--lightBlue)")};
  padding: 0.6rem 1.25rem;
  cursor: pointer;
  margin: 0.3rem 0.5rem;

  transition: all 0.3s ease;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.cart ? "var(--mainYellow)" : "var(--lightBlue)"};
    color: var(--mainWhite);
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: none;
  }
`;
