import React from "react";
import styles from "./Styles.module.css";
import AccImage from "../../components/accountPageComponents/AccImage";
import RegisterForm from "../../components/accountPageComponents/RegisterForm";
import toast from "react-hot-toast";
import fetchUtils from "../../libs/fetchUtils";
import toastPromice from "../../libs/toastPromiseUtil";
import { redirect } from "react-router-dom";
export const action = async ({ request, params }) => {
  const url = "/api/v1/users/register";
  const FormData = await request.formData();
  const formObj = {};
  for (const val of FormData.entries()) {
    formObj[val[0]] = val[1];
  }

  const newRequest = new Request(url, {
    method: "POST",
    body: JSON.stringify(formObj),
    headers: { "Content-Type": "application/json" },
  });

  const data = await fetchUtils(newRequest);
  toast.promise(toastPromice(data.data), {
    loading: "Creating account",
    success: <b>Account Created!</b>,
    error: <b>This account already exists</b>,
  });

  if (data.status === "success") {
    return redirect("/login", { replace: true });
  }
  return null;
};
function Register() {
  return (
    <div className={styles.container}>
      <AccImage />
      <main className={styles.mainContainer}>
        <RegisterForm />
      </main>
    </div>
  );
}

export default Register;
