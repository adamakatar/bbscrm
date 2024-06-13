import React from "react";
import classes from "./AddTaskModal.module.css";
import ModalSkeleton from "../ModalSkeleton";
import { Input } from "../../Component/Input/Input";
import { TextArea } from "../../Component/TextArea";
import { Button } from "../../Component/Button/Button";
import { useState } from "react";
import { DropDown } from "../../Component/DropDown/DropDown";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const AddTaskModal = ({
  show,
  setShow,
  handleSubmit,
  type = "task",
  data,
  optionsArrayBroker = [],
  optionsArrayStages = [],
  isLoading = false,
  adminUsers,
}) => {
  const [taskName, setTaskName] = useState(data?.title || "");
  const [assignTo, setAssignTo] = useState(data?.assignedTo || "");
  const [description, setDescription] = useState(data?.description || "");
  const [deadlineDate, setDeadlineDate] = useState(dayjs(data?.deadlineDate));
  const [status, setStatus] = useState("");
  const [noOfDays, setNoOfDays] = useState(data?.noOfDays || "");

  const HandleSubmitData = () => {
    if (type == "task") {
      const newAssignToArray =
        assignTo !== "" &&
        assignTo?.map((item, index) => {
          return item?._id;
        });
      handleSubmit({
        title: taskName,
        assignedTo: newAssignToArray,
        description,
        type,
        deadlineDate,
        ...(data == null && { stageId: status?._id }),
      });
    } else {
      handleSubmit({
        title: taskName,
        description,
        type,
        ...(type == "template" && { noOfDays: Number(noOfDays) }),
      });
    }
  };
  return (
    <>
      <style>
        {`
        .MuiFormControl-root{
    width: 100%;
        }
                  .MuiFormLabel-root {
            color: var(--placeholder-color) !important;
          }

          .MuiOutlinedInput-notchedOutline {
            box-shadow: 0px 0 5px 2px #0000000d;
    border-width: 0;
            border: none;
                          border-radius: 10px;
    box-shadow: 0px 0 5px 2px #0000000d;
          }
        
        `}
      </style>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        borderRadius="20px"
        width="734px"
        borderLine={false}
        header={data == null ? "Add Task" : "Edit Task"}>
        <div className={classes.add_task_main}>
          <div className={classes.input_main}>
            <Input
              setter={() => {}}
              value={data?.project}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Project Name"}
            />
          </div>
  
          <div className={classes.input_main}>
            <Input
              setter={setTaskName}
              value={taskName}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Task Name"}
            />
          </div>
          {type == "task" && (
            <>
              {data == null && (
                <div className={classes.input_main}>
                  <DropDown
                    setter={setStatus}
                    value={status}
                    placeholder={"Select Task Status"}
                    options={optionsArrayStages}
                    optionLabel={"name"}
                    optionValue={"name"}
                  />
                </div>
              )}
              <div className={classes.input_main}>
                <DropDown
                  isMulti={true}
                  setter={setAssignTo}
                  value={assignTo}
                  placeholder={"Select Assigned Users"}
                  options={[...optionsArrayBroker, ...adminUsers]}
                  optionLabel={"label"}
                  optionValue={"label"}
                  getOptionLabel={(e) =>
                    `${e?.firstName} ${e?.lastName} (${e?.role[0]})`
                  }
                  getOptionValue={(e) =>
                    `${e?.firstName} ${e?.lastName} (${e?.role[0]})`
                  }
                />
              </div>
              <div className={classes.input_main}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={deadlineDate ? "" : "Deadline"}
                    value={deadlineDate}
                    onChange={(newValue) => {
                      setDeadlineDate(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        InputLabelProps={{ shrink: false }}
                        onKeyDown={(e) => e.preventDefault()}
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </>
          )}

          <div className={classes.input_main}>
            <TextArea
              setter={setDescription}
              value={description}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Description"}
            />
          </div>
          {type == "template" && (
            <div className={classes.input_main}>
              <Input
                setter={setNoOfDays}
                value={noOfDays}
                type={"number"}
                customStyle={{
                  borderRadius: "10px",
                  border: "none",
                }}
                inputStyle={{ borderColor: "none" }}
                placeholder={"No Of Days"}
              />
            </div>
          )}
          <div className={classes.add_task_btn_main}>
            <Button
              onClick={() => HandleSubmitData()}
              className={classes.add_task_btn}
              label={
                isLoading
                  ? "Submitting..."
                  : data == null
                  ? "Add Task"
                  : "Edit Task"
              }
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </>
  );
};

export default AddTaskModal;
