import React from "react";
import { DiCssTricks } from "react-icons/di";
import { MdDelete } from "react-icons/md";
import AddMoreBtn from "../AddMoreBtn";
import { Input } from "../Input/Input";
import classes from "./AddMultiValueInputContainer.module.css";

const AddMultiValueInputContainer = ({
  title = "Default Title",
  inputValue,
  inputSetter,
  arrayValue,
  arraySetter,
  placeholder = "Enter Text",
  type = "text",
  subDelete = undefined,
  autoFocus,
}) => {
  return (
    <div className={classes?.mainContainer}>
      <div
        className={[
          title
            ? classes?.inputAndAddBtnContainer
            : classes?.inputAndAddBtnContainerWithoutTitle,
        ].join(" ")}>
        <span className={classes?.titleText}>{title}</span>
        <AddMoreBtn
          onClick={() => {
            if (inputValue !== "") {
              arraySetter((pre) => [...pre, inputValue]);
              inputSetter("");
            }
          }}
        />
      </div>
      <Input
        autoFocus={autoFocus}
        setter={inputSetter}
        value={inputValue}
        placeholder={placeholder}
        type={type}
      />
      {arrayValue.map((item, index) => (
        <div
          className={[classes.bulletContainer].join(" ")}
          key={`${index} busHighlight`}>
          <DiCssTricks color={"var(--dashboard-main-color)"} size={12} />
          <span>{item}</span>
          <MdDelete
            color={"var(--dashboard-main-color)"}
            size={20}
            onClick={() => {
              if (subDelete !== undefined) {
                subDelete(index);
              } else {
                let newArray = [...arrayValue];
                newArray.splice(index, 1);
                arraySetter(newArray);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default AddMultiValueInputContainer;
