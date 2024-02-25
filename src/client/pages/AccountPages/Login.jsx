import React from "react";
import AccImage from "../../components/accountPageComponents/AccImage";
import LoginForm from "../../components/accountPageComponents/LoginForm";
import styles from "./Styles.module.css";
import fetchUtils from "../../libs/fetchUtils";
export const action = async ({ request, params }) => {
  const url = "/api/v1/users/login";
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
  const responce = await fetchUtils(newRequest);
  return responce;
};
function Login() {
  return (
    <div className={styles.container}>
      <AccImage />
      <main className={styles.mainContainer}>
        <LoginForm />
      </main>
    </div>
  );
}

export default Login;
