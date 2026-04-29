import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Menu } from "@headlessui/react";
export default function Navbar() {
  const navigate = useNavigate();
  const { setIsAuth } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    if (token) {
      localStorage.removeItem("token");
    }
    setIsAuth(false);
    navigate("/login");
  };
  return (
    <div style={{ width: "100%" }}>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-primary"
        style={{ width: "100%" }}
      >
        <div
          className="container-fluid d-flex gap-3"
          style={{ marginLeft: "3%", marginRight: "1%" }}
        >
          <h3 className="navbar-brand">🌐UVB (Univeral Blog) Portal</h3>
          <Menu as="div" className="relative inline-block text-right ms-auto" style={{ marginRight: "3%" }}>
            <Menu.Button>☰</Menu.Button>
            <Menu.Items>
              <Menu.Item>
                {({ active }) => (
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "cursive",
                      textAlign: "left",
                      marginLeft: "30%",
                      marginTop: "5%",
                      color: "whitesmoke",
                    }}
                  >
                    Username: {localStorage.getItem("username")}
                  </p>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    className="btn btn-outline-light ms-auto"
                    to="/details"
                    style={{ padding: "10px 10px 10px 10px", fontSize: "18px" }}
                  >
                    Home 🈴
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    className="btn btn-outline-light"
                    to="/viewBlogs"
                    style={{ padding: "10px 10px 10px 10px", fontSize: "18px" }}
                  >
                    Blogs 📑
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className="btn btn-outline-light"
                    style={{ padding: "10px 10px 10px 10px", fontSize: "18px" }}
                    onClick={handleLogout}
                  >
                    Log Out【﻿⏻】
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </nav>
    </div>
  );
}
