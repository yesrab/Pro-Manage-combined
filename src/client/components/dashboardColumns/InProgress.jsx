import React, { useState } from "react";
import styles from "./ColumnsStyles.module.css";
import CollumnHeadder from "./CollumnHeadder";
import TodoCard from "../todoCard/TodoCard";
function InProgress({ dispatch, data }) {
  const [collapse, setCollaps] = useState(populateAccordiastate());
  function populateAccordiastate() {
    const acordianState = data?.map((item) => {
      return { id: item.id, acordian: false };
    });
    return acordianState;
  }

  function closeAccordian() {
    const acordianstate = collapse.map((item) => {
      return { id: item.id, acordian: false };
    });
    setCollaps(acordianstate);
  }

  return (
    <div className={styles.columnContainer}>
      <CollumnHeadder closeAccordian={closeAccordian} origin={"In progress"} />
      <div className={styles.cardsContainer}>
        {data && data.length !== 0
          ? data
              .filter((item) => item.section === "inProgress")
              .map((item) => (
                <TodoCard
                  collapse={collapse}
                  setCollaps={setCollaps}
                  dispatch={dispatch}
                  list={item}
                  key={item.id}
                />
              ))
          : null}
      </div>
    </div>
  );
}

export default InProgress;
