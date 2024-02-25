import React, { useState } from "react";
import { Form, useSubmit } from "react-router-dom";
import componentStyles from "./componentStyles.module.css";
import padlock from "../../assets/padlock.svg";
import mail from "../../assets/mail.svg";
import eye from "../../assets/viewPassword.svg";
import SubmitButtons from "./SubmitButtons";
import useValidator from "../../hooks/useValidator";

function LoginForm() {
  const [visiblity, setVisiblity] = useState(false);
  const submit = useSubmit();
  const { formData, errors, handleChange, handleSubmit } = useValidator(
    {
      Email: "",
      Password: "",
    },
    {
      Email: [
        {
          validator: (value) => (!!value ? !!value.trim() : false),
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
          validator: (value) => (!!value ? value.trim().length >= 6 : false),
          condition: true,
          message: "Password must be at least 6 characters long",
        },
      ],
    },
    submit,
    "post"
  );

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
      <h2>Login</h2>
      <Form onSubmit={formSubmitter} method='POST'>
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
              placeholder='Password'
              name='Password'
              type={visiblity ? "text" : "password"}
            />
            <img
              src={eye}
              onClick={() => setVisiblity(!visiblity)}
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

export default LoginForm;
