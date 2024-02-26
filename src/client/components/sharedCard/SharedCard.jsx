import React from "react";
import styles from "./sharedCardStyles.module.css";
import Priority from "../todoCard/PriorityLables";
import formatDate from "../../libs/dateFormatter";
function SharedCard({ data }) {
  const getCheckedCount = () => {
    const checkedCount = data.card.todos.filter((item) => item.check).length;
    return `${checkedCount}/${data.card.todos.length}`;
  };
  // console.log(data.card.dueDate);
  return (
    <div className={styles.cardContainer}>
      <div className={styles.infoBlock}>
        <Priority tag={data.card.Priority} />
        <h3>{data.card.title}</h3>
      </div>
      <p className={styles.checkCount}>checkList ({getCheckedCount()})</p>
      <div className={styles.taskList}>
        {data.card.todos.length &&
          data.card.todos.map((item) => {
            return (
              <div key={item._id} className={styles.taskItem}>
                <input readOnly checked={item.check} type='checkbox' />
                {item.value}
              </div>
            );
          })}
      </div>

      {data.card.dueDate && (
        <p className={styles.dateContainer}>
          Due Date
          <span className={styles.dateChip}>
            {formatDate(data.card.dueDate)}
          </span>
        </p>
      )}
    </div>
  );
}

export default SharedCard;
