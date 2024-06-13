import React from "react";
import { DiCssTricks } from "react-icons/di";
import { MdDelete } from "react-icons/md";
import AddMoreBtn from "../AddMoreBtn";
import { Input } from "../Input/Input";
import { DropDown } from "../DropDown/DropDown";

import classes from "./AddMultiValueInputWithDropDownContainer.module.css";

const AddMultiValueInputWithDropDownContainer = ({
  title = "Default Title",
  dropDownoptions = [],
  dropDownValueKey = "label",
  inputValueKey = "value",
  inputValue,
  inputSetter,
  arrayValue,
  arraySetter,
  inputPlaceholder = "Enter Text",
  dropDownPlaceholder = "select value",
  type = "text",
}) => {
  return (
    <div className={classes?.mainContainer}>
      <div className={[classes?.inputAndAddBtnContainer].join(" ")}>
        <span className={classes?.titleText}>{title}</span>
        <AddMoreBtn
          onClick={() => {
            if (inputValue !== "") {
              arraySetter((pre) => [...pre, inputValue]);
              inputSetter({
                [dropDownValueKey]: "",
                [inputValueKey]: "",
              });
            }
          }}
        />
      </div>
      <div className={classes?.inputSection}>
        <DropDown
          setter={(item) => {
            inputSetter({
              ...inputValue,
              [dropDownValueKey]: item?.value,
            });
          }}
          value={
            inputValue[dropDownValueKey] !== ""
              ? {
                  label: inputValue[dropDownValueKey],
                  value: inputValue[dropDownValueKey],
                }
              : ""
          }
          placeholder={dropDownPlaceholder}
          options={dropDownoptions}
          optionLabel={"label"}
          optionValue={"value"}
        />
        <Input
          setter={(value) => {
            inputSetter({
              ...inputValue,
              [inputValueKey]: value,
            });
          }}
          value={inputValue[inputValueKey]}
          placeholder={inputPlaceholder}
          type={type}
        />
      </div>

      {arrayValue.map((item, index) => (
        <div
          className={[classes.bulletContainer].join(" ")}
          key={`${index} busHighlight`}>
          <span
            className={classes?.keySpan}>{`${item[dropDownValueKey]} :`}</span>
          <span className={classes?.valueSpan}>{item[inputValueKey]}</span>
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

export default AddMultiValueInputWithDropDownContainer;
