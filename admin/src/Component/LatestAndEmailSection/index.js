import React from "react";
import classes from "./LatestAndEmailSection.module.css";
// import { GoPrimitiveDot } from "react-icons/go";
const LatestAndEmailSection = ({ item }) => {
  return (
    <div className={classes.bullet_main}>
      <div className={classes.email_date_main}>
        <p className={classes.email_para}>
          {/* <GoPrimitiveDot className={classes.bullet_icon} /> {item?.from} */}
        </p>
        <div className={classes.dateTime_main}>
          <p>{item?.date}</p>
          <p>{item?.time}</p>
        </div>
      </div>
      <div className={classes.hr_line}></div>
    </div>
  );
};

export default LatestAndEmailSection;
