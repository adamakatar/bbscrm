import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import AttachmentUpload from "../../Component/AttachmentUpload";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddOrUpdateEmailTemplates.module.css";
import { CkEditorInput } from "../../Component/QuillInput";

const AddOrUpdateEmailTemplates = ({
  show,
  setShow,
  handleSubmit,
  data,
  isLoading = false,
}) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState([{}]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);

  useEffect(() => {
    if (data !== undefined) {
      setSubject(data?.subject);
      setMessage(data?.message);
      setAttachment(data?.attachment);
    }
  }, [data]);

  const HandleSubmitData = () => {
    let body = {
      Subject: subject,
      Message: message,
    };
    for (let key in body) {
      if (body[key] == "" || body[key] == null) {
        return toast.error(`${key} is required`);
      }
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("message", message);
    for (let key in attachment) {
      if (attachment[key]?.name !== undefined) {
        formData.append(`attachment`, attachment[key]);
      }
    }
    if (data) {
      formData.append("id", data?._id);
      for (let key in deletedAttachments) {
        if (deletedAttachments?.length == 1) {
          formData.append(`deletedAttachments[]`, deletedAttachments[key]);
        } else {
          formData.append(`deletedAttachments`, deletedAttachments[key]);
        }
      }
    }
    handleSubmit(formData);
  };
  return (
    <div>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={`${data == undefined ? "Add" : "Edit"} Email Template`}>
        <div className={classes.container}>
          <Row className={classes.row}>
            <Col md={12}>
              <Input
                setter={setSubject}
                value={subject}
                placeholder={"Subject"}
                label={"Subject"}
              />
            </Col>
            <Col md={12} style={{ position: "static" }}>
              <CkEditorInput
                setter={setMessage}
                value={message}
                placeholder={"Description"}
                label={"Description"}
                oldData={data?.message}
              />
            </Col>
            <Col md={12}>
              <h6>Attachments</h6>
              <p className={classes.allowedFormat}>
                Please upload only PNG, JPEG, XLSX, Docx and PDF files
              </p>
            </Col>
            <Col md={12}>
              <Row className="gy-3">
                {attachment?.map((item, i) => {
                  return (
                    <Col md={4} sm={6}>
                      <AttachmentUpload
                        state={item}
                        setter={(e) => {
                          if (
                            ![
                              "image/png",
                              "image/jfif",
                              "image/jpeg",
                              "image/jpg",
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                              "application/vnd.ms-excel",
                              "application/pdf",
                            ].includes(e.type)
                          ) {
                            return toast.info(
                              "Please upload a valid file format i.e (XLSX, DOCX, JPEG, PNG and PDF)"
                            );
                          }
                          const newData = [...attachment];
                          newData.splice(i, 1, e);
                          setAttachment(newData);
                        }}
                        onDelete={() => {
                          const newData = [...attachment];
                          newData.splice(i, 1);
                          setAttachment(newData);
                          if (typeof item == "string") {
                            setDeletedAttachments((prev) => [...prev, item]);
                          }
                        }}
                      />
                    </Col>
                  );
                })}
                <Col md={4} sm={6}>
                  <div
                    className={classes.addMore}
                    onClick={() => setAttachment((prev) => [...prev, {}])}>
                    <p>Add More</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={() => HandleSubmitData()}
              className={classes.btn}
              label={
                isLoading
                  ? "Submitting..."
                  : data == null
                  ? "Add Template"
                  : "Edit Template"
              }
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default AddOrUpdateEmailTemplates;
