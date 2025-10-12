import React, { Component } from "react";
import { ProductConsumer } from "../context";
import { Link } from "react-router-dom";
import { ButtonContainer } from "./Button";
import { ThemeConsumer } from "./context/ThemeContexts";

export default class Details extends Component {
  render() {
    // Define color constants for consistency
    const ACCENT_BLUE = "#007aff";
    // FIX: Re-define LIGHT_GRAY_BG to PURE WHITE for the details page container (Light Theme)
    const LIGHT_PAGE_BG = "#ffffff";
    const DARK_BG = "#1f2937";
    const TEXT_MUTED = "#777777";
    const BORDER_COLOR = "#e0e0e0";
    const BORDER_RADIUS = "8px";

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <ProductConsumer>
            {(value) => {
              // Check if detailProduct exists before destructuring
              if (!value.detailProduct) {
                return (
                  <div className="container py-5 text-center">
                    <h1>Loading...</h1>
                  </div>
                );
              }

              const { id, company, imgurl, info, price, title, inCart } =
                value.detailProduct;

              return (
                <div
                  className="container py-5 min-vh-100"
                  style={{
                    // CRITICAL FIX: Use pure white background for the details container
                    backgroundColor: theme ? DARK_BG : LIGHT_PAGE_BG,
                    maxWidth: "1200px",
                    margin: "0 auto",
                  }}
                >
                  {/* ---------------- 1. Global Product Title (H1) ---------------- */}
                  <div className="row mb-5">
                    <div className="col-12 text-center">
                      <h1
                        className={
                          theme ? "text-light fw-bold" : "text-dark fw-bold"
                        }
                        style={{
                          fontSize: "2.2rem",
                          lineHeight: "1.2",
                          marginBottom: "10px",
                        }}
                      >
                        {title}
                      </h1>
                    </div>
                  </div>

                  {/* ---------------- 2. Product Info Section (2 Columns) ---------------- */}
                  <div className="row align-items-start g-5">
                    {/* Left Column: Product Image (Larger) */}
                    <div className="col-12 col-md-6">
                      <div
                        className="product-img-wrapper p-4 shadow-lg"
                        style={{
                          // Confirmed: Image wrapper must be pure white
                          background: "white",
                          border: `1px solid ${BORDER_COLOR}`,
                          borderRadius: BORDER_RADIUS,
                          margin: "0 auto",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                          height: "400px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={imgurl}
                          className="img-fluid rounded"
                          alt="product"
                          style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </div>

                    {/* Right Column: Product Details */}
                    <div
                      className={
                        theme
                          ? "col-12 col-md-6 text-light"
                          : "col-12 col-md-6 text-dark"
                      }
                    >
                      {/* Secondary Info: Model and Made By (De-emphasized) */}
                      <h5
                        className="mb-2"
                        style={{ fontSize: "0.9rem", color: TEXT_MUTED }}
                      >
                        Model:{" "}
                        <span
                          className="fw-semibold text-capitalize"
                          style={{ color: theme ? "#ccc" : "#444" }}
                        >
                          {title}
                        </span>
                      </h5>
                      <h5
                        className="mb-4"
                        style={{ fontSize: "0.9rem", color: TEXT_MUTED }}
                      >
                        Made by:{" "}
                        <span
                          className="text-uppercase"
                          style={{ color: theme ? "#ccc" : "#444" }}
                        >
                          {company}
                        </span>
                      </h5>

                      {/* Price (Most Important Detail) */}
                      <h3
                        className="fw-bold mb-4"
                        style={{
                          color: ACCENT_BLUE,
                          fontSize: "2rem", // Large price size
                          letterSpacing: "0.5px",
                        }}
                      >
                        {price} <span style={{ fontSize: "0.6em" }}>EGP</span>
                      </h3>

                      {/* Description */}
                      <p
                        className="fw-bold text-secondary mb-3"
                        style={{
                          fontSize: "1rem",
                          color: theme ? "#ccc" : "#333",
                        }}
                      >
                        Product Information
                      </p>
                      <p
                        className="lead mb-5"
                        style={{
                          fontSize: "0.95rem",
                          lineHeight: "1.75",
                          color: theme ? "#ddd" : "#555",
                        }}
                      >
                        {info}
                      </p>

                      {/* Buttons */}
                      {/* Button spacing confirmed with style={{ gap: "20px" }} */}
                      <div className="d-flex mt-4" style={{ gap: "20px" }}>
                        {/* BACK TO PRODUCTS BUTTON (Secondary/Outlined) */}
                        <div className="flex-grow-1">
                          <Link to="/">
                            <ButtonContainer
                              className="w-100 py-2"
                              style={{
                                background: "transparent",
                                color: ACCENT_BLUE,
                                border: `1px solid ${ACCENT_BLUE}`,
                                borderRadius: BORDER_RADIUS,
                                fontWeight: 600,
                              }}
                            >
                              Back to Products
                            </ButtonContainer>
                          </Link>
                        </div>

                        {/* ADD TO CART BUTTON (Primary/Solid) */}
                        <div className="flex-grow-1">
                          <ButtonContainer
                            cart
                            disabled={inCart}
                            onClick={() => {
                              value.addToCart(id);
                              value.openModal(id);
                            }}
                            className="w-100 py-2"
                            style={{
                              background: ACCENT_BLUE,
                              color: "white",
                              border: `1px solid ${ACCENT_BLUE}`,
                              borderRadius: BORDER_RADIUS,
                              fontWeight: 600,
                              boxShadow: "0 4px 10px rgba(0, 122, 255, 0.2)",
                              opacity: inCart ? 0.7 : 1,
                            }}
                          >
                            {inCart ? "In Cart" : "Add to Cart"}
                          </ButtonContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </ProductConsumer>
        )}
      </ThemeConsumer>
    );
  }
}
