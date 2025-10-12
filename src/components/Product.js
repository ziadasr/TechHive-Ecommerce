import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ProductConsumer } from "../context";
import PropTypes from "prop-types";
import { ThemeConsumer } from "./context/ThemeContexts";

export default class Product extends Component {
  render() {
    const { id, title, imgurl, inCart, price, count } = this.props.product;
    // Define the accent colors for inline use (since ThemeConsumer logic is here)
    // const ACCENT_BLUE = "#007aff";
    const SUCCESS_GREEN = "#145A32";
    const SUCCESS_LIGHT_BG = "#E8F8F5";
    const ERROR_RED = "#B30000";
    const ERROR_LIGHT_BG = "#FADBD8";

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <ProducrWrapper className="col-9 mx-auto col-md-6 col-lg-3 my-3">
            <div className={theme ? "card bg-dark" : "card"}>
              <ProductConsumer>
                {(value) => (
                  <div
                    className="img-container"
                    onClick={() => value.handleDetail(id)}
                  >
                    <Link to="/details">
                      <img
                        src={imgurl}
                        alt="product"
                        className="card-img-top"
                      />
                      {count > 0 && (
                        <span
                          style={{
                            color: SUCCESS_GREEN,
                            fontSize: "0.7rem",
                            fontWeight: "600",
                            position: "absolute",
                            bottom: "10px",
                            right: "10px",
                            background: SUCCESS_LIGHT_BG,
                            borderRadius: "16px",
                            padding: "4px 12px",
                            zIndex: 2,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          In Stock
                        </span>
                      )}
                      {count === 0 && (
                        <span
                          style={{
                            color: ERROR_RED,
                            fontSize: "0.7rem",
                            fontWeight: "600",
                            position: "absolute",
                            bottom: "10px",
                            right: "10px",
                            background: ERROR_LIGHT_BG,
                            borderRadius: "16px",
                            padding: "4px 12px",
                            zIndex: 2,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Out of Stock
                        </span>
                      )}
                    </Link>
                    <button
                      className="cart-btn"
                      disabled={inCart ? true : false}
                      onClick={() => {
                        value.addToCart(id);
                        value.openModal(id);
                      }}
                    >
                      {inCart ? (
                        <p className="text-capitalize mb-0" disabled>
                          {""}in Cart
                        </p>
                      ) : (
                        <i className="bi bi-cart" />
                      )}
                    </button>
                  </div>
                )}
              </ProductConsumer>
              <div
                className={
                  theme
                    ? "card-footer d-flex justify-content-between bg-dark"
                    : "card-footer d-flex flex-column align-items-start"
                }
              >
                <p className={theme ? "mb-1 text-light" : "mb-1"}>{title}</p>
                <div className="d-flex align-items-baseline">
                  <h5
                    className={theme ? "text-primary mb-0" : "text-blue mb-0"}
                  >
                    {price}
                  </h5>
                  <span className="mr-1 price-currency"> EGP</span>
                </div>
              </div>
            </div>
          </ProducrWrapper>
        )}
      </ThemeConsumer>
    );
  }
}
Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    imgurl: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
    // inCart: PropTypes.bool,
    count: PropTypes.number,
  }).isRequired,
};
// NEW STYLES FOR REDESIGNED UI
const ProducrWrapper = styled.div`
  .card {
    // new styles for redesigned UI
    border: 1px solid #e0e0e0; /* Subtle border */
    border-radius: 12px; /* Softer rounded corners */
    overflow: hidden;
    transition: all 0.3s ease;
    background: #ffffff;
    /* FINAL POLISH: Softer, more diffuse shadow for a premium floating look */
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    height: 100%;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  .card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); /* Slightly deeper shadow on hover */
  }

  /* -------------------------------------- */
  /*         Image Container Styling        */
  /* -------------------------------------- */

  .img-container {
    height: 200px;
    position: relative;
    overflow: hidden;
    border-bottom: none;
    flex-shrink: 0;
    padding: 20px;
  }

  .card-img-top {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.5s ease;
  }

  .img-container:hover .card-img-top {
    transform: scale(1.05);
  }

  /* -------------------------------------- */
  /*           Cart Button Styling          */
  /* -------------------------------------- */
  .cart-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    /* FINAL POLISH: Use solid blue background for better visual pop */
    background: #007aff;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 1rem;
    box-shadow: 0 4px 10px rgba(0, 122, 255, 0.4); /* Stronger shadow on the button itself */
    transform: scale(0);
    transition: transform 0.3s ease, background 0.2s ease;
    z-index: 5;
  }

  .img-container:hover .cart-btn {
    transform: scale(1);
  }

  .cart-btn:hover {
    background: #005bb5; /* Darker blue on hover */
  }

  .cart-btn[disabled] {
    background: #ccc !important;
    color: #777 !important;
    cursor: not-allowed;
    transform: scale(1) !important;
  }

  /* -------------------------------------- */
  /*         Card Footer Styling          */
  /* -------------------------------------- */

  .card-footer {
    background: white;
    padding: 16px 20px;
    border-top: none;
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
.card-footer p {
    // Product Name styles
    font-size: 1rem;
    font-weight: 400; 
    color: #333333; 
    margin: 0;
    margin-bottom: 4px;
    
    /* new styles for redesigned UI: Multi-line truncation */
    display: -webkit-box; /* Required for WebKit/Blink browsers */
    -webkit-line-clamp: 2; /* Limits text to exactly two lines */
    -webkit-box-orient: vertical; /* Sets the element as a vertical box */
    overflow: hidden; /* Hides content exceeding the lines */
    text-overflow: ellipsis; /* Appends ellipsis (...) at the end */
  }

  .card-footer h5 {
    /* FINAL POLISH: Ensure price is boldest element in footer */
    font-size: 1.3rem; /* Slightly larger size */
    font-weight: 700;
    color: #333333;
    margin: 0;
    display: inline-block;
  }

  .card-footer .price-currency {
    font-size: 0.8rem; /* Slightly smaller currency symbol */
    font-weight: 500;
    color: #777777;
    margin-left: 4px;
  }
`;

