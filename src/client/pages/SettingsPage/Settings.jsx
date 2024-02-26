import React, { useEffect, useState } from "react";
import styles from "./settingsStyles.module.css";
import { Form, useSubmit } from "react-router-dom";
import profile from "../../assets/profile.svg";
import padlock from "../../assets/padlock.svg";
import eye from "../../assets/viewPassword.svg";
import useValidator from "../../hooks/useValidator";
import toast from "react-hot-toast";
import fetchUtils from "../../libs/fetchUtils";
import toastPromice from "../../libs/toastPromiseUtil";
export const action = async ({ request, loginState }) => {
  console.log("action triggred");
  const FormData = await request.formData();
  const formObj = {};
  for (const val of FormData.entries()) {
    formObj[val[0]] = val[1];
  }
  const url = "/api/v1/users/reset";
  const resetRequest = new Request(url, {
    method: "PUT",
    body: JSON.stringify(formObj),
    headers: {
      "Authorization": `Bearer ${loginState.token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await fetchUtils(resetRequest);
  toast.promise(toastPromice(data), {
    loading: "saving changes",
    success: <b>details Updated</b>,
    error: <b>some Error occured Please try again later</b>,
  });

  return data;
};
function Settings() {
  const [visibility, setVisibility] = useState({
    password: false,
    OldPassword: false,
  });
  const toggleVisiblity = (field) => {
    setVisibility({
      ...visibility,
      [field]: !visibility[field],
    });
  };
  const finitialState = {};

  const fvalidationRules = {};
  const [initialState, setInitialState] = useState(finitialState);
  const [validationRules, setValidationRules] = useState(fvalidationRules);
  const { formData, errors, handleChange, handleSubmit } = useValidator(
    initialState,
    validationRules
  );
  const submitter = useSubmit();
  const formSubmiter = (e) => {
    if (handleSubmit(e)) {
      const formData = new FormData(e.target);
      const formObj = {};
      for (const val of formData.entries()) {
        formObj[val[0]] = val[1];
      }
      const checkForm = (formObj) => {
        return Object.values(formObj).some(
          (value) => typeof value === "string" && value.trim() !== ""
        );
      };
      const isEmpty = checkForm(formObj);
      if (isEmpty) {
        submitter(formData, { method: "put" });
      } else {
        toast.error("Please Atleast fill name or passowrd combination");
      }
    }
  };
  useEffect(() => {
    const oldPasswordTrimmed = formData.oldPassword?.trim();
    const passwordTrimmed = formData.password?.trim();
    if (
      (oldPasswordTrimmed && !passwordTrimmed) ||
      (!oldPasswordTrimmed && passwordTrimmed)
    ) {
      setInitialState((prevState) => ({
        ...prevState,
        oldPassword: "",
        password: "",
      }));
      setValidationRules((prev) => ({
        ...prev,
        oldPassword: [
          {
            validator: (value) => !!value?.trim(),
            condition: true,
            message: "Please enter old password",
          },
        ],
        password: [
          {
            validator: (value) => !!value?.trim(),
            condition: true,
            message: "Please enter new password",
          },
        ],
      }));
    } else if (oldPasswordTrimmed && passwordTrimmed) {
      setInitialState((prevState) => ({
        ...prevState,
        oldPassword: "",
        password: "",
      }));
      setValidationRules((prev) => ({
        ...prev,
        oldPassword: [
          {
            validator: (value) => value.length >= 6,
            condition: true,
            message: "Old password must be at least 6 characters long",
          },
        ],
        password: [
          {
            validator: (value) => value.length >= 6,
            condition: true,
            message: "New password must be at least 6 characters long",
          },
        ],
      }));
    }

    if (!!formData.name?.trim()) {
      setInitialState((prev) => ({
        ...prev,
        name: "",
      }));

      setValidationRules((prev) => ({
        ...prev,
        name: [
          {
            validator: (value) => !!value?.trim(),
            condition: true,
            message: "Name is required",
          },
        ],
      }));
    }
  }, [formData]);
  return (
    <div className={styles.container}>
      <header>
        <h3 className={styles.hedding}>Settings</h3>
      </header>
      <form onSubmit={formSubmiter} className={styles.updateForm}>
        <div className={styles.inputFields}>
          <img src={profile} />
          <input
            onChange={handleChange}
            name='name'
            placeholder='Name'
            type='text'
          />
        </div>
        {errors.name && <p className={styles.validation}>{errors.name}</p>}
        <div className={styles.inputFields}>
          <img src={padlock} />
          <input
            onChange={handleChange}
            name='oldPassword'
            type={visibility.OldPassword ? "text" : "password"}
            placeholder='Old Password'
          />
          <img onClick={() => toggleVisiblity("OldPassword")} src={eye} />
        </div>
        {errors.oldPassword && (
          <p className={styles.validation}>{errors.oldPassword}</p>
        )}
        <div className={styles.inputFields}>
          <img src={padlock} />
          <input
            onChange={handleChange}
            name='password'
            type={visibility.password ? "text" : "password"}
            placeholder='Password'
          />
          <img onClick={() => toggleVisiblity("password")} src={eye} />
        </div>
        {errors.password && (
          <p className={styles.validation}>{errors.password}</p>
        )}

        <button>Update</button>
      </form>
    </div>
  );
}

export default Settings;
