import React, { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./LayoutStyles.module.css";
import NavigationBar from "../../components/navigationBar/NavigationBar";
import LoginContext from "../../context/LoginContext";
import ModelWrapper from "../../components/modals/ModalWrapper";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
function HomePageLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nav = useNavigate();
  const { loginState, dispatch } = useContext(LoginContext);
  const logOut = () => {
    dispatch({ type: "LOGOUT" });
    nav("/", { replace: true });
  };
  const triggerLogOutModal = () => {
    setIsModalOpen((prev) => !prev);
  };
  return (
    <div className={styles.HomePageContainer}>
      <ModelWrapper open={isModalOpen} toggleModal={triggerLogOutModal}>
        <ConfirmationModal
          logOut={logOut}
          toggleModal={triggerLogOutModal}
          type={"logout"}
        />
      </ModelWrapper>
      <NavigationBar logOut={triggerLogOutModal} />
      <Outlet />
    </div>
  );
}

export default HomePageLayout;