//!old ui code
//==========================================================================================
// import React, { Component } from "react";
// import styled from "styled-components";
// import { Link } from "react-router-dom";
// import { ProductConsumer } from "../context";
// import PropTypes from "prop-types";
// import { ThemeConsumer } from "./context/ThemeContexts";

// export default class Product extends Component {
//   render() {
//     const { id, title, imgurl, inCart, price, count } = this.props.product;
//     return (
//       <ThemeConsumer>
//         {({ theme }) => (
//           <ProducrWrapper className="col-9 mx-auto col-md-6 col-lg-3 my-3">
//             <div className={theme ? "card bg-dark" : "card"}>
//               <ProductConsumer>
//                 {(value) => (
//                   <div
//                     className="img-container p-5"
//                     onClick={() => value.handleDetail(id)}
//                   >
//                     <Link to="/details">
//                       <img
//                         src={imgurl}
//                         alt="product"
//                         className="card-img-top"
//                       />
//                       {count > 0 && (
//                         <span
//                           style={{
//                             color: "green",
//                             fontSize: "0.6rem",
//                             fontWeight: "bold",
//                             position: "absolute",
//                             top: "10px",
//                             left: "10px",
//                             background: "rgba(255,255,255,0.8)",
//                             borderRadius: "4px",
//                             padding: "2px 8px",
//                             zIndex: 2,
//                           }}
//                         >
//                           In Stock
//                         </span>
//                       )}
//                       {count === 0 && (
//                         <span
//                           style={{
//                             color: "red",
//                             fontSize: "0.6rem",
//                             fontWeight: "bold",
//                             position: "absolute",
//                             top: "10px",
//                             left: "10px",
//                             background: "rgba(255,255,255,0.8)",
//                             borderRadius: "4px",
//                             padding: "2px 8px",
//                             zIndex: 2,
//                           }}
//                         >
//                           Out of Stock
//                         </span>
//                       )}
//                     </Link>
//                     <button
//                       className="cart-btn"
//                       disabled={inCart ? true : false}
//                       onClick={() => {
//                         value.addToCart(id);
//                         value.openModal(id);
//                       }}
//                     >
//                       {inCart ? (
//                         <p className="text-capitalize mb-0" disabled>
//                           {""}in Cart
//                         </p>
//                       ) : (
//                         <i className="bi bi-cart" />
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </ProductConsumer>
//               <div
//                 className={
//                   theme
//                     ? "card-footer d-flex justify-content-between bg-dark"
//                     : "card-footer d-flex justify-content-between"
//                 }
//               >
//                 <p
//                   className={
//                     theme
//                       ? "align-self-center mb-0 text-light"
//                       : "align-self-center mb-0"
//                   }
//                 >
//                   {title}
//                 </p>
//                 <h5
//                   className={
//                     theme
//                       ? "text-primary font-italic mb-0"
//                       : "text-blue font-italic mb-0"
//                   }
//                 >
//                   {price}

