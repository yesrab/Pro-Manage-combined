import React, { useContext } from "react";
import styles from "./NavBarStyles.module.css";
import ProManage from "../../assets/proManageLogo.svg";
import Board from "../../assets/Board.svg";
import Analytics from "../../assets/database.svg";
import Settings from "../../assets/settings.svg";
import Logout from "../../assets/Logout.svg";
import LoginContext from "../../context/LoginContext";
import { NavLink, useNavigate } from "react-router-dom";
function NavigationBar({ logOut }) {
  const { loginState, dispatch } = useContext(LoginContext);
  const nav = useNavigate();

  return (
    <nav className={styles.navigation}>
      <h3 className={styles.Navlinks}>
        <img aria-label='Pro manage' src={ProManage} alt='ProManage' /> Pro Manage
      </h3>
      <NavLink
        aria-label='go to dashboard'
        className={({ isActive }) => (isActive ? styles.activeNav : styles.Navlinks)}
        to='/'>
        <img src={Board} alt='ProManage' />
        <p>Board</p>
      </NavLink>
      <NavLink
        aria-label='go to analytics'
        className={({ isActive }) => (isActive ? styles.activeNav : styles.Navlinks)}
        to='/analytics'>
        <img src={Analytics} alt='ProManage' />
        <p>Analytics</p>
      </NavLink>
      <NavLink
        aria-label='go to settings'
        className={({ isActive }) => (isActive ? styles.activeNav : styles.Navlinks)}
        to='/settings'>
        <img src={Settings} alt='ProManage' />
        <p>Settings</p>
      </NavLink>
      <button aria-label='Log out' onClick={logOut} className={styles.Navlinks} to='/lol'>
        <img src={Logout} alt='ProManage' />
        <p>Log Out</p>
      </button>
    </nav>
  );
}

export default NavigationBar;
