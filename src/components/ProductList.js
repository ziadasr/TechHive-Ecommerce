import React from "react";
import Product from "./Product";
import Title from "./Title";
import FilterSidebar from "./FilterSidebar";
import { ProductConsumer } from "../context";
import { ThemeConsumer } from "./context/ThemeContexts";

class ProductList extends React.Component {
  render() {
    const LIGHT_GRAY_BG = "#f7f7f7";
    const DARK_BG = "#1f2937";
    const ACCENT_BLUE = "#007aff";

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <ProductConsumer>
            {(value) => {
              const productsToShow =
                value.filteredProducts.length > 0
                  ? value.filteredProducts
                  : value.products;

              return (
                <div
                  className="py-4"
                  style={{
                    backgroundColor: theme ? DARK_BG : LIGHT_GRAY_BG,
                    minHeight: "100vh",
                  }}
                >
                  {/* NEW: Using container-fluid to stretch content, and added responsive side padding */}
                  <div className="container-fluid" style={{ padding: "0 3vw" }}>
                    {/* Title component styling */}
                    <div style={{ margin: "0 auto" }}>
                      <Title
                        className={theme ? "text-light" : "text-dark"}
                        name="our"
                        title="products"
                        style={{
                          marginBottom: "40px",
                          fontSize: "2rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "2px",
                          textAlign: "center",
                        }}
                      />
                    </div>

                    {/* Main Row: Sidebar and Products Grid */}
                    {/* NEW: Removed fixed max-width and used mx-auto for center alignment */}
                    <div
                      className="row"
                      style={{ margin: "0 auto", maxWidth: "1400px" }}
                    >
                      {/* Column 1: Filter Sidebar (Narrowest viable size) */}
                      <div
                        // Setting the narrowest column sizes: col-xl-2 (16.66%)
                        className="col-lg-2 col-xl-2 col-md-3 mb-4"
                        style={{
                          // Reduced paddingRight to make the content fit more tightly
                          paddingRight: "10px",
                          paddingLeft: "0",
                          paddingTop: "0",
                          position: "sticky",
                          top: "30px",
                          height: "fit-content",
                        }}
                      >
                        <FilterSidebar
                          setMinPrice={value.setMinPrice}
                          setMaxPrice={value.setMaxPrice}
                        />
                      </div>

                      {/* Column 2: Product List & Pagination (Widest possible) */}
                      <div className="col-lg-10 col-xl-10 col-md-9">
                        {productsToShow.length > 0 ? (
                          <>
                            {/* Product Grid */}
                            {/* Using mx-n2 to slightly reduce the gap between cards */}
                            <div className="row pt-4 mx-n2">
                              {productsToShow.map((product) => (
                                <Product key={product.id} product={product} />
                              ))}
                            </div>

                            {/* Pagination Logic */}
                            {value.totalPages > 1 && (
                              <div
                                className="pagination-container"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginTop: "4rem",
                                  marginBottom: "2rem",
                                }}
                              >
                                <div
                                  className="pagination"
                                  style={{
                                    background: theme ? "transparent" : "white",
                                    borderRadius: "12px",
                                    padding: "8px 16px",
                                    boxShadow: theme
                                      ? "none"
                                      : "0 3px 10px rgba(0,0,0,0.08)",
                                    display: "flex",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {Array.from(
                                    { length: value.totalPages },
                                    (_, i) => (
                                      <button
                                        key={i + 1}
                                        onClick={() => value.setPage(i + 1)}
                                        className={`btn pagination-circle-btn ${
                                          value.currentPage === i + 1
                                            ? "active"
                                            : ""
                                        }`}
                                        style={{
                                          borderRadius: "50%",
                                          fontWeight: 600,
                                          width: "38px",
                                          height: "38px",
                                          padding: "0",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          transition: "all 0.2s ease",
                                          lineHeight: 1,

                                          // Conditional Colors (Active State)
                                          background:
                                            value.currentPage === i + 1
                                              ? ACCENT_BLUE
                                              : "transparent",
                                          color:
                                            value.currentPage === i + 1
                                              ? "#fff"
                                              : theme
                                              ? "#fff"
                                              : "#444",
                                          border:
                                            value.currentPage === i + 1
                                              ? `1px solid ${ACCENT_BLUE}`
                                              : `1px solid ${
                                                  theme ? "#888" : "#e0e0e0"
                                                }`,
                                          boxShadow: "none",
                                        }}
                                      >
                                        {i + 1}
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          // Empty State
                          <div className="row">
                            <div className="col-10 mx-auto text-center text-title text-primary">
                              <p
                                style={{
                                  color: "#d9534f",
                                  fontSize: "1.2rem",
                                  fontWeight: 600,
                                }}
                              >
                                Sorry, no results found!
                              </p>
                              <p style={{ color: theme ? "white" : "#777" }}>
                                Please check the spelling or try searching for
                                something else.
                              </p>
                            </div>
                          </div>
                        )}
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

export default ProductList;
// import React from "react";
// import Product from "./Product";
// import Title from "./Title";
// import FilterSidebar from "./FilterSidebar";
// import { ProductConsumer } from "../context";
// import { ThemeConsumer } from "./context/ThemeContexts";

// class ProductList extends React.Component {
//   render() {
//     return (
//       <ThemeConsumer>
//         {({ theme }) => (
//           <ProductConsumer>
//             {(value) => {
//               const productsToShow =
//                 value.filteredProducts.length > 0
//                   ? value.filteredProducts
//                   : value.products;

//               return (
//                 <div
//                   className={theme ? "py-3 bg-slate-900" : "py-3 bg-slate-200"}
//                 >
//                   <div className="container-fluid">
//                     <Title
//                       className={theme ? "text-light" : "text-dark"}
//                       name="our"
//                       title="products"
//                     />

//                     <div className="row px-3">
//                       {/* Column 1: Filter Sidebar (col-lg-2) */}
//                       <div
//                         className="col-lg-2 col-md-3 mb-4 pr-3"
//                         style={{
//                           paddingLeft: "0",
//                           paddingTop: "15px",
//                           paddingBottom: "0",
//                           // position: "sticky",
//                           top: "0px",
//                           height: "fit-content",
//                         }}
//                       >
//                         <FilterSidebar
//                           setMinPrice={value.setMinPrice}
//                           setMaxPrice={value.setMaxPrice}
//                         />
//                       </div>

//                       {/* Column 2: Product List & Pagination (col-lg-10) */}
//                       <div className="col-lg-10 col-md-9">
//                         {productsToShow.length > 0 ? (
//                           <>
//                             {/* Product Grid */}
//                             <div className="row">
//                               {productsToShow.map((product) => (
//                                 <Product key={product.id} product={product} />
//                               ))}
//                             </div>

//                             {/* Pagination Logic */}
//                             {value.totalPages > 1 && (
//                               <div
//                                 className="pagination-container"
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "center",
//                                   alignItems: "center",
//                                   marginTop: "2rem",
//                                 }}
//                               >
//                                 <div
//                                   className="pagination"
//                                   style={{
//                                     // Keeping the wrapper background clean and modern
//                                     background: theme
//                                       ? "rgba(255,255,255, 0.1)"
//                                       : "#f5f5f5",
//                                     borderRadius: "10px",
//                                     padding: "0.5rem 1rem",
//                                     boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
//                                     display: "flex",
//                                     gap: "0.4rem", // Tighter button spacing
//                                     flexWrap: "wrap",
//                                   }}
//                                 >
//                                   {Array.from(
//                                     { length: value.totalPages },
//                                     (_, i) => (
//                                       <button
//                                         key={i + 1}
//                                         onClick={() => value.setPage(i + 1)}
//                                         className={`btn ${
//                                           value.currentPage === i + 1
//                                             ? "btn-primary"
//                                             : "btn-outline-primary"
//                                         }`}
//                                         style={{
//                                           // 🌟 MODERN CIRCULAR BUTTON STYLING 🌟
//                                           borderRadius: "50%", // Fully rounded, circle button
//                                           fontWeight: 500,
//                                           width: "40px", // Fixed width
//                                           height: "40px", // Fixed height
//                                           padding: "0", // Remove default button padding
//                                           display: "flex",
//                                           justifyContent: "center",
//                                           alignItems: "center",
//                                           cursor: "pointer",
//                                           transition: "all 0.2s ease",

//                                           // Conditional Colors
//                                           background:
//                                             value.currentPage === i + 1
//                                               ? "#2563eb" // Active background blue
//                                               : theme
//                                               ? "transparent"
//                                               : "#fff", // Inactive background
//                                           color:
//                                             value.currentPage === i + 1
//                                               ? "#fff" // Active text white
//                                               : theme
//                                               ? "#fff"
//                                               : "#2563eb", // Inactive text (theme-aware)
//                                           border:
//                                             value.currentPage === i + 1
//                                               ? "none"
//                                               : `1px solid ${
//                                                   theme ? "#fff" : "#2563eb"
//                                                 }`, // Outline color
//                                           boxShadow: "none", // Clean shadow removed from button
//                                         }}
//                                       >
//                                         {i + 1}
//                                       </button>
//                                     )
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                           </>
//                         ) : (
//                           // Empty State
//                           <div className="row">
//                             <div className="col-10 mx-auto text-center text-title text-primary">
//                               <p style={{ color: "red" }}>
//                                 Sorry, no results found!
//                               </p>
//                               <p style={{ color: theme ? "white" : "black" }}>
//                                 Please check the spelling or try searching for
//                                 something else
//                               </p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             }}
//           </ProductConsumer>
//         )}
//       </ThemeConsumer>
//     );
//   }
// }

// export default ProductList;
