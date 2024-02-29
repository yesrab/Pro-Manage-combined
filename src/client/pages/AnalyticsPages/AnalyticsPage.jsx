import React, { Suspense } from "react";
import styles from "./AnalyticStyles.module.css";
import fetchUtils from "../../libs/fetchUtils";
import { Await, defer, useLoaderData } from "react-router-dom";
import Loading from "../LoadingPage/Loading";
export const loader = async ({ request, params, loginState }) => {
  const url = "/api/v1/notes/analytics";
  const time = new Date().toISOString();
  const analyticsRequest = new Request(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${loginState.token}`,
      "X-Client-DateTime": time,
    },
  });

  const analyticsPromise = fetchUtils(analyticsRequest);
  return defer({ analyticsData: analyticsPromise });
};

function AnalyticsPage() {
  const loaderData = useLoaderData();

  return (
    <div className={styles.Container}>
      <header className={styles.anyliticsHeader}>Analytics</header>
      <Suspense fallback={<Loading />}>
        <Await resolve={loaderData.analyticsData}>
          {(data) => {
            return (
              <div className={styles.dataContainer}>
                <table>
                  <tbody>
                    <tr>
                      <td className={styles.name}>
                        <span>&bull;</span> Backlog Tasks
                      </td>
                      <td>{data?.anyliticsDataPerCard?.backlog || "0"}</td>
                    </tr>
                    <tr>
                      <td className={styles.name}>
                        <span>&bull;</span> To-do Tasks
                      </td>
                      <td>{data?.anyliticsDataPerCard?.todo || "0"}</td>
                    </tr>
                    <tr>
                      <td className={styles.name}>
                        <span>&bull;</span>
                        In-Progress Tasks
                      </td>
                      <td>{data?.anyliticsDataPerCard?.inProgress || "0"}</td>
                    </tr>
                    <tr>
                      <td className={styles.name}>
                        <span>&bull;</span>
                        Completed Tasks
                      </td>
                      <td>{data?.anyliticsDataPerCard?.done || "0"}</td>
                    </tr>
                  </tbody>
                </table>
                <table>
                  <tbody>
                    <tr>
                      <td className={styles.name}>
                        <span>&bull;</span> Low Priority
                      </td>
                      <td>{data?.anyliticsDataPerCard?.LOW || "0"}</td>
                    </tr>
                    <tr>
                      <td className={styles.name}>
                        <span>&bull;</span> Moderate Priority
                      </td>
                      <td>{data?.anyliticsDataPerCard?.MODERATE || "0"}</td>
                    </tr>
                    <tr>
                      <td className={styles.name}>
                        <span>&bull;</span>
                        High Priority
                      </td>
                      <td>{data?.anyliticsDataPerCard?.HIGH || "0"}</td>
                    </tr>
                    <tr>
                      <td className={styles.name}>
                        <span>&bull;</span>
                        Due Date Tasks
                      </td>
                      <td>{data?.anyliticsDataPerCard?.dueDateCardCount || "0"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

export default AnalyticsPage;
