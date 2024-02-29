import React, { useEffect, useState } from "react";
import { Form, Link, useSubmit, useRevalidator } from "react-router-dom";
import styles from "./ModalStyles.module.css";
import deleteticon from "../../assets/DeleteIcon.svg";
import DatePicker from "./DatePicker";
import useValidator from "../../hooks/useValidator";
import toast from "react-hot-toast";
function AddCardModal({ NoteReference, allNotes, setModalType, toggleModal }) {
  const [todoList, setTodoList] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [date, setDate] = useState(undefined);
  const [showPicker, setShowPicker] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const submit = useSubmit();
  let revalidator = useRevalidator();
  /**
   * Renders a modal for adding a new card/note.
   * Allows user to enter title, priority, and due date.
   * Uses React hooks for state management and validation.
   */

  const addTodo = () => {
    const newTodoList = [...todoList, { id: nextId, check: false, value: "" }];
    setTodoList(newTodoList);
    setNextId(nextId + 1);
  };
  const deleteTodo = (id) => {
    const filteredList = todoList.filter((item) => item.id !== id);
    setTodoList(filteredList);
  };
  const handleInputChange = (id, newValue) => {
    const updatedTodoList = todoList.map((item) => (item.id === id ? { ...item, value: newValue } : item));
    setTodoList(updatedTodoList);
  };
  const handleCheckboxChange = (id) => {
    const updatedTodoList = todoList.map((item) => (item.id === id ? { ...item, check: !item.check } : item));
    setTodoList(updatedTodoList);
  };
  const getCheckedCount = () => {
    const checkedCount = todoList.filter((item) => item.check).length;
    return `${checkedCount}/${todoList.length}`;
  };
  const openDatePicker = () => {
    setShowPicker(!showPicker);
  };

  useEffect(() => {
    if (NoteReference) {
      const { id, section } = NoteReference;
      const getSectionName = (section) => {
        switch (section) {
          case "backlog":
            return "backlogNotes";
          case "todo":
            return "todoNotes";
          case "inProgress":
            return "progressNotes";
          default:
            return "doneNotes";
        }
      };
      const sectionName = getSectionName(section);
      const noteIndex = allNotes[sectionName].findIndex((noteObj) => noteObj._id === id);
      const noteObj = allNotes[sectionName][noteIndex];
      setNoteToEdit(noteObj);
      const localisedTodoArray = noteObj.todos.map((note, index) => {
        return { check: note.check, value: note.value, id: index + 1 };
      });
      setTodoList(localisedTodoArray);
      setNextId(localisedTodoArray.length + 1);
      setDate(noteObj?.dueDate !== null ? new Date(noteObj.dueDate) : undefined);
    }
  }, []);

  const submiter = (e) => {
    e.preventDefault();
    const canSubmit = true;
    const formData = new FormData(e.target);
    formData.set("section", noteToEdit?.section || "todo");
    formData.set("visibility", noteToEdit?.visibility || "private");
    const formObj = {};
    for (const val of formData.entries()) {
      formObj[val[0]] = val[1];
    }
    console.log(formObj);
    const hasNoteKey = Object.keys(formObj).some((key) => key.startsWith("note"));
    console.log(hasNoteKey);
    const todos = [];
    formData.forEach((value, key) => {
      if (key.startsWith("note")) {
        const id = key.split(":")[1];
        const checkKey = `check:${id}`;
        const isChecked = formData.get(checkKey) === "on";
        todos.push({
          note: parseInt(id),
          check: isChecked,
          value: value || "",
        });
      }
    });
    const formattedData = {
      noteId: noteToEdit?._id || null,
      title: formData.get("title") || "",
      dueDate: formData.get("dueDate") || "",
      Priority: formData.get("Priority") || null,
      section: formData.get("section") || "todo",
      visibility: formData.get("visibility") || "private",
      todos: todos,
    };
    // console.log(formattedData);
    if (canSubmit) {
      if (hasNoteKey) {
        if (formData.get("Priority")) {
          // console.log("submmiting");
          submit(formattedData, {
            method: noteToEdit ? "PUT" : "POST",
            encType: "application/json",
          });
          revalidator.revalidate();
          toggleModal();
        } else {
          // console.log("priority none");
          toast.error("Please select a priority");
          return;
        }
      } else {
        // console.log("note none");
        toast.error("Please add atleast one note");
        return;
      }
    }
  };

  return (
    <div className={styles.addCardContainer}>
      <Form onSubmit={submiter}>
        <label>
          Title <span className={styles.red}>*</span>
          <br />
          <input
            placeholder='Enter Task Title'
            className={styles.inputBoxes}
            required
            name='title'
            defaultValue={noteToEdit?.title}
            type='text'
          />
        </label>
        <div className={styles.PriorityContainer}>
          <label htmlFor='Priority' className={`${styles.PriorityLable} ${styles.CheckBoxLables} `}>
            Select Priority <span className={styles.red}>*</span>
          </label>
          <input
            className={`${styles.Priority} ${styles.highRadio} `}
            type='radio'
            id='high'
            name='Priority'
            value='HIGH'
            defaultChecked={noteToEdit && noteToEdit.Priority === "HIGH"}
          />
          <label className={`${styles.PriorityLable} ${styles.high}`} htmlFor='high'>
            <span className={styles.red}>&#x2022;</span> HIGH PRIORITY
          </label>
          <input
            className={` ${styles.Priority} ${styles.mediumRadio} `}
            type='radio'
            id='medium'
            name='Priority'
            value='MODERATE'
            defaultChecked={noteToEdit && noteToEdit.Priority === "MODERATE"}
          />
          <label className={`${styles.PriorityLable} ${styles.medium}`} htmlFor='medium'>
            <span className={styles.blue}>&#x2022;</span> MODERATE PRIORITY
          </label>
          <input
            className={` ${styles.Priority} ${styles.lowRadio} `}
            type='radio'
            id='low'
            name='Priority'
            value='LOW'
            defaultChecked={noteToEdit && noteToEdit.Priority === "LOW"}
          />
          <label className={`${styles.PriorityLable} ${styles.low}`} htmlFor='low'>
            <span className={styles.green}>&#x2022;</span> LOW PRIORITY
          </label>
        </div>
        <div className={styles.TaskListWrapper}>
          <p>
            Checklist ({getCheckedCount()})<span className={styles.red}>*</span>
          </p>
          <div className={styles.TaskListContainer}>
            {todoList.length
              ? todoList?.map((item, key) => {
                  return (
                    <span key={item.id}>
                      <div className={`${styles.inputBoxes} ${styles.inputBoxContainer} `}>
                        <input
                          name={`check:${item.id}`}
                          className={styles.todoCheckbox}
                          type='checkbox'
                          checked={item.check}
                          // value={item.check ? "on" : "off"}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                        <input
                          className={styles.tasklistInput}
                          placeholder='Type...'
                          name={`note:${item.id}`}
                          type='text'
                          required
                          defaultValue={item?.value}
                          onChange={(e) => {
                            handleInputChange(item.id, e.target.value);
                          }}
                          // value={item.value}
                          // onChange={(e) =>
                          //   handleInputChange(item.id, e.target.value)
                          // }
                        />
                        <img onClick={() => deleteTodo(item.id)} src={deleteticon} alt='delete' />
                      </div>
                    </span>
                  );
                })
              : null}
          </div>
          <button onClick={addTodo} className={styles.addTask} type='button'>
            + Add New
          </button>
        </div>
        <div className={styles.footerButtonRow}>
          <button className={styles.footerButtons} type='button' onClick={openDatePicker}>
            {date ? new Date(date).toLocaleDateString("en-US") : "Select Due Date"}
          </button>

          {showPicker && (
            <>
              <div aria-label='Open date picker' onClick={openDatePicker} className={styles.modalDateOverlay} />
              <DatePicker date={date} setDate={setDate} />
            </>
          )}
          <input
            type='date'
            name='dueDate'
            value={`${new Date(date).getFullYear()}-${(new Date(date).getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${new Date(date).getDate().toString().padStart(2, "0")}`}
            className={styles.date}
            onChange={() => {}}
          />
          <div className={styles.footerActionButton}>
            <button
              aria-label='Cancle button'
              onClick={() => {
                toggleModal();
                setModalType(null);
              }}
              className={`${styles.footerButtons} ${styles.footerCancle} `}
              type='button'>
              cancle
            </button>
            <button aria-label='Save button' className={` ${styles.footerButtons} ${styles.footerSave} `} type='submit'>
              Save
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default AddCardModal;
