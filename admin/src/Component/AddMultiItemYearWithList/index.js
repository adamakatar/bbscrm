import React, { useEffect } from "react";
import { DiCssTricks } from "react-icons/di";
import { MdDelete } from "react-icons/md";
import AddMoreBtn from "../AddMoreBtn";
import { Input } from "../Input/Input";
import { DropDown } from "../DropDown/DropDown";

import classes from "./addMultiItemYearWithList.module.css";
import AddMultiValueInputContainer from "../AddMultiValueInputContainer";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import { toast } from "react-toastify";

// {year:number,features:[string]}

const AddMultiItemYearWithList = ({
  title = "Default Title",
  // dropDownoptions = [{ label: "2022" }, { label: "2021" }, { label: "2020" }],
  // dropDownValueKey = "label",
  // inputValueKey = "value",
  dropValue,
  dropSetter,
  arrayValue,
  arraySetter,
  inputPlaceholder = "Enter Text",
  dropDownPlaceholder = "select Year",
  type = "text",
}) => {
  const [yearsInputData, setYearsInputData] = useState(
    arrayValue ? arrayValue?.map((item) => ({ ...item, value: null })) : []
  );
  const [date, setDate] = useState();

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
            const exx = arrayValue?.find((item) => item?.year == date);
            if (exx) {
              toast.warn("Sorry! you can not add the same year twice");
              return;
            }
            if (date !== "") {
              arraySetter((pre) => [...pre, { year: date?.$y, features: [] }]);
              setYearsInputData((pre) => [...pre, { year: date?.$y, value: undefined }]);
            }
          }}
        />
      </div>
      <div className={classes?.mainDropDownContainer}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <style>
            {`
            .MuiFormControl-root {
            width: 100%;
          }
          .MuiFormLabel-root {
            color: var(--placeholder-color) !important;
          }
          .MuiOutlinedInput-notchedOutline {
            box-shadow: 0px 0 5px 2px #0000000d;
            border: none;
            border-radius: 10px;
          }
             `}
          </style>
          <DatePicker
            views={["year"]}
            // label="Year only"
            value={date}
            onChange={(newValue) => {
              setDate(newValue)
            }}
            renderInput={(params) => (
              <TextField {...params} InputLabelProps={{ shrink: false }} />
            )}
          />
        </LocalizationProvider>
      </div>
      <Row className={`g-0 ${classes?.rowContainer}`}>
        {arrayValue?.map((item, index) => {
          return (
            <Col
              lg={4}
              md={6}
              sm={12}
              style={{
                paddingRight: 10,
                marginTop: 10,
              }}>
              <AddMultiValueInputContainer
                title={item?.year}
                inputValue={yearsInputData[index]?.value}
                inputSetter={(value) => {
                  const newValueData = [...yearsInputData];
                  newValueData[index].value = value;
                  setYearsInputData(newValueData);
                }}
                arrayValue={item?.features}
                arraySetter={() => {
                  let newArrayValue = [...arrayValue];
                  newArrayValue[index].features.push(
                    yearsInputData[index].value
                  );
                  arraySetter(newArrayValue);
                  const newValueData = [...yearsInputData];
                  newValueData[index].value = "";
                  setYearsInputData(newValueData);
                }}
                subDelete={(innerIndex) => {
                  let newArrayValue = [...arrayValue];
                  newArrayValue[index].features.splice(innerIndex, 1);
                  arraySetter(newArrayValue);
                }}
                placeholder={`Add ${item?.year} Recent Improvement`}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default AddMultiItemYearWithList;
