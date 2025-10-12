import React, { useState, useEffect } from "react";
import "./userprofile.css";
import {
  getUserAddresses,
  getUserInfo,
  onAddAddress,
  getUserOrders,
} from "../../apiRequests/submit-order";
import { Address, orders } from "../../apiRequests/submit-ordermodel";
import apiClient from "../../util/axios";

const UserProfile: React.FC = () => {
  //!--------
  // const context = useContext(ProductContext);

  const [user, setUser] = useState<{
    name: string;
    phoneNumber: string;
    email: string;
  } | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<orders[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<orders | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id" | "userId">>({
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } catch (err) {
        setUser(null);
      }
    };

    const fetchAddresses = async () => {
      try {
        const userAddresses = await getUserAddresses();
        setAddresses(userAddresses || []);
      } catch (err) {
        setAddresses([]);
      }
    };

    const fetchOrders = async () => {
      try {
        console.log("Fetching user orders...");
        const userOrders = await getUserOrders();
        console.log("Fetched orders:", userOrders);
        setOrders(userOrders || []);
      } catch (err) {
        setOrders([]);
      }
    };

    fetchUser();
    fetchAddresses();
    fetchOrders();
  }, []);

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
    } catch (err) {
      alert("Failed to add address");
    }
  };

  const handleLogout = () => {
    apiClient.post("/logout", {}, { withCredentials: true });
    window.location.href = "/";
  };

  return (
    <div className="user-profile-container better-profile">
      <h2 className="profile-title">My Profile</h2>
      <div className="profile-grid">
        <div className="profile-card">
          <h3>User Info</h3>
          <ul>
            <li>
              <strong>Name:</strong> {user?.name || "Loading..."}
            </li>
            <li>
              <strong>Email:</strong> {user?.email || "Loading..."}
            </li>
            <li>
              <strong>Phone:</strong> {user?.phoneNumber || "Loading..."}
            </li>
          </ul>
        </div>
        <div className="profile-card">
          <h3>Addresses</h3>
          <ul>
            {addresses.map((addr) => (
              <li key={addr.id} className="address-item">
                <span>
                  {addr.street}, {addr.city}, {addr.state}, {addr.country}
                  {addr.building ? `, Building: ${addr.building}` : ""}
                  {addr.floor ? `, Floor: ${addr.floor}` : ""}
                  {addr.apartment ? `, Apartment: ${addr.apartment}` : ""}
                  {addr.isDefault ? " (Default)" : ""}
                </span>
              </li>
            ))}
          </ul>
          <button
            className="profile-btn"
            onClick={() => setShowAddressModal(true)}
          >
            Add Address
          </button>
        </div>
      </div>
      <div className="profile-section">
        <h3>Orders</h3>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={
                  "order-row " +
                  (order.status.toLowerCase() === "pending"
                    ? "pending"
                    : order.status.toLowerCase() === "shipped"
                    ? "shipped"
                    : order.status.toLowerCase() === "delivered"
                    ? "delivered"
                    : "")
                }
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedOrder(order);
                  setShowOrderModal(true);
                }}
              >
                <td>{order.id}</td>
                <td>{order.createdAt ? order.createdAt.slice(0, 10) : ""}</td>
                <td>{order.status}</td>
                <td>{order.totalAmount} EGP</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content order-modal">
            <button
              className="close-btn"
              onClick={() => setShowOrderModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3>Order Number: {selectedOrder.id} Items</h3>
            <ul className="order-items-list">
              {selectedOrder.items?.map((item, idx) => (
                <li key={idx} className="order-item-row">
                  <img
                    src={item.product?.imgurl}
                    alt={item.product?.title || "Product"}
                    className="order-item-img"
                  />
                  <div className="order-item-info">
                    <div className="order-item-title">
                      {item.product?.title || "Product"}
                    </div>
                    <div>
                      Qty: <strong>{item.quantity}</strong>
                    </div>
                    <div>
                      Price: <strong>{item.priceAtOrder} EGP</strong>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="modal-actions">
              <button
                className="profile-btn"
                onClick={() => setShowOrderModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Address</h3>
            <input
              type="text"
              placeholder="Street"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="State"
              value={newAddress.state || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={newAddress.postalCode || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, postalCode: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Country"
              value={newAddress.country}
              onChange={(e) =>
                setNewAddress({ ...newAddress, country: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Building"
              value={newAddress.building}
              onChange={(e) =>
                setNewAddress({ ...newAddress, building: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Floor"
              value={newAddress.floor}
              onChange={(e) =>
                setNewAddress({ ...newAddress, floor: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Apartment"
              value={newAddress.apartment}
              onChange={(e) =>
                setNewAddress({ ...newAddress, apartment: e.target.value })
              }
            />
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
              />
              <label className="form-check-label" htmlFor="isDefault">
                Set as default address
              </label>
            </div>
            <div className="modal-actions">
              <button className="profile-btn" onClick={handleAddAddress}>
                Add Address
              </button>
              <button
                className="delete-btn"
                onClick={() => setShowAddressModal(false)}
                style={{ marginLeft: "1rem" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
