import React, { useState } from "react";
import styles from "./cardStyles.module.css";
import threeDot from "../../assets/threeDot.svg";
import Priority from "./PriorityLables";
import CheckListAccordion from "./CheckListAccordion";
import useOutsideClick from "../../hooks/useOutsideClick";
import fetchUtils from "../../libs/fetchUtils";
import toast from "react-hot-toast";
import formatDate from "../../libs/dateFormatter";
function TodoCard({
  shareNote,
  resetAccordian,
  openModal,
  collapse,
  setCollaps,
  dispatch,
  list,
}) {
  const getCheckedCount = () => {
    const checkedCount = list.todos.filter((item) => item.check).length;
    return `${checkedCount}/${list.todos.length}`;
  };
  // console.log("this is form the todocard", list);

  const handleChangeSection = (noteId, section) => {
    dispatch({ type: "CHANGE_SECTION", payload: { id: noteId, section } });
    setCollaps((prevState) => {
      const updatedCollapse = prevState?.map((item) => {
        if (item._id === list._id) {
          return { ...item, acordian: false };
        }
        return item;
      });
      return updatedCollapse;
    });
  };

  const [isDropDown, setIsDropDown] = useState(false);

  const closeMenu = () => {
    setIsDropDown(false);
  };
  const menuRef = useOutsideClick(closeMenu);
  const handleDropdownButton = () => {
    setIsDropDown(false);
  };
  // console.log(list._id);

  const patchSection = async (id, section) => {
    const login = JSON.parse(localStorage.getItem("loginState"));
    console.log(id);
    const url = "/api/v1/notes/getallnotes";
    const notePatch = {
      noteId: id,
      section: section,
    };
    const newPatchRequest = new Request(url, {
      method: "PATCH",
      body: JSON.stringify(notePatch),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${login.token}`,
      },
    });

    const responce = await fetchUtils(newPatchRequest);
    if (responce.status === "success") {
      toast.success(`Moved to ${section}`);
      handleChangeSection(id, section);
    } else {
      toast.error("Unable to move please try again later");
    }
  };

  function isDeadLine(dateString) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    givenDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    return givenDate < currentDate;
  }
  // console.log(list.dueDate);
  return (
    <div className={styles.cardContainer}>
      <header>
        <Priority tag={list.Priority} />
        <img
          onClick={() => {
            setIsDropDown(true);
          }}
          src={threeDot}
          alt='three dot menu'
        />
      </header>
      {isDropDown ? (
        <ul ref={menuRef} className={styles.dropdown}>
          <li>
            <button
              onClick={() => {
                handleDropdownButton();
                openModal(list._id, "addCard");
              }}>
              Edit
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                handleDropdownButton();
                shareNote(list._id);
              }}>
              Share
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                handleDropdownButton();
                openModal(list._id, "delete");
              }}
              style={{ color: "#CF3636" }}>
              Delete
            </button>
          </li>
        </ul>
      ) : null}
      <h3 title={list.title}>{list.title}</h3>
      <CheckListAccordion
        resetAccordion={resetAccordian}
        dispatch={dispatch}
        checklist={getCheckedCount()}
        list={list}
        setCollaps={setCollaps}
        collapse={collapse}
      />
      <div className={styles.moveButtonContainer}>
        {list.dueDate ? (
          <button
            className={` ${styles.date}  ${
              list.section === "done"
                ? styles.doneColor
                : isDeadLine(list.dueDate)
                ? styles.deadLineDate
                : ""
            }  `}>
            {formatDate(list.dueDate)}
          </button>
        ) : null}

        <div>
          {list.section !== "backlog" && (
            <button
              onClick={() => {
                patchSection(list._id, "backlog");
              }}
              className={styles.footerChips}>
              BACKLOG
            </button>
          )}
          {list.section !== "inProgress" && (
            <button
              onClick={() => {
                patchSection(list._id, "inProgress");
              }}
              className={styles.footerChips}>
              PROGRESS
            </button>
          )}
          {list.section !== "todo" && (
            <button
              onClick={() => {
                patchSection(list._id, "todo");
              }}
              className={styles.footerChips}>
              TO-DO
            </button>
          )}
          {list.section !== "done" && (
            <button
              onClick={() => {
                patchSection(list._id, "done");
              }}
              className={styles.footerChips}>
              DONE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoCard;
