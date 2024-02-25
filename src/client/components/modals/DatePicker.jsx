import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import styles from "./ModalStyles.module.css";
function DatePicker({ date, setDate }) {
  let footer = <span className={styles.dateFoot}>Please pick a day.</span>;
  const pickerSyles = {
    display: "flex",
    justifyContent: "space-around",
  };
  if (date) {
    footer = (
      <div style={pickerSyles}>
        <span className={styles.dateFoot}>
          You picked {format(date, "PP")}.
        </span>
        <button
          onClick={() => {
            setDate(undefined);
          }}
          type='button'>
          Clear
        </button>
      </div>
    );
  }
  return (
    <div className={styles.DatePicker}>
      <DayPicker
        mode='single'
        selected={date}
        onSelect={setDate}
        footer={footer}
      />
    </div>
  );
}

export default DatePicker;
