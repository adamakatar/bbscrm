import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import { setEmailTemplates } from "../../store/common/commonSlice";
import AddOrUpdateEmailTemplates from "../AddOrUpdateEmailTemplates";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./SelectEmailTemplateForReportsModal.module.css";

const SelectEmailTemplateForReportsModal = ({
  show,
  setShow,
  handleSubmit,
  isLoading = false,
}) => {
  const dispatch = useDispatch();
  const { allEmailTemplates } = useSelector((state) => state?.commonReducer);
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState("");
  const [template, setTemplate] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function getEmailTemplate(e) {
    const url = BaseURL(`templates/single/${e?._id}`);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setTemplate(response?.data?.data);
    }
  }

  const onSubmit = async () => {
    if (selectedEmailTemplate == "") {
      return toast.error("Please Select Email Template");
    }
    await handleSubmit(selectedEmailTemplate?._id);
  };

  const updateTemplate = async (e) => {
    const url = BaseURL(`templates/update`);
    setIsUpdating(true);
    const response = await Patch(url, e, apiHeader(accessToken, true));
    if (response !== undefined) {
      setTemplate(response?.data);
      setSelectedEmailTemplate(response?.data);
      const newTemplates = [...allEmailTemplates];
      newTemplates?.splice(
        newTemplates?.findIndex((item) => item?._id == response?.data?._id),
        1,
        response?.data
      );
      dispatch(setEmailTemplates(newTemplates));
      toast.success("Email template updated successfully");
      setIsOpenModal(false);
    }
    setIsUpdating(false);
  };

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
        header={"Send Mails"}>
        <div className={classes.addProjectModal_main}>
          <Row className={classes.addProject_row}>
            <Col md={12}>
              <DropDown
                setter={(e) => {
                  setSelectedEmailTemplate(e);
                  getEmailTemplate(e);
                }}
                value={selectedEmailTemplate}
                placeholder={"Select mail template"}
                options={allEmailTemplates}
                optionLabel={"subject"}
                optionValue={"subject"}
              />
            </Col>
            {selectedEmailTemplate !== "" && (
              <Col md={12}>
                <Link
                  to={"#"}
                  title={"Tap to view and edit"}
                  onClick={() => setIsOpenModal(true)}
                  className={classes.link}>
                  {selectedEmailTemplate?.subject}
                </Link>
              </Col>
            )}
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={onSubmit}
              className={classes.btn}
              label={isLoading ? "Submitting..." : "Send Mails"}
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
      {isOpenModal && (
        <AddOrUpdateEmailTemplates
          isLoading={isUpdating}
          show={isOpenModal}
          setShow={setIsOpenModal}
          data={template}
          handleSubmit={updateTemplate}
        />
      )}
    </div>
  );
};

export default SelectEmailTemplateForReportsModal;
