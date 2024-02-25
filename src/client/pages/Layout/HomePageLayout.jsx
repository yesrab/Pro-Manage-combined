import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./LayoutStyles.module.css";
import NavigationBar from "../../components/navigationBar/NavigationBar";
function HomePageLayout() {
  return (
    <div className={styles.HomePageContainer}>
      <NavigationBar />
      <Outlet />
    </div>
  );
}

export default HomePageLayout;