//                   <span className="mr-1"> EGP</span>
//                 </h5>
//               </div>
//             </div>
//           </ProducrWrapper>
//         )}
//       </ThemeConsumer>
//     );
//   }
// }
// Product.propTypes = {
//   product: PropTypes.shape({
//     id: PropTypes.number,
//     imgurl: PropTypes.string,
//     title: PropTypes.string,
//     price: PropTypes.number,
//     // inCart: PropTypes.bool,
//     count: PropTypes.number,
//   }).isRequired,
// };
// const ProducrWrapper = styled.div`
//   .card {
//     border: none;
//     border-radius: 1rem;
//     overflow: hidden;
//     transition: all 0.3s ease;
//     background: var(white);
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
//     height: 100%; /* make card stretch equally inside grid */
//     display: flex;
//     flex-direction: column;
//   }

//   .img-container {
//     height: 300px;
//     position: relative;
//     overflow: hidden;
//     border-bottom: 1px solid rgba(0, 0, 0, 0.05);
//     flex-shrink: 0;
//   }

//   .card-img-top {
//     width: 100%;
//     height: 100%;
//     object-fit: contain;
//     transition: transform 0.5s ease;
//   }

//   .img-container:hover .card-img-top {
//     transform: scale(1.1);
//   }

//   .cart-btn {
//     position: absolute;
//     bottom: 1rem;
//     right: 1rem;
//     background: var(--lightBlue);
//     border: none;
//     border-radius: 50%;
//     width: 48px;
//     height: 48px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: var(--mainWhite);
//     font-size: 1.2rem;
//     box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
//     transform: scale(0);
//     transition: transform 0.3s ease, background 0.2s ease;
//   }

//   .img-container:hover .cart-btn {
//     transform: scale(1);
//   }

//   .cart-btn:hover {
//     background: var(--mainYellow);
//     color: var(--mainDark);
//   }

//   .card-footer {
//     backdrop-filter: blur(8px);
//     background: rgba(255, 255, 255, 0.6);
//     padding: 1rem;
//     border-top: none;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-top: auto; /* pushes footer to bottom */
//   }

//   .card-footer p {
//     font-size: 0.95rem;
//     font-weight: 500;
//     margin: 0;
//     color: var(--mainDark);
//     display: -webkit-box;
//     -webkit-line-clamp: 3;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }

//   .card-footer h5 {
//     font-size: 1.1rem;
//     font-weight: bold;
//     margin: 0;
//   }

//   .stock-badge {
//     position: absolute;
//     top: 12px;
//     left: 12px;
//     background: rgba(234, 225, 225, 0.85);
//     padding: 4px 12px;
//     border-radius: 999px;
//     font-size: 0.7rem;
//     font-weight: 600;
//     letter-spacing: 0.5px;
//     box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
//   }
// `;
