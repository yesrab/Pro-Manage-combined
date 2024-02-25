import React from "react";
import styles from "./loadingStyles.module.css";
export function ColumnLoader() {
  return (
    <div className={styles.columnLoader}>
      <h3>Syncing Data..</h3>
    </div>
  );
}
function Loading() {
  return (
    <div className={styles.container}>
      <h1>Loading....</h1>
    </div>
  );
}

export default Loading;
