import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddOrEditTaskManagerTemplateModal.module.css";

const AddOrEditTaskManagerTemplateModal = ({
  show,
  setShow,
  handleSubmit,
  data,
  isLoading = false,
}) => {
  const [templateName, setTemplateName] = useState(data ? data : "");

  const HandleSubmitData = () => {
    handleSubmit({
      name: templateName,
    });
  };

  return (
    <div>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={data == null ? "Add Template" : "Edit Template"}
      >
        <div className={classes.addProjectModal_main}>
          <Row className={classes.addProject_row}>
            <Input
              setter={setTemplateName}
              value={templateName}
              placeholder={"Template Name"}
            />
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

export default AddOrEditTaskManagerTemplateModal;
