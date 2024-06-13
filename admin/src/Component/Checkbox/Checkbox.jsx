import React from "react";
import classes from "./Checkbox.module.css";
import PropTypes from "prop-types";

export const Checkbox = ({ value, setValue, label, disabled, labelStyle }) => {
  const checkValueTypeArray = Array.isArray(value);
  const isChecked = checkValueTypeArray
    ? value?.findIndex((findValue) => findValue == label)
    : value == label
    ? true
    : false;
  
  const HandleClick = () => {
    let newArray = [];
    if (checkValueTypeArray) {
      newArray = value?.slice();
      if (isChecked !== -1) {
        newArray.splice(isChecked, 1);
      } else {
        newArray.push(label);
      }
    } else {
      newArray = isChecked ? "" : label;
    }
    setValue(newArray);
  };
  return (
    <>
      <style jsx="true">{`
        .${classes.container} input:disabled ~ .${classes.checkmark} {
          border: ${checkValueTypeArray && isChecked !== -1
              ? 0
              : checkValueTypeArray == false && isChecked == true
              ? 0
              : 2}px
            solid #4d4d4d;
          background-color: ${checkValueTypeArray && isChecked !== -1
            ? "green"
            : checkValueTypeArray == false && isChecked == true
            ? "green"
            : "transparent"};
        }
      `}</style>

      <div className={`my-2 ${classes.checkboxWithLabel}`}>
        <div className={`${classes.container}`}>
          <input
            type="checkbox"
            checked={
              checkValueTypeArray && isChecked !== -1
                ? "checked"
                : checkValueTypeArray == false && isChecked == true && "checked"
            }
            disabled={disabled}
            id={`checkbox${label}`}
          />
          <span
            className={classes.checkmark}
            onClick={() => disabled !== true && HandleClick()}
          ></span>
        </div>
        {label && (
          <label
            htmlFor={`checkbox${label}`}
            className={` ${
              isChecked !== -1 && disabled == false
                ? classes.labelChecked
                : disabled == true
                ? classes.labelDisabled
                : classes.label
            }`}
            style={{
              ...labelStyle,
            }}
          >
            <span>{label}</span>
          </label>
        )}
      </div>
    </>
  );
};

Checkbox.propTypes = {
  value: PropTypes.array,
  setValue: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  labelStyle: PropTypes.object,
};
Checkbox.defaultProps = {
  value: [],
  disabled: false,
  label: null,
};
