import React from "react";
import { FaPlus } from "react-icons/fa";
import classes from "./AddMoreBtn.module.css";

const AddMoreBtn = ({ onClick = () => {} }) => {
  return (
    <div className={classes?.addMoreBtnContainer} onClick={onClick}>
      <FaPlus color={"var(--text-dark-gray)"} size={12} /> <span>Add More</span>
    </div>
  );
};

export default AddMoreBtn;
