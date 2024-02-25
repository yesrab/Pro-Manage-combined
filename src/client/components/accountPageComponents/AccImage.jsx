import React from "react";
import Astronaut from "../../assets/Astronaut.svg";
import componentStyles from "./componentStyles.module.css";
function AccImage() {
  return (
    <div className={componentStyles.containerWelcome}>
      <img className={componentStyles.Logo} src={Astronaut} alt='Logo' />
      <div className={componentStyles.WelcomeMessage}>
        <h2>Welcome aboard my friend</h2>
        <p>just a couple of clicks and we start</p>
      </div>
    </div>
  );
}

export default AccImage;
