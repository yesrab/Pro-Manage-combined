import { Link, useRouteError } from "react-router-dom";
import styles from "./errorStyles.module.css";
export default function ErrorShared() {
  let error = useRouteError();
  console.log(error.message);
  // Uncaught ReferenceError: path is not defined
  return (
    <div className={styles.errorContainer}>
      <h1>Some error has occured!</h1>
      <h2>404</h2>
      <h3>The card you are looking for is either private or dose not exist</h3>
      <p>message:{error.message}</p>
      <Link to='/'>Pro Manage</Link>
      <p>click here to go back to the app</p>
    </div>
  );
}
