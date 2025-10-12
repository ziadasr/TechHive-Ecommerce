import React, { useEffect, useContext } from "react";
import Title from "../Title";
import CartColumns from "./CartColumns";
import EmptyCart from "./EmptyCart";
import { ProductContext } from "../../context";
import CartList from "./CartList";
import CartTotals from "./CartTotals";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const value = useContext(ProductContext);
  const { cart, fetchCart, isLoggedIn } = value;

  useEffect(() => {
    // Fetch cart items only when /cart route is hit AND user is logged in
    //location is an object that represents the current URL
    //it has properties like pathname, search, hash, state
    //we use use location.pathname to get the current path
    if (location.pathname === "/cart" && isLoggedIn) {
      fetchCart();
    }
  }, [location.pathname, fetchCart, isLoggedIn]);
  return (
    <CartSection>
      {cart.length > 0 ? (
        <div className="cart-container">
          <Title name="your" title="cart" />
          <CartColumns />
          <CartList value={value} />
          <CartTotals value={value} history={navigate} />
        </div>
      ) : (
        <EmptyCart />
      )}
    </CartSection>
  );
};

export default Cart;

const CartSection = styled.section`
  min-height: 80vh;
  padding: 2rem 1rem;

  .cart-container {
    max-width: 1200px;
    margin: 0 auto;
    background: #fff;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    .cart-container {
      padding: 1rem;
    }
  }
`;
