import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderState,
  searchOrderById,
} from "../../../apiRequests/adminReq";
import { io } from "socket.io-client";

// Assuming these model interfaces are correct for your application
interface Product {
  id: number;
  title: string;
  price: number;
  imgurl: string;
  // Add other necessary product fields
}

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  priceAtOrder: number;
  product: Product;
}

interface Address {
  building: string;
  floor: string;
  apartment: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// NOTE: The new order object coming from the socket might have a slightly different structure.
// This interface assumes the socket payload matches the fetched Order structure.
interface Order {
  id: number;
  status: string;
  totalAmount: number;
  paymentmethod: string;
  createdAt: string;
  address: Address;
  items: OrderItem[];
}

const ORDER_STATES = ["pending", "shipped", "delivered"];

// CSS for the simple flash animation
const ANIMATION_STYLE = `
  @keyframes flash-new-order {
    0% { background-color: transparent; }
    50% { background-color: #ffeb3b; } /* Bright yellow flash */
    100% { background-color: transparent; }
  }
  .new-order-flash {
    animation: flash-new-order 2s ease-out;
  }
`;

const OrdersTable: React.FC<{ searchId: string }> = ({ searchId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // State to track which order ID is currently animating
  const [newOrderId, setNewOrderId] = useState<number | null>(null);

  // Function to generate a simple "beep" sound using the Web Audio API
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext;
      if (!AudioContext) return;

      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      // Connect the signal path: oscillator -> gain -> speakers
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Configure the sound properties for a distinct beep
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(440, context.currentTime); // A4 note (440 Hz)

      // Control the gain (volume) and duration (0.3 seconds)
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.05); // Quick attack
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.3); // Quick decay

      // Start and stop the oscillator
      oscillator.start(0);
      oscillator.stop(context.currentTime + 0.3);
    } catch (e) {
      console.error(
        "Web Audio API failed to play sound (requires user interaction first):",
        e
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const socket = io("http://localhost:5172");

    socket.on("newOrder", (newOrder: Order) => {
      console.log("New order received:", newOrder);

      // 1. Play the custom beep sound
      playNotificationSound();

      // 2. Start the animation
      setNewOrderId(newOrder.id);

      // 3. Stop the animation after 2 seconds (matches CSS duration)
      setTimeout(() => {
        setNewOrderId(null);
      }, 2000);

      // Add the new order to the top of the list
      setOrders((prev) => [newOrder, ...prev]);
    });

    if (searchId.trim()) {
      searchOrderById(Number(searchId))
        .then((data) => {
          const response = data as { orders?: Order[] };
          setOrders(
            response.orders && response.orders.length > 0 ? response.orders : []
          );
          if (!response.orders || response.orders.length === 0)
            setError("No order found with that ID.");
        })
        .catch(() => {
          setError("Failed to search order.");
          setOrders([]);
        })
        .finally(() => setLoading(false));
    } else {
      getAllOrders()
        .then((data) => {
          const response = data as { orders?: Order[]; data?: Order[] };
          setOrders(response.orders || response.data || []);
        })
        .catch(() => setError("Failed to fetch orders."))
        .finally(() => setLoading(false));
    }

    // Cleanup function for socket connection
    return () => {
      socket.disconnect();
    };
  }, [searchId]);

  const handleChangeState = async (orderId: number, newState: string) => {
    if (!newState) return;
    setLoading(true);
    try {
      await updateOrderState(orderId, newState);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newState } : order
        )
      );
    } catch {
      setError("Failed to update order state.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Inject the CSS for the flash animation directly into the DOM */}
      <style>{ANIMATION_STYLE}</style>

      <h2 style={{ marginLeft: "7px" }}>Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            background: "#fff",
          }}
        >
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Order ID
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Status
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Total
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Payment
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Created At
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Address
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Items
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", padding: "12px" }}
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  // Conditionally apply the animation class
                  className={order.id === newOrderId ? "new-order-flash" : ""}
                >
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {order.id}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleChangeState(order.id, e.target.value)
                      }
                      disabled={loading}
                      style={{ padding: "4px" }}
                    >
                      {ORDER_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state.charAt(0).toUpperCase() + state.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {order.totalAmount}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {order.paymentmethod}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {order.address
                      ? `${order.address.building}, ${order.address.floor}, ${order.address.apartment}, ${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}`
                      : "-"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {order.items?.map((item) => (
                      <div key={item.id} style={{ marginBottom: "6px" }}>
                        <img
                          src={item.product.imgurl}
                          alt={item.product.title}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            marginRight: "8px",
                          }}
                        />
                        <span>{item.product.title}</span>
                        <span> x{item.quantity}</span>
                        <span> ({item.priceAtOrder} EGP)</span>
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersTable;
