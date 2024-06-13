import React from "react";
import classes from "./CustomPhoneInput.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CustomPhoneInput = ({
  //  label = "Contact",
  value,
  setter,
  placeholder = "Phone",
  disabled,
  label,
}) => {
  return (
    <>
      <style>{`
    .react-tel-input .flag-dropdown{
      border:none !important;
    }
   
    `}</style>
      <div>
        {label && (
          <p
            className={[classes.phoneLabel, disabled && classes.labelDisabled]}
          >
            {label}
          </p>
        )}
        <PhoneInput
          inputClass={[classes.phoneInput]}
          containerClass={[classes.phoneInputContainer]}
          placeholder={placeholder}
          enableSearch={true}
          country={"us"}
          // onlyCountries={["us"]}
          // disableDropdown={true}
          value={value}
          onChange={(phone) => {
            setter(phone);
          }}
          disabled={disabled}
          inputStyle={{
            ...(disabled && { background: "var(--disabled-input-color)" }),
          }}
        />
      </div>
    </>
  );
};

export default CustomPhoneInput;
