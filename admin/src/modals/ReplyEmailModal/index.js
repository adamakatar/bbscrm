import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import AddMultiValueInputContainer from "../../Component/AddMultiValueInputContainer";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import { CkEditorInput } from "../../Component/QuillInput";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ReplyEmailModal.module.css";

function extractEmailFromString(str) {
  const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const email = str?.match(regex);
  return email ? email[0] : null;
}

const ReplyEmailModal = ({
  show,
  setShow,
  isSending,
  onSubmit,
  selectedMail,
  type,
}) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [email, setEmail] = useState("");
  const [emailArray, setEmailArray] = useState([]);

  const handleSubmit = async () => {
    const params = {
      subject,
      description,
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error("Please fill all the fields");
      }
    }
    if (type == "foward") {
      if (emailArray?.length == "") {
        return toast.error("Please fill email field");
      }
    }
    await onSubmit(
      type == "reply" ? extractEmailFromString(selectedMail?.from) : emailArray,
      subject,
      description
    );
  };

  useEffect(() => {
    if (type == "foward") {
      setSubject(selectedMail?.subject);
      setDescription(selectedMail?.textAsHtml);
    }
  }, []);

  return (
    <div>
      <style>{`
        .modal-body{
            height:600px;
            overflow-y:auto;
        }
        
        `}</style>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={`Reply`}>
        <div className={classes.container}>
          <Row className={classes.row}>
            {type == "foward" && (
              <Col md={12} className={classes.formCol}>
                <AddMultiValueInputContainer
                  title={"Add Emails"}
                  inputValue={email}
                  inputSetter={setEmail}
                  arrayValue={emailArray}
                  arraySetter={setEmailArray}
                  placeholder={"Add Emails"}
                  type={"email"}
                />
              </Col>
            )}
            <Col md={12} className={classes.formCol}>
              <Input label={"Subject"} value={subject} setter={setSubject} />
            </Col>
            <Col md={12} className={classes.formCol}>
              <CkEditorInput
                label={"Description"}
                value={description}
                setter={setDescription}
                quillClass={classes.quillClass}
              />
            </Col>
            <Col md={12} className={classes.btn_main}>
              <Button
                label={isSending ? "Submitting..." : "Submit"}
                onClick={handleSubmit}
                className={classes.btn}
                disabled={isSending}
              />
            </Col>
          </Row>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default ReplyEmailModal;
