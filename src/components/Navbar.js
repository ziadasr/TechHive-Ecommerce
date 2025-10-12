import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import logo from "../logo.png";
import { ButtonContainer } from "./Button"; // Assuming ButtonContainer is styled, we might need its styles too!
import { ThemeContext } from "./context/ThemeContexts";
import { ProductConsumer } from "../context";
import { FiShoppingCart } from "react-icons/fi";
import { FaUser, FaUserCheck } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BsSearch } from "react-icons/bs"; // New icon for search input

const Navbar = () => {
  useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // NEW: Base styling is white background/shadow from NavWrapper
    <NavWrapper>
      {/* Logo */}
      <Link to="/" className="logo">
        {/* Removed the separate <span> logo-text. Relying on the logo image itself for the brand name and icon. */}
        <img src={logo} alt="store" className="logo-img" />
      </Link>

      {/* Desktop Menu */}
      {!isMobile && (
        <div className="nav-content">
          <div className="nav-center">
            <ProductConsumer>
              {(value) => (
                <div className="search-container">
                  <BsSearch className="search-icon" />
                  <input
                    className="navbar-search"
                    placeholder="Search for products"
                    onChange={(e) => value.filterProducts(e.target.value)}
                  />
                </div>
              )}
            </ProductConsumer>
          </div>
          <div className="nav-right">
            <ProductConsumer>
              {(value) => (
                <>
                  <Link to="/cart" onClick={value.fetchCart}>
                    <ButtonContainer className="cart-btn-new">
                      <FiShoppingCart
                        size={20}
                        style={{ marginRight: "6px" }}
                      />
                      My Cart
                    </ButtonContainer>
                  </Link>
                  <Link
                    to={value.isLoggedIn ? "/profile" : "/login"}
                    className="user-icon-link"
                    title={value.isLoggedIn ? "Profile" : "Login"}
                  >
                    {value.isLoggedIn ? (
                      <FaUserCheck
                        size={24}
                        color="#7a7f7cff"
                        className="user-icon"
                      />
                    ) : (
                      <FaUser
                        size={24}
                        color="#7a7f7cff"
                        className="user-icon"
                      />
                    )}
                  </Link>
                </>
              )}
            </ProductConsumer>
          </div>
        </div>
      )}
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <AiOutlineClose size={28} color="#333" />
          ) : (
            <AiOutlineMenu size={28} color="#333" />
          )}
        </div>
      )}

      {/* Mobile Dropdown */}
      {isMobile && menuOpen && (
        <div className="mobile-menu bg-dark-mobile">
          <NavLink
            to="/"
            className="nav-link mobile-nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </NavLink>
          <ProductConsumer>
            {(value) => (
              <>
                {/* Search in Mobile Menu */}
                <div className="search-container mobile-search-container">
                  <BsSearch className="search-icon mobile-search-icon" />
                  <input
                    className="navbar-search"
                    placeholder="Search for products"
                    onChange={(e) => value.filterProducts(e.target.value)}
                  />
                </div>
                <Link
                  to="/cart"
                  onClick={() => {
                    value.fetchCart();
                    setMenuOpen(false);
                  }}
                >
                  <ButtonContainer className="cart-btn-new mobile-cart-btn">
                    <FiShoppingCart size={22} style={{ marginRight: "8px" }} />
                    My Cart
                  </ButtonContainer>
                </Link>
                <Link
                  to={value.isLoggedIn ? "/profile" : "/login"}
                  onClick={() => setMenuOpen(false)}
                  className="mobile-user-link"
                >
                  {value.isLoggedIn ? (
                    <FaUserCheck size={24} color="white" />
                  ) : (
                    <FaUser size={24} color="white" />
                  )}
                  <span className="ml-2 text-white">
                    {value.isLoggedIn ? "Profile" : "Login"}
                  </span>
                </Link>
              </>
            )}
          </ProductConsumer>
        </div>
      )}
    </NavWrapper>
  );
};

