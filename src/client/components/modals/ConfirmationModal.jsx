import React from "react";
import styles from "./ModalStyles.module.css";
function ConfirmationModal({ toggleModal, deleteNote, type }) {
  return (
    <div className={styles.confirmBoxContainer}>
      <h3>
        {type === "delete"
          ? "Are you sure you want to Delete?"
          : "Are you sure you want to Logout?"}
      </h3>
      <div className={styles.confirmboxButtons}>
        <button
          onClick={() => {
            type === "delete" ? deleteNote() : null;
          }}>
          Yes, Delete
        </button>
        <button onClick={toggleModal}>Cancel</button>
      </div>
    </div>
  );
}

export default ConfirmationModal;
