import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function Navbar() {
  
  const navigate = useNavigate();
  const { setIsAuth } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/login");
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid d-flex gap-3" style={{marginLeft:"3%", marginRight:"1%"}}>
          <h4 className="navbar-brand">UVB (Univeral Blog) Portal</h4>
          <p style={{ fontSize: "16px", fontFamily: "revert", textAlign:"left", marginLeft: "-180px", marginTop:"3.5%", color:"whitesmoke"}}>
        Username: {localStorage.getItem("username")}
      </p>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          ></button>
          <Link className="btn btn-outline-light ms-auto" to="/details" style={{padding:"10px 10px 10px 10px", fontSize:"18px"}}>
            Home
          </Link>
          <Link className="btn btn-outline-light" to="/viewBlogs" style={{padding:"10px 10px 10px 10px", fontSize:"18px"}}>
            UBP
          </Link>
          <button
            className="btn btn-outline-light"
            style={{padding:"10px 10px 10px 10px", fontSize:"18px"}}
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
        
      </nav>
      
    </div>
  );
}
