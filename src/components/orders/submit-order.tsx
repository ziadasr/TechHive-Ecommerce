import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./submit-order.css";
import {
  getUserInfo,
  getUserAddresses,
  onAddAddress,
  submitOrder,
} from "../../apiRequests/submit-order";
import { getCartItems } from "../../apiRequests/cartReq";
import { Address } from "../../apiRequests/submit-ordermodel";
import { ProductContext } from "../../context";

const SubmitOrder: React.FC = () => {
  const context = useContext(ProductContext);
  const navigate = useNavigate();

  interface User {
    name: string;
    phoneNumber: string;
    email: string;
  }

  interface OrderItem {
    id: number;
    productName: string;
    quantity: number;
    priceAtOrder: number;
  }

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | null>(
    null
  );
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [showPaymentWarning, setShowPaymentWarning] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [newAddress, setNewAddress] = useState<Omit<Address, "id" | "userId">>({
    //omit create a new state without id and userId
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Egypt",
    building: "",
    floor: "",
    apartment: "",
    isDefault: false,
  });
  const totalAmount = items.reduce(
    (acc, item) => acc + item.priceAtOrder * item.quantity,
    0
  );
  useEffect(() => {
    // Fetch user info
    const fetchUser = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } catch (err) {
        alert("Failed to fetch user info");
      }
    };

    // Fetch user addresses
    const fetchAddresses = async () => {
      try {
        const userAddresses = await getUserAddresses();
        // console.log("addresses:", userAddresses);

        setAddresses(userAddresses);
        if (userAddresses.length > 0) {
          setSelectedAddressId(userAddresses[0].id);
        }
      } catch (err) {
        alert("Failed to fetch user addresses");
      }
    };

    // Fetch cart items
    const fetchCartItems = async () => {
      try {
        const result = await getCartItems();
        // console.log("Cart items fetched before:", result.cart);
        if (result && result.cart) {
          const orderItems = result.cart.map((item: any) => ({
            id: item.id,
            productName: item.product.title, // or item.product.name if that's your backend
            quantity: item.quantity,
            priceAtOrder: item.priceAtAdd,
          }));
          setItems(orderItems);
        }
        // Do NOT set totalAmount from backend, always use context.cartTotal
      } catch (err: any) {
        alert(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch cart items"
        );
      }
    };

    fetchUser();
    fetchAddresses();
    fetchCartItems();
  }, [context]);

  const handleAddAddress = async () => {
    const addressPayload = {
      street: newAddress.street,
      city: newAddress.city,
      state:
        newAddress.state !== undefined && newAddress.state !== ""
          ? newAddress.state
          : null,
      postalCode:
        newAddress.postalCode !== undefined && newAddress.postalCode !== ""
          ? newAddress.postalCode
          : null,
      country: newAddress.country,
      isDefault: newAddress.isDefault,
      building: newAddress.building,
      floor: newAddress.floor,
      apartment: newAddress.apartment,
    };
    try {
      const addedAddress = await onAddAddress(addressPayload);
      setAddresses([...addresses, addedAddress]);
      setShowAddressModal(false);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Egypt",
        building: "",
        floor: "",
        apartment: "",
        isDefault: false,
      });
      setSelectedAddressId(addedAddress.id);
    } catch (err) {
      console.error("Failed to add address:", err);
    }
  };

  const handleOpenAddressModal = () => {
    setShowAddressModal(true);
  };

  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    setNewAddress({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Egypt",
      building: "",
      floor: "",
      apartment: "",
      isDefault: false,
    });
    if (addresses.length > 0) setSelectedAddressId(addresses[0].id);
  };
  const handleSubmitOrder = async () => {
    if (!paymentMethod) {
      setShowPaymentWarning(true);
      return;
    }

    try {
      if (paymentMethod === "online") {
        window.location.href = "/payment";
        return;
      }

      // If cash, submit the order directly
      console.log("Submitting order with address ID:", selectedAddressId);
      console.log("Payment method:", paymentMethod);
      const result = await submitOrder(selectedAddressId, paymentMethod);
      // console.log("Order submission result:", result);
      if (result && result.message) {
        alert(result.message);
        context.clearCart();
        navigate("/order-submitted", { state: { orderId: result.orderId } });
      }
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit order"
      );
    }
  };
  if (!user) return <div>Loading...</div>;

  return (
    <div className="submit-order-container">
      <h2>Review Your Order</h2>
      <div className="user-info">
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Phone:</strong> {user.phoneNumber}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <strong>Address:</strong>
          <select
            className="form-select"
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(Number(e.target.value))}
            style={{ maxWidth: "70%" }}
            disabled={addresses.length === 0}
          >
            {addresses.length === 0 ? (
              <option value={0}>No address available</option>
            ) : (
              addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.street}, {addr.city}, {addr.country}
                  {addr.building ? `, Building: ${addr.building}` : ""}
                  {addr.floor ? `, Floor: ${addr.floor}` : ""}
                  {addr.apartment ? `, Apartment: ${addr.apartment}` : ""}
                </option>
              ))
            )}
          </select>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ marginLeft: "0.5rem" }}
            onClick={handleOpenAddressModal}
          >
            Add
          </button>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="address-modal-overlay">
          <div className="address-modal">
            <h3>Add New Address</h3>
            <input
              className="form-control"
              type="text"
              placeholder="Street"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder="State"
              value={newAddress.state || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder="Postal Code"
              value={newAddress.postalCode || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, postalCode: e.target.value })
              }
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder="Country"
              value={newAddress.country}
              onChange={(e) =>
                setNewAddress({ ...newAddress, country: e.target.value })
              }
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder="Building"
              value={newAddress.building}
              onChange={(e) =>
                setNewAddress({ ...newAddress, building: e.target.value })
              }
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder="Floor"
              value={newAddress.floor}
              onChange={(e) =>
                setNewAddress({ ...newAddress, floor: e.target.value })
              }
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder="Apartment"
              value={newAddress.apartment}
              onChange={(e) =>
                setNewAddress({ ...newAddress, apartment: e.target.value })
              }
              required
            />{" "}
            <div className="form-check" style={{ margin: "0.5rem 0" }}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={newAddress.isDefault}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    isDefault: e.target.checked,
                  })
                }
                id="isDefault"
                required
              />
              <label className="form-check-label" htmlFor="isDefault">
                Set as default address
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddAddress}
              >
                Add Address
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseAddressModal}
                style={{ marginLeft: "1rem" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Payment Method Selection */}
      <div style={{ margin: "1rem 0" }}>
        <strong>Choose Payment Method:</strong>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />{" "}
            Online Payment
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />{" "}
            Cash
          </label>
        </div>
        {!paymentMethod && showPaymentWarning && (
          <p style={{ color: "red", marginTop: "8px" }}>
            Please select a payment method before continuing.
          </p>
        )}
      </div>

      <div className="order-summary">
        <h3>Items</h3>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.productName} x{item.quantity} — EGP
              {(item.priceAtOrder * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <div className="total">
          <strong>Total:</strong>
          {totalAmount.toFixed(2)} EGP
        </div>
      </div>
      <button
        className={`submit-btn ${showPaymentWarning ? "shake" : ""}`}
        onClick={handleSubmitOrder}
      >
        {paymentMethod === "online"
          ? "Proceed to Payment"
          : paymentMethod === "cod"
          ? "Submit Order"
          : "Choose Payment Method"}
      </button>
    </div>
  );
};

export default SubmitOrder;
