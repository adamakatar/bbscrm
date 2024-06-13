import React from "react";
import classes from "./noData.module.css";
import { ImSearch } from "react-icons/im";

function NoData({ text = "No Data Found", className }) {
  return (
    <div
      className={[classes.noDataContainer, className && className].join(" ")}>
      <ImSearch size={60} color={"var(--dashboard-main-color)"} />
      <p>{text}</p>
    </div>
  );
}

export default NoData;
