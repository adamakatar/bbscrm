import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers";
import classes from "./AddEventModal.module.css";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input/Input";
import { TextArea } from "../../Component/TextArea";
import ModalSkeleton from "../ModalSkeleton";

const convertToMin = (timeStr = "04:20 pm") => {
  const [time, dayNight] = timeStr.split(" ");

  const dayNightHours = { am: 0, pm: 12 };

  const [splitedHours, splitedMin] = time.split(":");
  const min =
    dayNightHours[dayNight] * 60 +
    Number(splitedHours) * 60 +
    Number(splitedMin);

  return min || 0;
};

function AddEventModal({
  show,
  setShow,
  addEventClick,
  loading,
  selectedDate,
}) {
  const { allBrokers } = useSelector((state) => state?.commonReducer);
  const { allOwners } = useSelector((state) => state?.commonReducer);
  const { user } = useSelector((state) => state?.authReducer);

  const [eventName, setEventName] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [agenda, setAgenda] = useState("");
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [customerAttendees, setCustomerAttendees] = useState([]);
  //
  const [startTime, setStartTime] = useState(null);

  const addEvent = async () => {
    if (startTime == null) {
      return toast.error(`Please fill all the field!`);
    }
    const params = {
      creator: user?._id,
      name: eventName,
      color,
      venue: location,
      description,
      date: moment(selectedDate)
        .startOf("day")
        .add(convertToMin(moment(startTime?.$d).format("hh:mm a")), "minutes")
        .format(),
      type: "event",
      agenda,
      attendees: attendees?.map((item) => item?._id),
      customerAttendees: customerAttendees?.map((item) => item?._id),
    };

    for (let key in params) {
      if (
        params[key] == "" ||
        params[key] == null ||
        params[key]?.length == 0
      ) {
        return toast.error(`Please fill the ${key} field!`);
      }
    }

    await addEventClick(params);
    // setEventName("");
    // setColor("");
    // setLocation("");
    // setAgenda("");
    // setDescription("");
    // setAttendees([]);
    // setCustomerAttendees([]);
    // setDeadLineDate("");
  };

  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      borderRadius={"20px"}
      modalClass={classes.modal}
      width={"650px"}
      header={`Add Event`}>
      <style>{`
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
          .modal-content{
            overflow:visible;
          }
          // .Mui-selected,.MuiClockPointer-root,.MuiClock-pin{
          //   background-color: var(--dashboard-main-color) !important;
          //   color:#fff !important;
          // }
          // .MuiClock-pmButton,.MuiClock-amButton{

          // }
        `}</style>
      <div className={classes.mainModalDiv}>
        <Row>
          <Col md={9} className={classes.mb20}>
            <Input
              placeholder="Event Name"
              setter={setEventName}
              value={eventName}
            />
          </Col>
          <Col md={3} className={classes.mb20}>
            <div className={classes.colorPicker}>
              <input
                type={"color"}
                className={classes.colorBox}
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <label>Color</label>
            </div>
          </Col>
          <Col md={12} className={classes.mb20}>
            <Input placeholder="Where" setter={setLocation} value={location} />
          </Col>
          <Col md={12} className={classes.mb20}>
            <Input placeholder="Agenda" setter={setAgenda} value={agenda} />
          </Col>
          <Col md={12} className={classes.mb20}>
            <TextArea
              placeholder="Description"
              setter={setDescription}
              value={description}
            />
          </Col>
          <Col md={12} className={classes.mb20}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={selectedDate ? "" : "Date"}
                value={moment(selectedDate).format()}
                onChange={(newValue) => { }}
                disabled={true}
                renderInput={(params) => (
                  <TextField
                    InputLabelProps={{ shrink: false }}
                    onKeyDown={(e) => e.preventDefault()}
                    disabled={true}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </Col>
          <Col md={12} className={classes.mb20}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label={startTime ? "" : "Time"}
                value={startTime}
                onChange={(newValue) => {
                  setStartTime(newValue);
                }}
                minDate={new Date()}
                renderInput={(params) => (
                  <TextField
                    InputLabelProps={{ shrink: false }}
                    onKeyDown={(e) => e.preventDefault()}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </Col>
          <Col md={12} className={classes.mb20}>
            <DropDown
              placeholder={"Add Attendees"}
              setter={setAttendees}
              value={attendees}
              options={allBrokers}
              optionValue={"_id"}
              getOptionLabel={(option) => {
                return `${option["firstName"]} ${option["lastName"]}`;
              }}
              isMulti={true}
            />
          </Col>
          <Col md={12} className={classes.mb20}>
            <DropDown
              placeholder={"Add Customers"}
              setter={setCustomerAttendees}
              value={customerAttendees}
              options={allOwners}
              optionValue={"_id"}
              getOptionLabel={(option) => {
                return `${option["firstName"]} ${option["lastName"]}`;
              }}
              isMulti={true}
            />
          </Col>
          <Col md={12}>
            <Button
              disabled={loading}
              label={loading ? "Adding..." : "Add Event"}
              className={classes.btn}
              onClick={addEvent}
            />
          </Col>
        </Row>
      </div>
    </ModalSkeleton>
  );
}

export default AddEventModal;
