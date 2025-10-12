import React, { Component } from "react";
import { ProductConsumer } from "../context";
import { ThemeConsumer } from "./context/ThemeContexts";
import axios from "../util/axios"; // Adjust path if needed

export default class FilterSidebar extends Component {
  state = {
    brands: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    // Logic to load initial brand and price range data
    const cachedBrands = sessionStorage.getItem("brands");
    if (cachedBrands) {
      const cachedMin = sessionStorage.getItem("minPrice");
      const cachedMax = sessionStorage.getItem("maxPrice");
      if (cachedMin && this.props.setMinPrice)
        this.props.setMinPrice(Number(cachedMin));
      if (cachedMax && this.props.setMaxPrice)
        this.props.setMaxPrice(Number(cachedMax));
      this.setState({ brands: JSON.parse(cachedBrands), loading: false });
    } else {
      axios
        .get("/getbrands")
        .then((res) => {
          this.setState({ brands: res.data.brands, loading: false });
          sessionStorage.setItem("brands", JSON.stringify(res.data.brands));
          sessionStorage.setItem("minPrice", res.data.minprice);
          sessionStorage.setItem("maxPrice", res.data.maxprice);
          if (this.props.setMinPrice) this.props.setMinPrice(res.data.minprice);
          if (this.props.setMaxPrice) this.props.setMaxPrice(res.data.maxprice);
        })
        .catch((err) => {
          this.setState({ error: "Failed to load brands", loading: false });
        });
    }
  }

