import React from "react";
import styles from "./ModalStyles.module.css";
import ReactDOM from "react-dom";
function ModelWrapper({ toggleModal, open, children }) {
  if (!open) {
    return null;
  }
  return ReactDOM.createPortal(
    <>
      <div onClick={toggleModal} className={styles.modalOverlay} />
      <dialog className={styles.modalWrapperStyles} open={open}>
        {children}
      </dialog>
    </>,
    document.getElementById("portal")
  );
}

export default ModelWrapper;
