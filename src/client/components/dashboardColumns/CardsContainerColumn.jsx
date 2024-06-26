import React, { useEffect, useState } from "react";
import styles from "./ColumnsStyles.module.css";
import CollumnHeadder from "./CollumnHeadder";
import TodoCard from "../todoCard/TodoCard";
function CardsContainerColumn({ shareNote, origin, openModal, dispatch, data }) {
  const [collapse, setCollaps] = useState(populateAccordiastate());
  function populateAccordiastate() {
    const acordianState = data?.map((item) => {
      return { _id: item._id, acordian: false };
    });
    return acordianState;
  }

  useEffect(() => {
    if (data) {
      const newDataIds = data?.map((item) => item._id);
      const existingDataIds = collapse?.map((item) => item._id);
      const newDataItems = data?.filter((item) => !existingDataIds?.includes(item._id));
      const newAccordionState = newDataItems?.map((item) => ({
        _id: item._id,
        accordion: false,
      }));
      if (collapse) {
        setCollaps((prevState) => [...prevState, ...newAccordionState]);
      }
    }
  }, [data]);

  function closeAccordian() {
    const acordianstate = collapse?.map((item) => {
      return { _id: item._id, acordian: false };
    });
    setCollaps(acordianstate);
  }

  return (
    <div className={styles.columnContainer}>
      <CollumnHeadder closeAccordian={closeAccordian} toggleModal={openModal} origin={origin} />
      <div className={styles.cardsContainer}>
        {data && data.length !== 0
          ? data.map((item) => (
              <TodoCard
                shareNote={shareNote}
                resetAccordian={populateAccordiastate}
                openModal={openModal}
                collapse={collapse}
                setCollaps={setCollaps}
                dispatch={dispatch}
                list={item}
                key={item._id}
              />
            ))
          : null}
      </div>
    </div>
  );
}

export default CardsContainerColumn;

