import React from "react";

function Priority({ tag }) {
  const color = tag === "HIGH" ? "#FF2473" : tag === "LOW" ? "#63C05B" : "#18B0FF";

  const contaierStyles = {
    display: "flex",
    gap: "3%",
    color: color,
    alignItems: "center",
    flexGrow: 1,
  };

  const tagStyle = {
    color: "#707070",
    fontSize: "12pxs",
  };
  const dotStyle = {
    fontSize: "2.5em",
  };
  return (
    <span style={contaierStyles}>
      <span style={dotStyle}>&#x2022;</span>
      <p style={tagStyle}>{tag + " PRIORITY"}</p>
    </span>
  );
}

export default Priority;
