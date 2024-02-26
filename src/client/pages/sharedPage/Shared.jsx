import React, { useEffect, Suspense } from "react";
import styles from "./sharedStyles.module.css";
import logo from "../../assets/proManageLogo.svg";
import SharedCard from "../../components/sharedCard/SharedCard";
import fetchUtils from "../../libs/fetchUtils";
import { useLoaderData, defer, Await } from "react-router-dom";
export const loader = async ({ params, request }) => {
  const { sharedCard } = params;
  const URl = `/api/v1/share/${sharedCard}`;
  const getCard = new Request(URl, {
    method: "GET",
  });
  const responcePromise = fetchUtils(getCard);

  return defer({
    responce: responcePromise,
  });
};
function Shared() {
  const { responce } = useLoaderData();
  // console.log(responce);
  useEffect(() => {
    async function checkData() {
      const data = await responce;
    }
    checkData();
  }, []);
  return (
    <div className={styles.container}>
      <header className={styles.head}>
        <img src={logo} />
        Pro Manage
      </header>
      <main className={styles.mainContent}>
        <Suspense fallback={<h1>Loading</h1>}>
          <Await resolve={responce}>
            {(data) => {
              return <SharedCard data={data} />;
            }}
          </Await>
        </Suspense>
      </main>
    </div>
  );
}

export default Shared;
