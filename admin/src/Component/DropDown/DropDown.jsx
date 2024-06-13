import React from "react";
import ReactSelect, { components } from "react-select";
import classes from "./DropDown.module.css";
import PropTypes from "prop-types";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";

export const DropDown = ({
  options,
  label,
  labelTwo,
  customStyle,
  disabled,
  value,
  setter,
  noBorder,
  placeholder,
  isMulti,
  style,
  leftIcon,
  Components,
  labelClassName,
  indicatorColor = "var(--label-color)",
  optionLabel,
  optionValue,
  singleValueColor = "var(--text-color-black)",
  customeClassName = "DropdownOptionContainer",
  isSearchable = true,
  ...props
}) => {
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        {props.isFocused ? (
          <MdOutlineArrowDropUp size={30} color={indicatorColor} />
        ) : (
          <MdOutlineArrowDropDown size={30} color={indicatorColor} />
        )}
      </components.DropdownIndicator>
    );
  };

  const dropDownStyle = {
    control: (styles, { isFocused, isDisabled, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled
        ? "var(--disabled-input-color)"
        : "var(--white-color)",
      padding: "4px 0px 4px 4px",
      borderRadius: "0px",
      color: "var(--text-color-black)",
      boxShadow: "none",
      fontFamily: "Open-Sans-regular",
      fontSize: "16px",
      letterSpacing: "1.4",
      cursor: "pointer",
      border: "none",
      boxShadow: "0px 0 5px 2px #0000000d",
      borderRadius: "10px",
      textTransform: "capitialize",

      ...customStyle,

      ":hover": {
        ...styles[":hover"],
        borderColor: "var(--main-color)",
      },
      ":placeholder": {
        ...styles[":placeholder"],
        color: "var(--text-color-black)",
      },
      ":active": {
        ...styles[":active"],
        borderColor: "var(--main-color)",
      },
    }),

    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "var(--placeholder-color)",
      };
    },

    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isSelected && "var(--main-color)",
        color: isSelected && "var(--white-color)",
        padding: "8px 12px",
        fontFamily: "Open-Sans-regular",
        textTransform: "capitialize",

        ":active": {
          ...styles[":active"],
        },
        ":hover": {
          ...styles[":hover"],
          color: "var(--text-color-black)",
          backgroundColor: "#02528a85",
          cursor: "pointer",
        },
      };
    },

    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: "#D9D9FF",
        borderRadius: "14px",
        padding: "1px 10px",
        fontFamily: "Open-Sans-semiBold",
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: "#fff",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      fontSize: 12,
      color: "#fff",
      ":hover": {
        color: "#000",
      },
    }),
  };
  return (
    <div className={`${[classes.Container].join(" ")}`}>
      <style jsx>{`
        .DropdownOptionContainer__menu {
          margin: 0px;
          border: 0px;
          z-index: 1100 !important;
          box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
        }
        .DropdownOptionContainer__single-value {
          color: ${singleValueColor};
        }
      `}</style>
      {label && (
        <label
          htmlFor={`dropdown${label}`}
          className={`mb-2 ${[
            classes.label,
            labelClassName && labelClassName,
            disabled && classes.disabled,
          ].join(" ")}`}
        >
          {label}
        </label>
      )}

      <div className={`${[classes.dropdownContainer].join(" ")}`}>
        <ReactSelect
          inputId={`dropdown${label}`}
          value={value}
          onChange={(e) => {
            setter(e);
          }}
          className={`${[classes.reactSelect].join(" ")}`}
          isMulti={isMulti}
          isDisabled={disabled}
          placeholder={placeholder}
          isSearchable={isSearchable}
          options={options}
          styles={{ ...dropDownStyle, ...style }}
          isClearable={false}
          classNamePrefix={customeClassName}
          components={{
            IndicatorSeparator: () => null,
            DropdownIndicator: (e) => DropdownIndicator(e),
            ...Components,
          }}
          getOptionLabel={(option) => {
            return optionLabel != "" ? option[optionLabel] : option?.name;
          }}
          getOptionValue={(option) => optionValue != "" ? option[optionValue] : option?.value}
          {...props}
        />
        {leftIcon && <div className={classes.leftIconBox}>{leftIcon}</div>}
      </div>
    </div>
  );
};

DropDown.propTypes = {
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
  labelTwo: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.object.isRequired,
  setter: PropTypes.object,
  disabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  customStyle: PropTypes.object,
  style: PropTypes.object,
  Components: PropTypes.object,
  labelClassName: PropTypes.string,
};

DropDown.defaultProps = {
  placeholder: "sdsad",
  value: "aaaa",
  disabled: false,
  isMulti: false,
  options: [],
  Components: {},
};
