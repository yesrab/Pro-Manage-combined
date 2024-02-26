import React, { useState } from "react";
import styles from "./cardStyles.module.css";
import dropdown from "../../assets/dropDownArrow.svg";
import dropUp from "../../assets/dropUp.svg";
import fetchUtils from "../../libs/fetchUtils";
import toast from "react-hot-toast";
function CheckListAccordion({ resetAccordion, collapse, setCollaps, dispatch, list, checklist }) {
  const handleToggleTodoCheck = async (noteId, todoId) => {
    const login = JSON.parse(localStorage.getItem("loginState"));

    const notePatch = {
      todoId: todoId,
      noteId: noteId,
      updateBoolean: true,
    };
    const url = "/api/v1/notes/getallnotes";
    const newRequest = new Request(url, {
      method: "PATCH",
      body: JSON.stringify(notePatch),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${login.token}`,
      },
    });
    const responce = await fetchUtils(newRequest);
    if (responce.status === "success") {
      dispatch({
        type: "TOGGLE_TODO_CHECK",
        payload: { noteId: noteId, todoId: todoId },
      });
    } else {
      toast.error("unable to perform action please try again later");
    }
  };

  const acordianStyles = {
    display: collapse?.find((item) => item._id === list._id)?.acordian ? "flex" : "none",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
    transform: collapse?.find((item) => item._id === list._id)?.acordian ? "translateY(0)" : "translateY(-100%)",
    transition: "transform 0.5s ease-in",
  };

  function flipAccordian() {
    setCollaps((prevState) => {
      const updatedCollapse = prevState.map((item) => {
        if (item._id === list._id) {
          return { ...item, acordian: !item.acordian };
        }
        return item;
      });
      return updatedCollapse;
    });
  }
  const handleAccordian = () => {
    if (!collapse) {
      setCollaps(resetAccordion());
      flipAccordian();
    }
    if (collapse) {
      flipAccordian();
    }
  };
  return (
    <div className={styles.accordionContainer}>
      <div
        onClick={() => {
          handleAccordian();
        }}
        className={styles.accordionTitle}>
        Checklist ({checklist})
        <img
          alt='dropdown button'
          aria-label='show all tasks'
          src={collapse?.find((item) => item._id === list._id)?.acordian ? dropUp : dropdown}
        />
      </div>
      <div style={acordianStyles}>
        {list.todos.length &&
          list.todos.map((item) => {
            return (
              <div className={styles.accordionItemsChildren} key={item._id}>
                <input
                  onChange={() => {
                    handleToggleTodoCheck(list._id, item._id);
                  }}
                  checked={item.check}
                  type='checkbox'
                />
                {item.value}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default CheckListAccordion;
