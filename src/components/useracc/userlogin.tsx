import React, { useState, ChangeEvent, FormEvent } from "react";
import "../useracc/userlogin.css";
import { userLogin } from "../../apiRequests/usersReq";
import { useNavigate } from "react-router-dom";
import { ProductConsumer } from "../../context";
/**===========NOtes===========
 * there is two return types in react
 * the firts one is the <productconsumer>
 * returns the consumer and updates the value in the product provider which is the context
 * the second one is react node
 * which is the return type of the component itself to render the jsx
 * @returns
 */
const Userlogin: React.FC = () => {
  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //=================================================================
  //e is the event triggered by form submission
  // fromevent is a generic type for form events in React means that the event is specifically from an HTML form element
  //HTMLFormElement is a built-in TypeScript type that represents a standard HTML <form> element
  return (
    <ProductConsumer>
      {(value) => {
        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setMessage(""); // Clear previous messages
          try {
            const result = await userLogin(form.email, form.password);
            if (result && typeof result === "object" && "message" in result) {
              setMessage(result.message);
              value.setIsLoggedIn(true); // Update context state to reflect user is logged in
              setIsError(false);
              if (value.pendingProductId) {
                // Add the pending product to cart after login
                await value.addToCart(value.pendingProductId);
                value.closeLoginModal();
              }
              setTimeout(() => navigate("/"), 1500); // Forward to homepage
              // console.log("Login successful", value.isLoggedIn);
              // sessionStorage.setItem("isLoggedIn", "true");
            }
          } catch (err: any) {
            // Check for not verified error code from backend
            if (
              err &&
              typeof err === "object" &&
              err.code === "EMAIL_NOT_VERIFIED"
            ) {
              // Redirect to verify page and pass email in state
              setIsError(false);
              setTimeout(
                () => navigate("/verify", { state: { email: form.email } }),
                1500
              );
            } else if (typeof err === "object" && err !== null) {
              if ("message" in err) {
                setMessage(err.error || err.message);
                setIsError(true);
              } else if ("error" in err) {
                setMessage(err.error || err.message);
                setIsError(true);
              } else {
                setMessage("Unknown error occurred.");
                setIsError(true);
              }
            } else {
              setMessage("Unknown error occurred.");
              value.setUserLoggedIn(false); // Update context state to reflect user is logged outs
            }
          }
        };

        ///'';
        return (
          <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
              {/* <img
                src={logo}
                alt="Logo"
                className="login-logo"
                style={{
                  display: "block",
                  margin: "0 auto",
                  width: "120px",
                  maxHeight: "100px",
                  objectFit: "contain",
                }}
              /> */}
              <h2 className="login-title">Welcome Back</h2>
              <div className="login-subtitle"> Sign in and explore</div>
              {message && (
                <div
                  className={`login-message ${isError ? "error" : "success"}`}
                >
                  {message}
                </div>
              )}
              <div style={{ marginBottom: "1.5rem" }}>
                <label className="login-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="login-input"
                />
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label className="login-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="login-input"
                />
                <div className="login-forgot">
                  <a href="/forgot-password">Forgot password?</a>
                </div>
              </div>

              <button type="submit" className="login-button">
                Log In
              </button>
              <div
                className="Register-link"
                style={{ marginTop: "10px", textAlign: "center" }}
              >
                <p>
                  don't have an account? <a href="/register">Register</a>
                </p>
              </div>

              <div className="login-forgot"></div>
            </form>
          </div>
        );
      }}
    </ProductConsumer>
  );
};

export default Userlogin;