/* ---------- STYLES ---------- */
const NavWrapper = styled.nav`
  // new styles for redesigned UI
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Light shadow for clean separation */
  padding: 16px 30px; /* Increased vertical padding for taller, modern feel */
  position: sticky;
  top: 0;
  z-index: 10;
  max-height: 75px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }

  .logo-img {
    // new styles for redesigned UI: Increased logo size
    height: 140px; /* Increased size to better represent the full brand identity */
    width: 140px; /* Allow image to scale its width naturally */
    object-fit: contain;
  }

  /* Removed .logo-text styles */

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    gap: 2rem;
  }

  .nav-center {
    /* Center the search bar */
    flex-grow: 1;
    display: flex;
    justify-content: center;
    margin: 0 40px;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .search-container {
    // new styles for redesigned UI: Search bar wrapper
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 450px;
  }

  .search-icon {
    // new styles for redesigned UI: Search icon position
    position: absolute;
    left: 12px;
    color: #999;
    font-size: 1.1rem;
  }

  .navbar-search {
    // new styles for redesigned UI: Search bar styling
    padding: 10px 14px 10px 40px; /* Added left padding for icon */
    height: 44px;
    border-radius: 8px;
    font-size: 0.95rem;
    outline: none;
    background: #f7f7f7;
    color: #333;
    border: 1px solid #ddd;
    margin-left: 0;
    flex-grow: 1;
    transition: border-color 0.2s;
  }

  .navbar-search:focus {
    border-color: #007aff;
    background: white;
  }

  /* My Cart Button Styling (Uses cart-btn-new class) */
  .cart-btn-new {
    // new styles for redesigned UI: Solid blue button style
    background: #007aff !important; /* Blue accent color */
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 10px 16px !important;
    font-weight: 600;
    font-size: 0.9rem;
    transition: background 0.2s;
    height: 44px;
  }
  .cart-btn-new:hover {
    background: #005bb5 !important;
  }

  /* User Icon Styling */
  .user-icon-link {
    // new styles for redesigned UI: User icon wrapper
    margin-left: 0;
    padding: 8px;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .user-icon-link:hover {
    background: #f0f0f0;
  }

  .user-icon {
    // new styles for redesigned UI: User icon color
    color: #777777 !important;
    font-size: 22px;
  }

  .menu-toggle {
    cursor: pointer;
    padding: 5px;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    // Increased logo size for mobile too
    .logo-img {
      height: 36px;
    }

    .menu-toggle {
      color: #333;
    }

    .mobile-menu {
      background: #333;
      gap: 0;
      padding: 0;
      border-top: 1px solid #444;
    }

    .mobile-nav-link {
      color: white;
      padding: 12px 1rem;
      border-bottom: 1px solid #444;
      display: block;
    }

    .search-container {
      max-width: 90%;
      margin: 10px auto;
      background: white;
      border-radius: 8px;
    }

    .mobile-search-container .navbar-search {
      border: none;
      background: transparent;
    }

    .mobile-search-container .search-icon {
      color: #333;
    }

    .mobile-cart-btn {
      margin: 10px 1rem;
      width: calc(100% - 2rem);
      justify-content: center;
    }

    .mobile-user-link {
      display: flex;
      align-items: center;
      padding: 12px 1rem;
      color: white;
    }
  }
`;

export default Navbar;

//!old ui code
//==========================================================================================
// import React, { useState, useEffect, useContext } from "react";
// import { Link, NavLink } from "react-router-dom";
// import styled from "styled-components";
// import logo from "../logo.png";
// import { ButtonContainer } from "./Button";
// import { ThemeContext } from "./context/ThemeContexts";
// import { ProductConsumer } from "../context";
// import { FiShoppingCart } from "react-icons/fi";
// import { FaUser, FaUserCheck } from "react-icons/fa";
// import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

// const Navbar = () => {
//   const { theme } = useContext(ThemeContext);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <NavWrapper className="bg-slate-800">
//       {/* Logo */}
//       <Link to="/" className="logo">
//         <img src={logo} alt="store" />
//       </Link>

