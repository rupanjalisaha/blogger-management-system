import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../layout/Navbar";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      setMessage("Invalid link");
      setStatus("error");
      return;
    }
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/email-verification?token=${token}`,
      )
      .then((res) => {
        setMessage(res.data);
        setStatus("success");
        navigate("/login");
      })
      .catch((err) => {
        const errorCode = err.response?.data?.error;

        if (errorCode === "EMAIL_NOT_VERIFIED") {
          setMessage("Verify your email before logging in.");
          setStatus("error");
        } else if (errorCode === "INVALID_CREDENTIALS") {
          setMessage("Invalid username or password");
          setStatus("error");
        } else {
          setMessage("Something went wrong");
          setStatus("error");
        }
      });
  }, []);

  return (
    <div className="container text-center mt-5">
      <h2 style={{fontFamily:"cursive"}}>Email Verification</h2>

      {status === "loading" && <p>Verifying...</p>}
      {status === "success" && <p className="text-success">{message}</p>}
      {status === "error" && <p className="text-danger">{message} Please register with a valid mail id.<Link to="/register">Try again to register</Link></p>}
    </div>
  );
}
