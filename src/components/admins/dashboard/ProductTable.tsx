import React, { useEffect, useState } from "react";
import {
  dashboardProducts,
  searchProductByIdFromDashboard,
} from "../../../apiRequests/adminReq";

/**
 * todo instead of fetching product admin dashboard use the context
 * todo apply the search
 * todo adjust the buttons
 */

interface Product {
  id: number;
  title: string;
  price: number;
  count: number;
  total: number;
  company: string;
  createdAt: string;
  searchID: string;
}

const ProductTable: React.FC<{ searchId: string }> = ({ searchId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setLoading(true);
    setError(null);

    if (searchId) {
      searchProductByIdFromDashboard(Number(searchId))
        .then((res: any) => {
          setProducts(res.data ? [res.data] : []);
        })
        .catch((err: any) => {
          setError(err.error || "Failed to fetch product");
          setProducts([]);
        })
        .finally(() => setLoading(false));
    } else {
      dashboardProducts()
        .then((res: any) => {
          setProducts(res.data || []);
        })
        .catch((err: any) => {
          setError(err.error || "Failed to fetch products");
          setProducts([]);
        })
        .finally(() => setLoading(false));
    }
  }, [searchId]);

  return (
    <div>
      <h2 style={{ marginLeft: "7px" }}>Products</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
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
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Title
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Company
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Price
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Count
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Total
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Created At
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: "center", padding: "12px" }}
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {product.id}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {product.title}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {product.company}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {product.price}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {product.count}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {product.total}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {product.createdAt}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <button
                      style={{
                        minWidth: "80px", // same width for both
                        height: "32px", // same height
                        background: "#979797ff", // blue
                        marginBottom: "4px",
                        color: "#fff",
                        border: "none",
                        borderRadius: "20px", // pill shape
                        fontSize: "0.85em",
                        cursor: "pointer",
                        transition: "background 0.2s, transform 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#d7d5d5ff")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "#979797ff")
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={{
                        minWidth: "80px",
                        height: "32px",
                        background: "#ba2a38ff", // red
                        color: "#fff",
                        border: "none",
                        borderRadius: "20px",
                        fontSize: "0.85em",
                        cursor: "pointer",
                        transition: "background 0.2s, transform 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#eb2a3dff")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "#ba2a38ff")
                      }
                    >
                      Delete
                    </button>
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

export default ProductTable;
