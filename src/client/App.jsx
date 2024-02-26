import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, redirect } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Login, { action as loginAction } from "./pages/AccountPages/Login";
import Register, { action as registerAction } from "./pages/AccountPages/Register";
import DashBoard, { loader as dashBoardLoader, action as dashBoardAction } from "./pages/Dashboard/DashBoard";
import HomePageLayout from "./pages/Layout/HomePageLayout";

import LoginContext from "./context/LoginContext";
import { useContext } from "react";
import AnalyticsPage, { loader as anylyticsLoader } from "./pages/AnalyticsPages/AnalyticsPage";
import toastPromice from "./libs/toastPromiseUtil";
import Loading from "./pages/LoadingPage/Loading";
import Settings, { action as settingsAction } from "./pages/SettingsPage/Settings";
import Shared, { loader as sharedCardLoader } from "./pages/sharedPage/Shared";
function App() {
  const { loginState, dispatch } = useContext(LoginContext);
  // console.log("context", loginState.login);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route
          loader={() => {
            return !loginState.login ? redirect("/login", { replace: true }) : null;
          }}
          element={<HomePageLayout />}>
          <Route
            action={({ request, params }) => {
              return dashBoardAction({ request, params, loginState });
            }}
            loader={({ request, params }) => {
              return dashBoardLoader({ request, params, loginState });
            }}
            index
            element={<DashBoard />}
          />
          <Route
            path='/analytics'
            loader={({ request, params }) => {
              return anylyticsLoader({ request, params, loginState });
            }}
            element={<AnalyticsPage />}
          />
          <Route
            action={async ({ request }) => {
              const data = await settingsAction({ request, loginState });
              if (data.status === "success") {
                dispatch({ type: "LOGOUT" });
                return redirect("/login", { replace: true });
              }
              return null;
            }}
            loader={() => {
              return !loginState.login ? redirect("/login", { replace: true }) : null;
            }}
            path='/settings'
            element={<Settings />}
          />
        </Route>
        <Route
          path='/login'
          action={async ({ request, params }) => {
            const responce = await loginAction({ request, params });
            toast.promise(toastPromice(responce), {
              loading: "Creating account",
              success: <b>Logged in!</b>,
              error: <b>Incorrect email/password</b>,
            });
            if (responce.status === "success") {
              dispatch({
                type: "LOGIN",
                payload: {
                  token: responce.token,
                  id: responce.id,
                  Name: responce.Name,
                },
              });
              return redirect("/", { replace: true });
            } else {
              return null;
            }
          }}
          loader={() => {
            if (loginState.login) {
              return redirect("/", { replace: true });
            }
            return null;
          }}
          element={<Login />}
        />
        <Route path='/register' action={registerAction} element={<Register />} />
        <Route loader={sharedCardLoader} path='/:sharedCard' element={<Shared />} />
      </Route>
    )
  );

  return (
    <>
      <Toaster
        position='top-right'
        toastOptions={{
          className: "",
          style: {
            border: "2px solid #48C1B5",
            padding: "16px",
            color: "#27303A",
            backgroundColor: "#f6fff9",
            fontFamily: "Poppins",
            fontWeight: 500,
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

