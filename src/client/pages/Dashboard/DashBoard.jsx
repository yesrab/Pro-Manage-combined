import React, { useReducer, useState, useContext, useEffect, Suspense } from "react";
import DashBoardHeader from "../../components/Headers/DashBoardHeader";
import styles from "./DashBoardStyles.module.css";
import CardsContainerColumn from "../../components/dashboardColumns/CardsContainerColumn";
import ModelWrapper from "../../components/modals/ModalWrapper";
import AddCardModal from "../../components/modals/AddCardModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import LoginContext from "../../context/LoginContext.js";
import fetchUtils from "../../libs/fetchUtils.js";
import { useLoaderData, Await, redirect, defer } from "react-router-dom";
import toast from "react-hot-toast";
import { ColumnLoader } from "../LoadingPage/Loading.jsx";
import toastPromice from "../../libs/toastPromiseUtil.js";
const login = JSON.parse(localStorage.getItem("loginState"));
export const loader = async ({ request, params, loginState }) => {
  if (!loginState.login) {
    return redirect("/login", { replace: true });
  }
  const serverURl = "/api/v1/notes/getallnotes";
  const FetchUrl = new URL(serverURl, window.location.origin);
  const url = new URL(request.url);
  const timeframe = url.searchParams.get("timeFrame");
  if (timeframe) {
    FetchUrl.searchParams.set("timeframe", timeframe);
  } else {
    FetchUrl.searchParams.set("timeframe", "This Week");
  }

  const time = new Date().toISOString();
  const newRequest = new Request(FetchUrl.toString(), {
    method: "GET",
    url: url,
    headers: {
      "Authorization": `Bearer ${loginState.token}`,
      "X-Client-DateTime": time,
    },
  });

  const data = fetchUtils(newRequest);

  if (data) {
    return defer({ data: data });
  }
  return null;
};
export const action = async ({ request, params, loginState }) => {
  const card = await request.json();
  const url = "/api/v1/notes/getallnotes";
  const newRequest = new Request(url, {
    method: request.method,
    body: JSON.stringify(card),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${loginState.token}`,
    },
  });
  const responce = await fetchUtils(newRequest);
  toast.promise(toastPromice(responce), {
    loading: "Creating account",
    success: <b>{card.noteId ? "Edited" : "created!"}</b>,
    error: <b>some Error occured Please try again later</b>,
  });
  return null;
};

const reducer = (state, action) => {
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
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.payload;
    case "DELETE_NOTE":
      const { noteId, section } = action.payload;
      return {
        ...state,
        [getSectionName(section)]: state[getSectionName(section)].filter((note) => note._id !== noteId),
      };
    case "CHANGE_SECTION":
      const { oldSection, newSection, note, id } = action.payload;
      const oldSectionArray = [...state[oldSection]];
      const updatedOldSection = oldSectionArray.filter((n) => n._id !== note._id);
      return {
        ...state,
        [newSection]: [...state[newSection], note],
        [oldSection]: updatedOldSection,
      };
    case "TOGGLE_TODO_CHECK":
      const toggleNoteArray = [...state[getSectionName(action.payload.section)]];
      const updatedNoteArray = toggleNoteArray.map((note) => {
        if (note._id === action.payload.noteId) {
          return {
            ...note,
            todos: note.todos.map((task) => {
              if (task._id === action.payload.todoId) {
                return {
                  ...task,
                  check: !task.check,
                };
              }
              return task;
            }),
          };
        }
        return note;
      });
      const newState = { ...state, [getSectionName(action.payload.section)]: [...updatedNoteArray] };
      return newState;
    default:
      return state;
  }
};
function Dashboard() {
  const { data } = useLoaderData();
  const [allNotes, dispatch] = useReducer(reducer, {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [NoteReference, setNoteReference] = useState(null);

  useEffect(() => {
    async function setInitial() {
      dispatch({ type: "SET_INITIAL_STATE", payload: await data });
    }
    setInitial();
  }, [data]);

  function openModal(noteID, modal, section) {
    if (noteID && section) {
      setNoteReference({ id: noteID, section });
    } else {
      setNoteReference(null);
    }
    setIsModalOpen(true);
    setModalType(modal);
  }

  function toggleModal() {
    setIsModalOpen(!setIsModalOpen);
    setNoteReference(null);
    setModalType(null);
  }

  async function deleteNote() {
    const serverURl = "/api/v1/notes/getallnotes";
    const newDeleteRequest = new Request(serverURl, {
      method: "DELETE",
      body: JSON.stringify({ noteId: NoteReference.id }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${login.token}`,
      },
    });
    const responce = await fetchUtils(newDeleteRequest);
    toast.promise(toastPromice(responce), {
      loading: "syncing details",
      success: <b>Deleted card</b>,
      error: <b>Unable to delete please try again later</b>,
    });
    if (responce.status === "success") {
      dispatch({ type: "DELETE_NOTE", payload: { noteId: NoteReference.id, section: NoteReference.section } });
    }
    setIsModalOpen(false);
    setNoteReference(null);
  }
  const { loginState, dispatch: contextDispatch } = useContext(LoginContext);

  const shareNote = async (noteId) => {
    const url = "/api/v1/share/Visibility";
    const requestBody = {
      noteId,
    };
    const newShareRequest = new Request(url, {
      method: "PATCH",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${login.token}`,
      },
    });
    const responce = await fetchUtils(newShareRequest);
    if (responce.status === "success") {
      toast("Link Copied");
      const link = `${window.location.origin}/${noteId}`;
      navigator.clipboard.writeText(link);
    } else {
      toast.error("error occured please try again later");
    }
  };
  // console.log("all notes", allNotes);
  const allColumns = ["Backlog", "To Do", "In progress", "Done"];
  return (
    <div className={styles.dashboardContainer}>
      {isModalOpen ? (
        <ModelWrapper toggleModal={toggleModal} open={isModalOpen}>
          {modalType === "addCard" ? (
            <AddCardModal
              allNotes={allNotes}
              NoteReference={NoteReference}
              setModalType={setModalType}
              toggleModal={toggleModal}
            />
          ) : modalType === "delete" || modalType === "logout" ? (
            <ConfirmationModal
              toggleModal={toggleModal}
              deleteNote={deleteNote}
              deletionId={NoteReference}
              type={modalType}
            />
          ) : null}
        </ModelWrapper>
      ) : null}
      <DashBoardHeader name={loginState.Name || "error"} />
      <main className={styles.dashboardColumnsContainer}>
        {allColumns.map((item, key) => (
          <div key={key} className={styles.columns}>
            <Suspense fallback={<ColumnLoader />}>
              <Await resolve={data}>
                {(data) => (
                  <CardsContainerColumn
                    shareNote={shareNote}
                    origin={item}
                    openModal={openModal}
                    setModalType={setModalType}
                    dispatch={dispatch}
                    data={
                      allNotes && item === "To Do"
                        ? allNotes.todoNotes
                        : item === "Backlog"
                        ? allNotes.backlogNotes
                        : item === "In progress"
                        ? allNotes.progressNotes
                        : allNotes.doneNotes
                    }
                  />
                )}
              </Await>
            </Suspense>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Dashboard;

