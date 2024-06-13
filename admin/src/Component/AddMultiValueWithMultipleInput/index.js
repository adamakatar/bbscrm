import React from "react";
import { MdDelete } from "react-icons/md";
import AddMoreBtn from "../AddMoreBtn";
import { Input } from "../Input/Input";

import classes from "./AddMultiValueWithMultipleInput.module.css";

const AddMultiValueWithMultipleInput = ({
  title = "Default Title",
  firstValueKey = "title",
  secondValueKey = "description",
  inputValue,
  inputSetter,
  arrayValue = [],
  arraySetter,
  firstPlaceholder = "Enter Text",
  secondPlaceholder = "Enter Text",
  type = "text",
  hideAddBtn = false,
  firstInputWidth = 49,
}) => {
  return (
    <div className={classes?.mainContainer}>
      <div className={[classes?.inputAndAddBtnContainer].join(" ")}>
        <span className={classes?.titleText}>{title}</span>
        {!hideAddBtn && (
          <AddMoreBtn
            onClick={() => {
              if (
                inputValue[firstValueKey] !== "" &&
                inputValue[secondValueKey] !== ""
              ) {
                arraySetter((pre) => [...pre, inputValue]);
                inputSetter({
                  [firstValueKey]: "",
                  [secondValueKey]: "",
                });
              }
            }}
          />
        )}
      </div>
      <div className={classes?.inputSection}>
        <Input
          setter={(value) => {
            inputSetter({
              ...inputValue,
              [firstValueKey]: value,
            });
          }}
          value={inputValue[firstValueKey]}
          placeholder={firstPlaceholder}
          type={type}
          parentCustomStyle={{
            width: `${firstInputWidth}%`,
          }}
        />
        <Input
          setter={(value) => {
            inputSetter({
              ...inputValue,
              [secondValueKey]: value,
            });
          }}
          value={inputValue[secondValueKey]}
          placeholder={secondPlaceholder}
          type={type}
          parentCustomStyle={{
            width: `${98 - firstInputWidth}%`,
          }}
        />
      </div>

      {arrayValue.map((item, index) => (
        <div
          className={[classes.bulletContainer].join(" ")}
          key={`${index} busHighlight`}
        >
          <span className={classes?.keySpan}>{`${item[firstValueKey]} :`}</span>
          <span className={classes?.valueSpan}>{item[secondValueKey]}</span>
          <MdDelete
            color={"var(--dashboard-main-color)"}
            size={20}
            onClick={() => {
              let newArray = [...arrayValue];
              newArray.splice(index, 1);
              arraySetter(newArray);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default AddMultiValueWithMultipleInput;
