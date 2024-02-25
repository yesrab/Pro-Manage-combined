import React, { useState, useEffect, useLayoutEffect } from "react";
import styles from "./HeaderStyles.module.css";
import { useSearchParams } from "react-router-dom";
import { getCurrentFormattedDate } from "../../libs/dateFormatter";
function DashBoardHeader({ name }) {
  const [dropdownVal, setDropDownVal] = useState("This Week");
  const [searchParams, setSearchParams] = useSearchParams();
  const handleDropdownChange = (e) => {
    const selectedOption = e.target.value;
    setDropDownVal(selectedOption);
  };

  useLayoutEffect(() => {
    function getSearchParamsObject(searchParams) {
      const paramsObject = {};
      for (const [key, value] of searchParams.entries()) {
        paramsObject[key] = value;
      }
      return paramsObject;
    }
    if (dropdownVal) {
      const searchParamsObj = getSearchParamsObject(searchParams);
      searchParamsObj["timeFrame"] = dropdownVal;
      setSearchParams(searchParamsObj);
    }
  }, [dropdownVal]);

  return (
    <header className={styles.TopHeading}>
      <div>
        <h3>Welcome! {name}</h3>
        <p>{getCurrentFormattedDate()}</p>
      </div>
      <div>
        <h2>Board</h2>
        <select
          onChange={handleDropdownChange}
          className={styles.dropDownMenu}
          name='filter'
          id='filter'>
          <option value='This Week'>This Week</option>
          <option value='Today'>Today</option>
          <option value='This Month'>This Month</option>
        </select>
      </div>
    </header>
  );
}

export default DashBoardHeader;