//       {/* Desktop Menu */}
//       {!isMobile && (
//         <div className="nav-content">
//           <div className="nav-left">
//             <NavLink to="/" className="nav-link">
//               Products
//             </NavLink>
//             <ProductConsumer>
//               {(value) => (
//                 <input
//                   className="navbar-search"
//                   placeholder="Search for products"
//                   onChange={(e) => value.filterProducts(e.target.value)}
//                 />
//               )}
//             </ProductConsumer>
//           </div>
//           <div className="nav-right">
//             <ProductConsumer>
//               {(value) => (
//                 <>
//                   <Link to="/cart" onClick={value.fetchCart}>
//                     <ButtonContainer>
//                       <FiShoppingCart
//                         size={22}
//                         style={{ marginRight: "8px" }}
//                       />
//                       My Cart
//                     </ButtonContainer>
//                   </Link>
//                   <Link
//                     to={value.isLoggedIn ? "/profile" : "/login"}
//                     className="ml-2"
//                     title={value.isLoggedIn ? "Profile" : "Login"}
//                   >
//                     {value.isLoggedIn ? (
//                       <FaUserCheck size={24} color="#7a7f7cff" />
//                     ) : (
//                       <FaUser size={24} color="#7a7f7cff" />
//                     )}
//                   </Link>
//                 </>
//               )}
//             </ProductConsumer>
//           </div>
//         </div>
//       )}
//       {/* Mobile Menu Button */}
//       {isMobile && (
//         <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
//           {menuOpen ? (
//             <AiOutlineClose size={28} color="white" />
//           ) : (
//             <AiOutlineMenu size={28} color="white" />
//           )}
//         </div>
//       )}

//       {/* Mobile Dropdown */}
//       {isMobile && menuOpen && (
//         <div className="mobile-menu">
//           <NavLink
//             to="/"
//             className="nav-link"
//             onClick={() => setMenuOpen(false)}
//           >
//             Products
//           </NavLink>
//           <ProductConsumer>
//             {(value) => (
//               <>
//                 <input
//                   className="navbar-search"
//                   placeholder="Search for products"
//                   onChange={(e) => value.filterProducts(e.target.value)}
//                 />
//                 <Link
//                   to="/cart"
//                   onClick={() => {
//                     value.fetchCart();
//                     setMenuOpen(false);
//                   }}
//                 >
//                   <ButtonContainer>
//                     <FiShoppingCart size={22} style={{ marginRight: "8px" }} />
//                     My Cart
//                   </ButtonContainer>
//                 </Link>
//                 <Link
//                   to={value.isLoggedIn ? "/profile" : "/login"}
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   {value.isLoggedIn ? (
//                     <FaUserCheck size={24} color="#7a7f7cff" />
//                   ) : (
//                     <FaUser size={24} color="#7a7f7cff" />
//                   )}
//                 </Link>
//               </>
//             )}
//           </ProductConsumer>
//         </div>
//       )}
//     </NavWrapper>
//   );
// };

// /* ---------- STYLES ---------- */
// const NavWrapper = styled.nav`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 0.75rem 1.5rem;
//   position: relative;
//   max-height: 70px;

//   .logo img {
//     height: 140px;
//     width: 120px;
//     object-fit: contain;
//   }
//   .nav-content {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     flex: 1;
//     gap: 2rem;
//   }

//   .nav-left {
//     display: flex;
//     align-items: center;
//     gap: 1rem;
//   }

//   .nav-right {
//     display: flex;
//     align-items: center;
//     gap: 1rem;
//   }
//   .navbar-nav {
//     display: flex;
//     align-items: center; /* vertical center */
//     gap: 1rem;
//     list-style: none; /* remove bullets */
//     margin: 0;
//     padding: 0;
//   }
//   .navbar-nav li {
//     display: flex; /* makes the li content flex too */
//     align-items: center;
//   }

//   .nav-link {
//     color: #171a1d85;
//     font-size: 1.1rem;
//     text-transform: capitalize;
//     transition: color 0.2s;
//   }
//   .nav-link:hover {
//     color: #343131ff;
//   }
//   .navbar-search {
//     padding: 8px 14px;
//     height: 40px; /* consistent height */
//     border-radius: 8px;
//     font-size: 1rem;
//     outline: none;
//     background: #eceeeeff;
//     color: #2d3748;
//     border: none;
//     margin-left: 10px; /* spacing from Products link */
//     display: flex; /* ensures vertical alignment */
//     align-items: center;
//   }

//   .actions {
//     display: flex;
//     align-items: center;
//     gap: 1rem;
//   }

//   .menu-toggle {
//     cursor: pointer;
//   }

//   .mobile-menu {
//     position: absolute;
//     top: 70px;
//     left: 0;
//     width: 100%;
//     background: #1e293b;
//     display: flex;
//     flex-direction: column;
//     padding: 1rem;
//     gap: 1rem;
//   }
// `;

// export default Navbar;
