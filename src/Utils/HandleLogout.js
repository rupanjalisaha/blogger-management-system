{/*import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

let logoutTimer;


export function scheduleAutoLogout(token) {
  if (!token) return;

  const decoded = jwtDecode(token);
  const expiryTime = decoded.exp * 1000;

  const delay = expiryTime - Date.now();

  if (delay <= 0) {
    logout();
  } else {
    logoutTimer = setTimeout(() => {
      logout();
    }, delay);
  }
}

export function logout() {

  localStorage.removeItem("token");
  window.location.href = "/login";
}*/}