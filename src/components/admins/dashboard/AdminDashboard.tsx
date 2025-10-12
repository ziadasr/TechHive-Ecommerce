import React, { useEffect, useState } from "react";
import UsersTable from "./UsersTable";
import ProductTable from "./ProductTable";
import OrdersTable from "./orderstable";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../util/axios";

type ViewType = "products" | "users" | "orders" | "categories";

const AdminDashboard: React.FC = () => {
  const [view, setView] = useState<ViewType>("products");
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    apiClient
      .get("/admin/check-admin-auth")
      .then(() => setLoading(false))
      .catch(() => {
        setError("Not authorized");
        navigate("/");
      });
  }, [navigate]);

  const renderTable = () => {
    if (view === "products") {
      return <ProductTable searchId={searchId} />;
    } else if (view === "users") {
      // Placeholder: pass empty array for now
      return <UsersTable searchId={searchId} />;
    } else if (view === "orders") {
      return <OrdersTable searchId={searchId} />;
    } else if (view === "categories") {
      return <div>Categories table will be here.</div>;
    }
    return null;
  };
  const handleAddItems = () => {
    window.location.href = "/admin/add-items";
  };
  const handleLogout = () => {
    // ...existing code...
    apiClient.post("/admin/logout").then(() => {
      window.location.href = "/";
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 style={{ marginLeft: "7px" }}>Admin Dashboard</h1>
      <input
        placeholder="Search By ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        style={{
          marginBottom: "8px",
          marginLeft: "7px",
          padding: "1px",
          borderRadius: "2px",
        }}
      />
      <div>
        <button
          style={{
            marginRight: "1px",
            marginLeft: "7px",
            background: view === "products" ? "#7d7d7dff" : "transparent",
          }}
          onClick={() => setView("products")}
        >
          Product
        </button>
        <button
          style={{
            marginRight: "1px",
            background: view === "users" ? "#7d7d7dff" : "transparent",
          }}
          onClick={() => setView("users")}
        >
          Users
        </button>
        <button
          style={{
            marginRight: "1px",
            background: view === "orders" ? "#7d7d7dff" : "transparent",
          }}
          onClick={() => setView("orders")}
        >
          Orders
        </button>
        {/* <button
          style={{ marginRight: "1px" }}
          onClick={() => setView("categories")}
        >
          Categories
        </button> */}
        <button
          style={{
            marginLeft: "8px",
            background: "#879087ff",
            color: "#fff",
            border: "none",
            borderRadius: "3px",
            padding: "4px 4px",
            fontWeight: 500,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onClick={handleAddItems}
        >
          Add Products
        </button>
        <button
          style={{
            marginLeft: "8px",
            background: "#9b0500ff",
            color: "#fff",
            border: "none",
            borderRadius: "3px",
            padding: "4px 4px",
            fontWeight: 500,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onClick={handleLogout}
        >
          logout
        </button>
      </div>
      {renderTable()}
    </div>
  );
};

export default AdminDashboard;
