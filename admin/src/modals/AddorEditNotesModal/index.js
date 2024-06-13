import moment from "moment";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { DiCssTricks } from "react-icons/di";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddMoreBtn from "../../Component/AddMoreBtn";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddorEditNotesModal.module.css";
import { TextArea } from "../../Component/TextArea";

const AddMoreInput = ({
  title = "Default Title",
  inputVal,
  setInputVal,
  inputArr,
  setInputArr,
  creatorId,
  placeholder,
  subDelete = undefined,
}) => {
  return (
    <div>
      <div className={classes?.inputAndAddBtnContainer}>
        <span className={classes?.titleText}>{title}</span>
        <AddMoreBtn
          onClick={() => {
            if (inputVal !== "") {
              setInputArr((prev) => [
                ...prev,
                {
                  message: inputVal,
                  creator: creatorId,
                },
              ]);
            }
            setInputVal("");
          }}
        />
      </div>
      <TextArea
        setter={setInputVal}
        value={inputVal}
        placeholder={placeholder}
        rows={1}
      />
      {inputArr?.length > 0 && (
        <div className={classes.mainNotesDiv}>
          {inputArr?.map((item, index) => (
            <div
              className={[classes.bulletContainer].join(" ")}
              key={`${index} busHighlight`}
            >
              <div className={classes.bulletInnerContainer}>
                <DiCssTricks color={"var(--dashboard-main-color)"} size={12} />
                <span>{item?.message}</span>
              </div>
              <div className={classes.bulletInnerContainer}>
                {item?.createdAt && (
                  <span className={classes.creationTime}>
                    {moment(item?.createdAt).format("MM-DD-YYYY hh:mm a")}
                  </span>
                )}
                <MdDelete
                  color={"var(--dashboard-main-color)"}
                  size={20}
                  onClick={() => {
                    if (subDelete !== undefined) {
                      subDelete(index);
                    } else {
                      let newArray = [...inputArr];
                      newArray.splice(index, 1);
                      setInputArr(newArray);
                    }
                  }}
                  className={classes.icon}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AddOrEditNotesModal = ({
  show,
  setShow,
  onClick,
  loading,
  selectedUser,
}) => {
  const { user } = useSelector((state) => state?.authReducer);
  const [notesText, setNotesText] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    setNotes(selectedUser?.notes ? selectedUser?.notes : []);
  }, []);

  const handleAdd = async () => {
    let newNote = undefined;
    if (!!notesText) {
      newNote = {
        message: notesText,
        creator: user?._id,
      };
      setNotes((prev) => [...prev, newNote]);
      await onClick([...notes, newNote]);
      setNotesText("");
      return;
    }
    await onClick([...notes]);
    setNotesText("");
  };

  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      borderRadius={"20px"}
      modalClass={classes.modal}
      width={"650px"}
      header={`Add Notes`}
    >
      <Row>
        <Col md={12} className={classes.inputCol}>
          <TextArea
            setter={setNotesText}
            value={notesText}
            placeholder={"Enter Note"}
            label={"Add Notes"}
            rows={1}
          />
        </Col>

        {notes?.length > 0 && (
          <div className={classes.mainNotesDiv}>
            {notes?.map((item, index) => (
              <div
                className={[classes.bulletContainer].join(" ")}
                key={`${index} busHighlight`}
              >
                <div className={classes.bulletInnerContainer}>
                  <DiCssTricks
                    color={"var(--dashboard-main-color)"}
                    size={12}
                  />
                  <span>{item?.message}</span>
                </div>
                <div className={classes.bulletInnerContainer}>
                  {item?.createdAt && (
                    <span className={classes.creationTime}>
                      {moment(item?.createdAt).format("MM-DD-YYYY hh:mm a")}
                    </span>
                  )}
                  <MdDelete
                    color={"var(--dashboard-main-color)"}
                    size={20}
                    onClick={() => {
                      let newArray = [...notes];
                      newArray.splice(index, 1);
                      setNotes(newArray);
                    }}
                    className={classes.icon}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Col md={12} className={classes.btnCol}>
          <Button
            label={loading ? "Submitting..." : "Submit"}
            onClick={handleAdd}
            disabled={loading}
          />
        </Col>
      </Row>
    </ModalSkeleton>
  );
};

export default AddOrEditNotesModal;
