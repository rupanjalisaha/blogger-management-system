import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import AddUser from "./Users/AddUser";
import EditUser from "./Users/EditUser";
import ViewUser from "./Users/ViewUser";
import WritingBlogs from "./Blogs/WritingBlogs";
import ViewBlog from "./Blogs/ViewBlog";
import ViewBlogById from "./Blogs/ViewBlogById";
import EditBlog from "./Blogs/EditBlog";
import LoginUser from "./Users/LoginUser";
import ViewBlogByUserName from "./Blogs/ViewBlogByUserName";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import ResetPasswordPage from "./layout/ResetPasswordPage";
  import { jwtDecode } from "jwt-decode";
  import { useContext } from "react";
  import { AuthContext } from "./AuthContext";
  import { Navigate } from "react-router-dom";

function App() {

    const { isAuth } = useContext(AuthContext);
  
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={!isAuth?<AddUser />:<Navigate to="/details"/>} />
            <Route path="/login" element={!isAuth?<LoginUser />:<Navigate to="/details"/>} />
            <Route path="/resetPassword" element={!isAuth?<ResetPasswordPage/>:<Navigate to="/details"/>} />
            <Route
              path="/details"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edituser/:id"
              element={
                <ProtectedRoute>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewuser/:id"
              element={
                <ProtectedRoute>
                  <ViewUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/writeBlogs"
              element={
                <ProtectedRoute>
                  <WritingBlogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewBlogs"
              element={
                <ProtectedRoute>
                  <ViewBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewblog/:id"
              element={
                <ProtectedRoute>
                  <ViewBlogById />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editblog/:id"
              element={
                <ProtectedRoute>
                  <EditBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewBlogByUserName/:username"
              element={
                <ProtectedRoute>
                  <ViewBlogByUserName />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
