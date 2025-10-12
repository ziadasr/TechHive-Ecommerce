import React, { useEffect, useState } from "react";
import { getAllUsers, searchUserById } from "../../../apiRequests/adminReq";
import { User } from "../../../apiRequests/usermodel";

interface SearchUserByIdResponse {
  user?: User;
}

const UsersTable: React.FC<{ searchId?: string }> = ({ searchId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (searchId) {
      searchUserById(Number(searchId))
        .then((data) => {
          const response = data as { data?: User };
          setUsers(response.data ? [response.data] : []);
          if (!response.data) setError("No user found with that ID.");
        })
        .catch(() => {
          setError("Failed to search user.");
          setUsers([]);
        })
        .finally(() => setLoading(false));
    } else {
      getAllUsers()
        .then((data) => {
          // Fix: get users from data.data
          const response = data as { data: User[] };
          setUsers(response.data || []);
          setError(null);
        })
        .catch(() => {
          setError("Failed to fetch users.");
          setUsers([]);
        })
        .finally(() => setLoading(false));
    }
  }, [searchId]);

  return (
    <div>
      <h2 style={{ marginLeft: "7px" }}>Users</h2>
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
                User ID
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Email
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Phone Number
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>City</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Date of Birth
              </th>
              {/* <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Last Login
              </th> */}
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Verified
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: "center", padding: "12px" }}
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.id}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.name}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.email}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.phoneNumber}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.city}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "-"}
                  </td>
                  {/* <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "-"}
                  </td> */}
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {user.isVerified ? "Yes" : "No"}
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

export default UsersTable;