  render() {
    // new styles for redesigned UI: Define color constants
    const ACCENT_BLUE = "#007aff";
    const LIGHT_BG_PRICE_RANGE = "#ffffff"; // White for Price Range Box
    const LIGHT_BG_FILTERS_BRAND = "#ffffff"; // White for Filters/Brand Box
    const BORDER_COLOR = "#e0e0e0";
    const BORDER_RADIUS = "12px"; // Larger radius for the main boxes

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <ProductConsumer>
            {(value) => {
              const {
                minPrice,
                maxPrice,
                setFilter,
                currentPrice,
                setCurrentPrice,
                applyFilters,
                resetFilters,
                sortBy,
                setSortBy,
              } = value;
              const { brands, loading, error } = this.state;

              return (
                <>
                  {" "}
                  {/* NEW: Using a fragment to contain the two separate filter boxes */}
                  {/* ------------------ 1. Price Range Filter Box ------------------ */}
                  <div
                    // new styles for redesigned UI: Price Range Container
                    className={
                      theme
                        ? "p-4 mb-4 bg-dark text-light rounded-xl shadow-lg"
                        : "p-4 mb-4 bg-white rounded-xl shadow-md"
                    }
                    style={{
                      background: theme ? "#2d3748" : LIGHT_BG_PRICE_RANGE,
                      border: theme
                        ? "1px solid #333"
                        : `1px solid ${BORDER_COLOR}`,
                      borderRadius: BORDER_RADIUS,
                      boxShadow: theme ? "none" : "0 2px 10px rgba(0,0,0,0.05)",
                      height: "fit-content",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6
                        className="mb-0 font-weight-bold text-uppercase"
                        style={{
                          fontSize: "0.9rem",
                          color: theme ? "white" : "#333",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Price Range
                      </h6>

                      {/* Button Group: Reset and Apply */}
                      <div className="d-flex align-items-center">
                        {/* RESET BUTTON (Ghost Style) */}
                        <button
                          className="btn btn-sm price-reset-btn"
                          style={{
                            color: "#777",
                            backgroundColor: "transparent",
                            border: "none",
                            borderRadius: "6px",
                            minWidth: "50px",
                            fontSize: "0.8rem",
                            padding: "4px 8px",
                            marginRight: "5px",
                            transition: "all 0.2s",
                          }}
                          onClick={() => {
                            if (resetFilters) resetFilters();
                          }}
                        >
                          Reset
                        </button>

                        {/* APPLY BUTTON (Primary Blue) */}
                        <button
                          className="btn btn-sm price-apply-btn"
                          style={{
                            color: "white",
                            backgroundColor: ACCENT_BLUE,
                            border: "none",
                            borderRadius: "6px",
                            minWidth: "50px",
                            fontSize: "0.8rem",
                            padding: "4px 10px",
                          }}
                          onClick={() => {
                            if (applyFilters) applyFilters();
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                    {/* Price Slider Value Display */}
                    <label
                      htmlFor="price-range"
                      className="form-label d-block text-left mb-1"
                    >
                      <span
                        className="text-dark font-weight-bold"
                        style={{
                          fontSize: "1.4rem",
                          color: theme ? "white" : "#333",
                        }}
                      >
                        {currentPrice}
                      </span>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: theme ? "#ddd" : "#777",
                          marginLeft: "5px",
                        }}
                      >
                        EGP
                      </span>
                    </label>

                    {/* Price Slider Input */}
                    <input
                      type="range"
                      className="form-range w-100"
                      id="price-range"
                      min={minPrice || 0}
                      max={maxPrice || 10000}
                      value={currentPrice || 0}
                      onChange={(e) => setCurrentPrice(e.target.value)}
                      style={{
                        height: "6px",
                        accentColor: ACCENT_BLUE,
                        WebkitAppearance: "none",
                        background: theme ? "#444" : "#e0e0e0",
                        borderRadius: "10px",
                      }}
                    />
                    {/* Min/Max labels */}
                    <div className="d-flex justify-content-between">
                      <small
                        className="text-muted"
                        style={{
                          fontSize: "0.8rem",
                          color: theme ? "#aaa" : "#777",
                        }}
                      >
                        {minPrice || 0} EGP
                      </small>
                      <small
                        className="text-muted"
                        style={{
                          fontSize: "0.8rem",
                          color: theme ? "#aaa" : "#777",
                        }}
                      >
                        {maxPrice || 10000} EGP
                      </small>
                    </div>
                  </div>
                  {/* ------------------ End of Price Range Filter Box ------------------ */}
                  {/* ------------------ 2. FILTERS & Brand Box ------------------ */}
                  <div
                    // new styles for redesigned UI: Filters/Brand Container
                    className={
                      theme
                        ? "p-4 mb-4 bg-dark text-light rounded-xl shadow-lg"
                        : "p-4 mb-4 bg-white rounded-xl shadow-md"
                    }
                    style={{
                      background: theme ? "#2d3748" : LIGHT_BG_FILTERS_BRAND,
                      border: theme
                        ? "1px solid #333"
                        : `1px solid ${BORDER_COLOR}`,
                      borderRadius: BORDER_RADIUS,
                      boxShadow: theme ? "none" : "0 2px 10px rgba(0,0,0,0.05)",
                      height: "fit-content",
                    }}
                  >
                    {/* Filters Title */}
                    <h6
                      className="mb-3 text-uppercase font-weight-bold"
                      style={{
                        fontSize: "0.9rem",
                        color: theme ? "white" : "#333",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Filters
                    </h6>

                    {/* Sort By Dropdown Section */}
                    <div className="mb-4">
                      <div className="d-flex flex-column mb-2">
                        <h6
                          className="mb-2 fw-bold"
                          style={{
                            fontSize: "0.85rem",
                            color: theme ? "#ddd" : "#555",
                          }}
                        >
                          Sort By
                        </h6>
                      </div>

                      <select
                        className={`form-select w-100 ${
                          theme
                            ? "bg-dark text-light border-secondary"
                            : "bg-white"
                        }`}
                        style={{
                          fontSize: "0.9rem",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: theme
                            ? "1px solid #444"
                            : "1px solid #d1d5db",
                          color: theme ? "white" : "#333",
                          backgroundColor: theme ? "#1f2937" : "white",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = `0 0 0 3px ${ACCENT_BLUE}33`)
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                      >
                        <option value="default">Default</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                      </select>
                    </div>

                    {/* Divider to separate Sort By from Brand */}
                    <div
                      style={{
                        height: "1px",
                        background: theme ? "#444" : "#f0f0f0",
                        margin: "20px 0",
                      }}
                    ></div>

                    {/* Brand Filter */}
                    <h6
                      className="mb-3 font-weight-bold text-uppercase"
                      style={{
                        fontSize: "0.9rem",
                        color: theme ? "white" : "#333",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Brand
                    </h6>
                    {loading && (
                      <div style={{ color: "#777" }}>Loading brands...</div>
                    )}
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <div
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        paddingRight: "10px",
                      }}
                    >
                      {brands.map((brand) => (
                        <div
                          className="form-check mb-2"
                          key={brand.id}
                          style={{ fontSize: "0.9rem" }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`brand-filter-${brand.name}`}
                            value={brand.name}
                            onChange={(e) =>
                              setFilter("brand", brand.id, e.target.checked)
                            }
                            style={{
                              accentColor: ACCENT_BLUE,
                              cursor: "pointer",
                              borderColor: theme ? "#555" : "#d1d5db",
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`brand-filter-${brand.name}`}
                            style={{
                              color: theme ? "#ddd" : "#555",
                              cursor: "pointer",
                            }}
                          >
                            {brand.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* ------------------ End of FILTERS & Brand Box ------------------ */}
                </>
              );
            }}
          </ProductConsumer>
        )}
      </ThemeConsumer>
    );
  }
}

// import React, { Component } from "react";
// import { ProductConsumer } from "../context";
// import { ThemeConsumer } from "./context/ThemeContexts";
// import axios from "../util/axios"; // Adjust path if needed

// export default class FilterSidebar extends Component {
//   state = {
//     brands: [],
//     loading: true,
//     error: null,
//   };

//   componentDidMount() {
//     // Logic to load initial brand and price range data
//     const cachedBrands = sessionStorage.getItem("brands");
//     if (cachedBrands) {
//       const cachedMin = sessionStorage.getItem("minPrice");
//       const cachedMax = sessionStorage.getItem("maxPrice");
//       if (cachedMin && this.props.setMinPrice)
//         this.props.setMinPrice(Number(cachedMin));
//       if (cachedMax && this.props.setMaxPrice)
//         this.props.setMaxPrice(Number(cachedMax));
//       this.setState({ brands: JSON.parse(cachedBrands), loading: false });
//     } else {
//       axios
//         .get("/getbrands")
//         .then((res) => {
//           this.setState({ brands: res.data.brands, loading: false });
//           sessionStorage.setItem("brands", JSON.stringify(res.data.brands));
//           sessionStorage.setItem("minPrice", res.data.minprice);
//           sessionStorage.setItem("maxPrice", res.data.maxprice);
//           if (this.props.setMinPrice) this.props.setMinPrice(res.data.minprice);
//           if (this.props.setMaxPrice) this.props.setMaxPrice(res.data.maxprice);
//         })
//         .catch((err) => {
//           this.setState({ error: "Failed to load brands", loading: false });
//         });
//     }
//   }

//   render() {
//     const ACCENT_BLUE = "#007aff";
//     const LIGHT_GRAY_BG = "#f5f5f5";

//     return (
//       <ThemeConsumer>
//         {({ theme }) => (
//           <ProductConsumer>
//             {(value) => {
//               const {
//                 minPrice,
//                 maxPrice,
//                 setFilter,
//                 currentPrice,
//                 setCurrentPrice,
//                 setMaxPrice,
//                 applyFilters,
//                 resetFilters,
//                 sortBy,
//                 setSortBy,
//               } = value;
//               const { brands, loading, error } = this.state;

//               return (
//                 <div
//                   // new styles for redesigned UI: Increased padding, soft shadows, rounded corners, and clean white background
//                   className={
//                     theme
//                       ? "p-4 mb-4 bg-dark text-light rounded-xl shadow-lg"
//                       : "p-4 mb-4 bg-white rounded-xl shadow-md"
//                   }
//                   style={{
//                     // new styles for redesigned UI: Soft border and professional font family
//                     border: theme ? "1px solid #333" : "1px solid #e0e0e0",
//                     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//                     height: 'fit-content' // Ensure sidebar doesn't stretch unnecessarily
//                   }}
//                 >
//                   {/* ------------------ Price Range Filter ------------------ */}
//                   <div className="mb-4 pb-4" style={{borderBottom: '1px solid #f0f0f0'}}>
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                       {/* new styles for redesigned UI: Title style */}
//                       <h6 className="mb-0 font-weight-bold text-uppercase" style={{fontSize: '0.9rem', color: '#333'}}>Price Range</h6>

//                       {/* Button Group: Reset and Apply */}
//                       <div className="d-flex align-items-center">
//                         {/* RESET BUTTON */}
//                         <button
//                           // new styles for redesigned UI: Reset button styling
//                           className="btn btn-sm" // Removed btn-outline-secondary
//                           style={{
//                             color: '#777', // Dark gray text
//                             backgroundColor: 'transparent',
//                             border: '1px solid #e0e0e0', // Light border
//                             borderRadius: '6px',
//                             minWidth: "60px",
//                             fontSize: "0.8rem",
//                             padding: "4px 10px",
//                             marginRight: "8px", // Spacing from Apply button
//                             transition: 'all 0.2s',
//                           }}
//                           onClick={() => {
//                             if (resetFilters) resetFilters();
//                           }}
//                         >
//                           Reset
//                         </button>

//                         {/* APPLY BUTTON */}
//                         <button
//                           // new styles for redesigned UI: Solid blue button styling
//                           className="btn btn-sm" // Removed btn-outline-primary
//                           style={{
//                             color: 'white',
//                             backgroundColor: ACCENT_BLUE, // Blue accent
//                             border: 'none',
//                             borderRadius: '6px',
//                             minWidth: "60px",
//                             fontSize: "0.8rem",
//                             padding: "4px 10px",
//                           }}
//                           onClick={() => {
//                             // if (setMaxPrice) setMaxPrice(Number(currentPrice)); // Keeping original logic commented out
//                             if (applyFilters) applyFilters();
//                           }}
//                         >
//                           Apply
//                         </button>
//                       </div>
//                     </div>

//                     {/* Price Slider Value Display */}
//                     <label htmlFor="price-range" className="form-label d-block text-center">
//                       <span className="text-dark font-weight-bold" style={{fontSize: '1.2rem'}}>
//                         {currentPrice} EGP
//                       </span>
//                     </label>

//                     {/* Price Slider Input */}
//                     <input
//                       type="range"
//                       // new styles for redesigned UI: Custom slider appearance
//                       className="form-range w-100"
//                       id="price-range"
//                       min={minPrice || 0}
//                       max={maxPrice || 10000}
//                       value={currentPrice || 0}
//                       onChange={(e) => setCurrentPrice(e.target.value)}
//                       style={{
//                         // Minimal styling for the track/thumb (may require custom CSS class injection outside this component for full control)
//                         height: '6px',
//                         accentColor: ACCENT_BLUE, // Modern browsers use accent-color
//                         WebkitAppearance: 'none', // For custom styling on webkit
//                         background: '#e0e0e0',
//                         borderRadius: '10px',
//                       }}
//                     />
//                     {/* Min/Max labels */}
//                     <div className="d-flex justify-content-between">
//                       <small className="text-muted" style={{fontSize: '0.8rem'}}>{minPrice || 0} EGP</small>
//                       <small className="text-muted" style={{fontSize: '0.8rem'}}>
//                         {maxPrice || 10000} EGP
//                       </small>
//                     </div>
//                   </div>
//                   {/* End of Price Filter */}

//                   {/* ------------------ Sort By Filter ------------------ */}
//                   <h6 className="mb-3 text-uppercase font-weight-bold" style={{fontSize: '0.9rem', color: '#333'}}>Filters</h6>

//                   {/* Sort By Dropdown Section */}
//                   <div
//                     // new styles for redesigned UI: Sort By section wrapper
//                     className="mb-4 p-3 rounded-lg" // Reduced padding, use p-3
//                     style={{
//                       backgroundColor: LIGHT_GRAY_BG, // Very light gray background for this section
//                       border: '1px solid #e0e0e0',
//                       transition: "all 0.3s ease-in-out",
//                     }}
//                   >
//                     <div className="d-flex flex-column mb-2">
//                       <h6
//                         className="mb-2 fw-bold"
//                         style={{
//                           fontSize: "0.85rem",
//                           color: '#555',
//                         }}
//                       >
//                         Sort By
//                       </h6>
//                     </div>

//                     <select
//                       // new styles for redesigned UI: Dropdown styling
//                       className={`form-select w-100 ${
//                         theme
//                           ? "bg-dark text-light border-secondary"
//                           : "bg-white"
//                       }`}
//                       style={{
//                         fontSize: "0.9rem",
//                         padding: "8px 10px", // Increased padding
//                         borderRadius: "6px",
//                         border: theme ? "1px solid #444" : "1px solid #d1d5db",
//                         transition: "border-color 0.2s, box-shadow 0.2s",
//                       }}
//                       value={sortBy}
//                       onChange={(e) => setSortBy(e.target.value)}
//                       onFocus={(e) =>
//                         (e.target.style.boxShadow = `0 0 0 3px ${ACCENT_BLUE}33`)
//                       }
//                       onBlur={(e) => (e.target.style.boxShadow = "none")}
//                     >
//                       <option value="default">Default</option>
//                       <option value="price_asc">Price: Low to High</option>
//                       <option value="price_desc">Price: High to Low</option>
//                     </select>
//                   </div>

//                   {/* ------------------ Brand Filter ------------------ */}
//                   <div className="mt-4 pt-4" style={{borderTop: '1px solid #f0f0f0'}}>
//                     <h6 className="mb-3 font-weight-bold text-uppercase" style={{fontSize: '0.9rem', color: '#333'}}>Brand</h6>
//                     {loading && <div style={{ color: "#777" }}>Loading brands...</div>}
//                     {error && <div style={{ color: "red" }}>{error}</div>}
//                     <div style={{maxHeight: '200px', overflowY: 'auto', paddingRight: '10px'}}>
//                     {brands.map((brand) => (
//                       <div className="form-check mb-2" key={brand.id} style={{fontSize: '0.9rem'}}>
//                         <input
//                           // new styles for redesigned UI: Custom checkbox color
//                           className="form-check-input"
//                           type="checkbox"
//                           id={`brand-filter-${brand.name}`}
//                           value={brand.name}
//                           onChange={(e) =>
//                             setFilter("brand", brand.id, e.target.checked)
//                           }
//                           style={{accentColor: ACCENT_BLUE, cursor: 'pointer'}} // Use accentColor for checkmark/background
//                         />
//                         <label
//                           className="form-check-label"
//                           htmlFor={`brand-filter-${brand.name}`}
//                           style={{color: '#555', cursor: 'pointer'}}
//                         >
//                           {brand.name}
//                         </label>
//                       </div>
//                     ))}
//                     </div>
//                   </div>
//                 </div>
//               );
//             }}
//           </ProductConsumer>
//         )}
//       </ThemeConsumer>
//     );
//   }
// }
