import React, { useState } from "react";
import { Form, useSubmit } from "react-router-dom";
import componentStyles from "./componentStyles.module.css";
import profile from "../../assets/profile.svg";
import padlock from "../../assets/padlock.svg";
import mail from "../../assets/mail.svg";
import eye from "../../assets/viewPassword.svg";
import SubmitButtons from "./SubmitButtons";
import useValidator from "../../hooks/useValidator";
function RegisterForm() {
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const submit = useSubmit();
  const { formData, errors, handleChange, handleSubmit } = useValidator(
    {
      Name: "",
      Email: "",
      Password: "",
      confirmPassword: "",
    },
    {
      Name: [
        {
          validator: (value) => !!value.trim(),
          condition: true,
          message: "Name is required",
        },
      ],
      Email: [
        {
          validator: (value) => !!value.trim(),
          condition: true,
          message: "Email is required",
        },
        {
          validator: (value) => /\S+@\S+\.\S+/.test(value),
          condition: true,
          message: "Email is invalid",
        },
      ],
      Password: [
        {
          validator: (value) => value.trim().length >= 6,
          condition: true,
          message: "Password must be at least 6 characters long",
        },
      ],
      confirmPassword: [
        {
          validator: (value) => value === formData.Password,
          condition: true,
          message: "Passwords do not match",
        },
      ],
    },
    submit,
    "post"
  );

  const toggleVisiblity = (field) => {
    setVisibility({
      ...visibility,
      [field]: !visibility[field],
    });
  };

  const formSubmitter = (e) => {
    const canSubmit = handleSubmit(e);
    if (canSubmit) {
      const formData = new FormData(e.target);
      const formObj = {};
      for (const val of formData.entries()) {
        formObj[val[0]] = val[1];
      }
      submit(formData, { method: "POST" });
    }
  };

  return (
    <div className={componentStyles.formContainer}>
      <h2>Register</h2>
      <Form onSubmit={formSubmitter} method='POST'>
        <div className={componentStyles.formElements}>
          <div className={componentStyles.inputContainer}>
            <img src={profile} alt='profileIcon' />
            <input
              onChange={handleChange}
              placeholder='Name'
              name='Name'
              type='text'
            />
          </div>
          {errors.Name && (
            <p className={componentStyles.formErrorMessage}>{errors.Name}</p>
          )}
        </div>
        <div className={componentStyles.formElements}>
          <div className={componentStyles.inputContainer}>
            <img src={mail} alt='mailIcon' />
            <input
              onChange={handleChange}
              placeholder='Email'
              name='Email'
              type='email'
            />
          </div>
          {errors.Email && (
            <p className={componentStyles.formErrorMessage}>{errors.Email}</p>
          )}
        </div>
        <div className={componentStyles.formElements}>
          <div className={componentStyles.inputContainer}>
            <img src={padlock} alt='mailIcon' />
            <input
              onChange={handleChange}
              placeholder='Confirm Password'
              name='confirmPassword'
              type={visibility.confirmPassword ? "text" : "password"}
            />
            <img
              src={eye}
              onClick={() => toggleVisiblity("confirmPassword")}
              alt='ConfirmPasswordVisiblity'
            />
          </div>
          {errors.confirmPassword && (
            <p className={componentStyles.formErrorMessage}>
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <div className={componentStyles.formElements}>
          <div className={componentStyles.inputContainer}>
            <img src={padlock} alt='lockIcon' />
            <input
              onChange={handleChange}
              placeholder='Password'
              name='Password'
              type={visibility.password ? "text" : "password"}
            />
            <img
              src={eye}
              onClick={() => toggleVisiblity("password")}
              alt='passwordVisiblity'
            />
          </div>
          {errors.Password && (
            <p className={componentStyles.formErrorMessage}>
              {errors.Password}
            </p>
          )}
        </div>

        <SubmitButtons />
      </Form>
    </div>
  );
}

export default RegisterForm;
