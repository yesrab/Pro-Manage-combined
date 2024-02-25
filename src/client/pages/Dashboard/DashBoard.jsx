import React, {
  useReducer,
  useState,
  useContext,
  useEffect,
  Suspense,
} from "react";
import DashBoardHeader from "../../components/Headers/DashBoardHeader";
import styles from "./DashBoardStyles.module.css";
import Backlog from "../../components/dashboardColumns/Backlog";
import Done from "../../components/dashboardColumns/Done";
import InProgress from "../../components/dashboardColumns/InProgress";
import CardsContainerColumn from "../../components/dashboardColumns/CardsContainerColumn";
import ModelWrapper from "../../components/modals/ModalWrapper";
import AddCardModal from "../../components/modals/AddCardModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import LoginContext from "../../context/LoginContext.js";
import fetchUtils from "../../libs/fetchUtils.js";
import { useLoaderData, defer, Await, redirect } from "react-router-dom";
import toast from "react-hot-toast";
import { ColumnLoader } from "../LoadingPage/Loading.jsx";
import toastPromice from "../../libs/toastPromiseUtil.js";
const login = JSON.parse(localStorage.getItem("loginState"));
export const loader = async ({ request, params, loginState }) => {
  const serverURl = "/api/v1/notes/getallnotes";
  const FetchUrl = new URL(serverURl, window.location.origin);
  const url = new URL(request.url);
  const timeframe = url.searchParams.get("timeFrame");
  if (timeframe) {
    FetchUrl.searchParams.set("timeframe", timeframe);
  } else {
    FetchUrl.searchParams.delete("timeframe");
  }
  console.log("dashboard loader fired");
  const time = new Date().toISOString();
  // const login = JSON.parse(localStorage.getItem("loginState"));
  const newRequest = new Request(FetchUrl.toString(), {
    method: "GET",
    url: url,
    headers: {
      "Authorization": `Bearer ${loginState.token}`,
      "X-Client-DateTime": time,
    },
  });
  const data = await fetchUtils(newRequest);

  if (data) {
    return data;
  }
  return null;
};
export const action = async ({ request, params, loginState }) => {
  console.log("request ", request);
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
  console.log("actual data sent:", card);
  const responce = await fetchUtils(newRequest);
  toast.promise(toastPromice(responce), {
    loading: "Creating account",
    success: <b>Added</b>,
    error: <b>some Error occured Please try again later</b>,
  });
  // if (responce.status === "success") {
  //   return redirect(".", { replace: true });
  // }
  return null;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.payload;
    case "DELETE_NOTE":
      return {
        ...state,
        data: state.data.filter((note) => note._id !== action.payload),
      };
    case "CHANGE_SECTION":
      return {
        ...state,
        data: state.data.map((note) => {
          if (note._id === action.payload.id) {
            return {
              ...note,
              section: action.payload.section,
            };
          }
          return note;
        }),
      };
    case "TOGGLE_TODO_CHECK":
      return {
        ...state,
        data: state.data.map((note) => {
          if (note._id === action.payload.noteId) {
            return {
              ...note,
              todos: note.todos.map((todo) => {
                if (todo._id === action.payload.todoId) {
                  return {
                    ...todo,
                    check: !todo.check,
                  };
                }
                return todo;
              }),
            };
          }
          return note;
        }),
      };
    default:
      return state;
  }
};

function Dashboard() {
  const data = useLoaderData();
  const [allNotes, dispatch] = useReducer(reducer, {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [NoteReference, setNoteReference] = useState(null);

  // console.log("reducer state", allNotes);
  useEffect(() => {
    dispatch({ type: "SET_INITIAL_STATE", payload: data });

    console.log("reducer updated");
  }, [data]);

  function openModal(noteID, modal) {
    setNoteReference(noteID);
    setIsModalOpen(true);
    setModalType(modal);
  }

  function toggleModal() {
    setIsModalOpen(!setIsModalOpen);
    setNoteReference(null);
    setModalType(null);
  }

  async function deleteNote() {
    console.log("deleting this note:", NoteReference);
    // const login = JSON.parse(localStorage.getItem("loginState"));
    const serverURl = "/api/v1/notes/getallnotes";
    const newDeleteRequest = new Request(serverURl, {
      method: "DELETE",
      body: JSON.stringify({ noteId: NoteReference }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${login.token}`,
      },
    });
    const responce = await fetchUtils(newDeleteRequest);
    if (responce.status === "success") {
      toast.success("Deleted card");
      dispatch({ type: "DELETE_NOTE", payload: NoteReference });
    } else {
      toast.error("Unable to delete please try again later");
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
      console.log(link);
      navigator.clipboard.writeText(link);
    } else {
      toast.error("error occured please try again later");
    }
  };
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
                    data={allNotes?.data}
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

