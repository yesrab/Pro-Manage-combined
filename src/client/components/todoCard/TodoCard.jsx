import React, { useState } from "react";
import styles from "./cardStyles.module.css";
import threeDot from "../../assets/threeDot.svg";
import Priority from "./PriorityLables";
import CheckListAccordion from "./CheckListAccordion";
import useOutsideClick from "../../hooks/useOutsideClick";
import fetchUtils from "../../libs/fetchUtils";
import toast from "react-hot-toast";
import formatDate from "../../libs/dateFormatter";
import toastPromice from "../../libs/toastPromiseUtil";
function TodoCard({ shareNote, resetAccordian, openModal, collapse, setCollaps, dispatch, list }) {
  const getCheckedCount = () => {
    const checkedCount = list.todos.filter((item) => item.check).length;
    return `${checkedCount}/${list.todos.length}`;
  };

  const handleChangeSection = (noteId, section, currentSection, note) => {
    const oldSection =
      currentSection === "backlog"
        ? "backlogNotes"
        : currentSection === "todo"
        ? "todoNotes"
        : currentSection === "inProgress"
        ? "progressNotes"
        : "doneNotes";
    const newSection =
      section === "backlog"
        ? "backlogNotes"
        : section === "todo"
        ? "todoNotes"
        : section === "inProgress"
        ? "progressNotes"
        : "doneNotes";
    const newNote = { ...note };
    newNote.section = section;
    dispatch({ type: "CHANGE_SECTION", payload: { id: noteId, newSection, oldSection, note: newNote } });
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

  const patchSection = async (id, section, currentSection, note) => {
    const login = JSON.parse(localStorage.getItem("loginState"));
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
    toast.promise(toastPromice(responce), {
      loading: "syncing details",
      success: <b>{`Moved to ${section}`}</b>,
      error: <b>Unable to move please try again later</b>,
    });
    if (responce.status === "success") {
      handleChangeSection(id, section, currentSection, note);
    }
  };

  function isDeadLine(dateString) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    givenDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    return givenDate < currentDate;
  }
  // console.log("list is", list);
  return (
    <div className={styles.cardContainer}>
      <header>
        <Priority tag={list.Priority} />
        <img
          aria-label='Open menu'
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
              aria-label='Edit button'
              onClick={() => {
                handleDropdownButton();
                openModal(list._id, "addCard", list.section);
              }}>
              Edit
            </button>
          </li>
          <li>
            <button
              aria-label='Share button'
              onClick={() => {
                handleDropdownButton();
                shareNote(list._id);
              }}>
              Share
            </button>
          </li>
          <li>
            <button
              aria-label='delete button'
              onClick={() => {
                handleDropdownButton();
                openModal(list._id, "delete", list.section);
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
              list.section === "done" ? styles.doneColor : isDeadLine(list.dueDate) ? styles.deadLineDate : ""
            }  `}>
            {formatDate(list.dueDate)}
          </button>
        ) : null}

        <div>
          {list.section !== "backlog" && (
            <button
              aria-label='Move to backlog'
              onClick={() => {
                patchSection(list._id, "backlog", list.section, list);
              }}
              className={styles.footerChips}>
              BACKLOG
            </button>
          )}
          {list.section !== "inProgress" && (
            <button
              aria-label='move to in progress'
              onClick={() => {
                patchSection(list._id, "inProgress", list.section, list);
              }}
              className={styles.footerChips}>
              PROGRESS
            </button>
          )}
          {list.section !== "todo" && (
            <button
              aria-label='Move to to-do'
              onClick={() => {
                patchSection(list._id, "todo", list.section, list);
              }}
              className={styles.footerChips}>
              TO-DO
            </button>
          )}
          {list.section !== "done" && (
            <button
              aria-label='move to done'
              onClick={() => {
                patchSection(list._id, "done", list.section, list);
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
