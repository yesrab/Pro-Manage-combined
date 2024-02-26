import React from "react";
import { Link, useLocation } from "react-router-dom";
import componentStyles from "./componentStyles.module.css";

function SubmitButtons() {
  const location = useLocation();

  return (
    <div className={componentStyles.submitContainer}>
      <button aria-label='submit button' type='submit'>
        {location.pathname === "/login" ? "Login" : "Register"}
      </button>
      <p>{location.pathname === "/login" ? "Have no account yet?" : "Have an account ?"}</p>
      <Link to={location.pathname === "/login" ? "/register" : "/login"}>
        {location.pathname === "/login" ? "Register" : "Login"}
      </Link>
    </div>
  );
}

export default SubmitButtons;
