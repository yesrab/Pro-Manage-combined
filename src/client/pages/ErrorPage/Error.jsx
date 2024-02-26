import { Link, useRouteError } from "react-router-dom";
import styles from "./errorStyles.module.css";
export default function ErrorBoundary() {
  let error = useRouteError();
  console.log(error.message);
  // Uncaught ReferenceError: path is not defined
  return (
    <div className={styles.errorContainer}>
      <h1>Some error has occured!</h1>
      <p> Error message: {error.message}</p>
      <Link to='..'>Go back</Link>
    </div>
  );
}
