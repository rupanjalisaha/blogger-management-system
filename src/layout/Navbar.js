import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Menu } from "@headlessui/react";
export default function Navbar() {
  const navigate = useNavigate();
  const { setIsAuth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    if (token) {
      localStorage.removeItem("token");
    }
    setIsAuth(false);
    navigate("/login");
  };
  useEffect(() => {
    if (token) loadUsers();
  }, [token]);
  const loadUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/bloggerDetails`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const loggedInUsername = localStorage.getItem("username");
  const loggedInUserId = users.find(
    (user) => user.username === loggedInUsername,
  )?.id;
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
          <Menu as="div" className="relative ms-auto">
            <Menu.Button className="btn btn-light">☰</Menu.Button>

            <Menu.Items
              className="position-absolute end-0 m-2 bg-white text-dark rounded shadow"
              style={{ width: "220px", zIndex: 1000 }}
            >
              {/* Username */}
              <div style={{ padding: "10px", borderBottom: "1px solid #ddd" , fontFamily:"monospace"}}>
                <strong>Username: {loggedInUsername}</strong>
              </div>

              {/* Items */}
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/details"
                    className={`dropdown-item btn p-1 mt-2 btn-primary ${active ? "bg-light" : ""}`}
                  >
                    Home 🏠
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={`/viewuser/${loggedInUserId}`}
                    className={`dropdown-item btn p-1 mt-2 btn-primary ${active ? "bg-light" : ""}`}
                  >
                    My Profile 👤
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={`/viewBlogByUserName/${loggedInUsername}`}
                    className={`dropdown-item btn p-1 mt-2 btn-primary ${active ? "bg-light" : ""}`}
                  >
                    My Blogs 📝
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/viewBlogs"
                    className={`dropdown-item btn p-1 mt-2 btn-primary${active ? "bg-light" : ""}`}
                  >
                    Other Blogs 📚
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`dropdown-item btn p-1 mt-2 mb-2 btn-primary ${active ? "bg-light" : ""}`}
                  >
                    Logout ⏻
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
