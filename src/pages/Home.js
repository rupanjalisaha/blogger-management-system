import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");
  console.log(token);
  useEffect(() => {
    if (token) loadUsers();
  }, [token]);

  const loadUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/UVB/bloggerDetails", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const isAdmin = localStorage.getItem("username") === "admin";
  const navigate = useNavigate();
  const deleteUser = async (id, username) => {
    try {
      if (isAdmin) {
        const deleteConfirmed = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
        if(!deleteConfirmed) return;
        const result = await axios.delete(`http://localhost:8080/UVB/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token with the 'Bearer' scheme
          },
        });
        console.log(result);
        alert("User deleted successfully!");
      } else {
        alert("You can delete your own account only.");
      }
    } catch (error) {
      alert(
        "Error! User could not be deleted. Check console for error details.",
      );
      console.error("Error deleting user:", error);
    }
  };
  const filteredUsers = users.filter(user=> user.username !== "admin");
  return (
    <div>
      <Navbar />
      <div className="container">
        <h2 style={{ fontFamily: "monospace", textDecoration: "overline", marginTop: "3%" }}>
          Registered Writers List of UVB
        </h2>
        <p style={{ color: "red", fontWeight: "bold" }}>
          * Edit & Delete is only possible for own account
        </p>
        <div className="py-4">
          <table className="table border shadow">
            <thead>
              <tr>
                <th scope="col">S.N.</th>
                <th scope="col">Username</th>
                <th scope="col">Full Name</th>
                <th scope="col">Writing Category</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td>{user.category}</td>
                  <td>
                    <Link
                      className="btn btn-primary mx-2"
                      to={`/viewuser/${user.id}`}
                    >
                      View
                    </Link>
                      <Link
                      className="btn btn-outline-primary mx-2"
                      to={`/edituser/${user.id}`}
                      aria-disabled={
                        user.username !== localStorage.getItem("username")
                      }
                    >
                      Edit
                    </Link>
                    {isAdmin && (
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => deleteUser(user.id, user.username)}
                    >
                      Delete
                    </button>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
