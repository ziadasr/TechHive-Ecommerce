import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddItems.css";
import { addItem } from "../../../../src/apiRequests/ProductsReq";
import apiClient from "../../../util/axios"; // Make sure this path is correct

const AddItem = () => {
  const [form, setForm] = useState({
    title: "",
    imgurl: "",
    price: "",
    company: "",
    info: "",
    count: "",
    total: 0,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productToSend = {
      ...form,
      total: Number(form.price) * Number(form.count) || 0,
    };

    try {
      await addItem(productToSend);
      setMessage("Product added successfully!");
      setForm({
        title: "",
        imgurl: "",
        price: "",
        company: "",
        info: "",
        count: "",
        total: 0,
      });
    } catch (err) {
      setMessage(err.error || "Error adding product.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="additems-container">
      <form className="additems-form" onSubmit={handleSubmit}>
        <h2 className="additems-title">Add New Product</h2>
        <div className="additems-field">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="additems-field">
          <label htmlFor="imgurl">Image URL</label>
          <input
            type="text"
            id="imgurl"
            name="imgurl"
            value={form.imgurl}
            onChange={handleChange}
            required
          />
        </div>
        <div className="additems-field">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="additems-field">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={form.company}
            onChange={handleChange}
            required
          />
        </div>
        <div className="additems-field">
          <label htmlFor="info">Info</label>
          <textarea
            id="info"
            name="info"
            value={form.info}
            onChange={handleChange}
            required
          />
        </div>
        <div className="additems-field">
          <label htmlFor="count">Count</label>
          <input
            type="number"
            id="count"
            name="count"
            value={form.count}
            onChange={handleChange}
            required
            min="0"
            step="1"
          />
        </div>{" "}
        <button type="submit" className="additems-button">
          Add Product
        </button>
        {message && <div className="additems-message">{message}</div>}
      </form>
    </div>
  );
};

export default AddItem;
// ...existing code...
