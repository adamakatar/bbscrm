import React from "react";
import ReactTooltip from "react-tooltip";

import styles from "./tooltip.module.css";

function Tooltip({ icon, children, className, position = "bottom" }) {
  const randomId = Math.ceil(Math.random() * 1000);
  return (
    <div>
      <a
        data-tip
        data-for={`tooltip${randomId}`}
        className={[styles["link"], className].join(" ")}>
        {icon}
      </a>
      <ReactTooltip
        id={`tooltip${randomId}`}
        type="dark"
        effect="solid"
        place={position}>
        {children}
      </ReactTooltip>
    </div>
  );
}

export default Tooltip;
