import React, { useState } from "react";
import styles from "./ColumnsStyles.module.css";
import collapse from "../../assets/collapse.svg";
import add from "../../assets/add.svg";
function CollumnHeadder({ closeAccordian, origin, toggleModal }) {
  return (
    <header className={styles.collumnHeadder}>
      <h2>{origin}</h2>
      <div>
        {origin === "To Do" && (
          <img
            onClick={() => {
              toggleModal(null, "addCard");
            }}
            src={add}
            alt='add'
          />
        )}
        <img
          onClick={() => {
            closeAccordian();
          }}
          src={collapse}
          alt='collapse'
        />
      </div>
    </header>
  );
}

export default CollumnHeadder;
