import React, { useContext } from "react";
import styles from "./NavBarStyles.module.css";
import ProManage from "../../assets/proManageLogo.svg";
import Board from "../../assets/Board.svg";
import Analytics from "../../assets/database.svg";
import Settings from "../../assets/settings.svg";
import Logout from "../../assets/Logout.svg";
import LoginContext from "../../context/LoginContext";
import { NavLink, useNavigate } from "react-router-dom";
function NavigationBar() {
  const { loginState, dispatch } = useContext(LoginContext);
  const nav = useNavigate();
  const logOut = () => {
    dispatch({ type: "LOGOUT" });
    nav("/", { replace: true });
  };
  return (
    <nav className={styles.navigation}>
      <h3 className={styles.Navlinks}>
        <img src={ProManage} alt='ProManage' /> Pro Manage
      </h3>
      <NavLink
        className={({ isActive }) =>
          isActive ? styles.activeNav : styles.Navlinks
        }
        to='/'>
        <img src={Board} alt='ProManage' />
        <p>Board</p>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? styles.activeNav : styles.Navlinks
        }
        to='/analytics'>
        <img src={Analytics} alt='ProManage' />
        <p>Analytics</p>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? styles.activeNav : styles.Navlinks
        }
        to='/settings'>
        <img src={Settings} alt='ProManage' />
        <p>Settings</p>
      </NavLink>
      <button onClick={logOut} className={styles.Navlinks} to='/lol'>
        <img src={Logout} alt='ProManage' />
        <p>Log Out</p>
      </button>
    </nav>
  );
}

export default NavigationBar;
