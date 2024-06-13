import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Get } from "../../Axios/AxiosFunctions";
import { BaseURL } from "../../config/apiUrl";

import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./SelectTemplateForProjectModal.module.css";

const SelectTemplateForProjectModal = ({
  show,
  setShow,
  handleSubmit,
  isLoading = false,
}) => {

  const accessToken = useSelector((state) => state?.authReducer.access_token);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [allTaskManagerTemplate, setAllTemplate] = useState([]);

  useEffect(() => {
    Get(BaseURL('project-templates'), accessToken)
      .then(res => {
        setAllTemplate(res?.data?.templates);
      });
  }, []);

  return (
    <div>
      <style>{`
        .modal-content{
          overflow:visible !important;
        }
      `}</style>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={"Select Project"}>
        <div className={classes.addProjectModal_main}>
          <Row className={classes.addProject_row}>
            <DropDown
              setter={setSelectedTemplate}
              value={selectedTemplate}
              placeholder={"Select Template"}
              options={allTaskManagerTemplate}
              optionLabel={"name"}
              optionValue={"name"}
            />
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={() => handleSubmit(selectedTemplate?.slug)}
              className={classes.btn}
              label={isLoading ? "Submitting..." : "Apply Template"}
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default SelectTemplateForProjectModal;
