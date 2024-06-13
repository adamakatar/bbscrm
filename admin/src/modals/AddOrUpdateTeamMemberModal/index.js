import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import ModalSkeleton from "../ModalSkeleton";
import { toast } from "react-toastify";
import validator from "validator";
import CustomPhoneInput from "../../Component/CustomPhoneInput";
import { TextArea } from "../../Component/TextArea";
import classes from "./AddOrUpdateTeamMemberModal.module.css";
import { ProfileWithEditButton } from "../../Component/ProfileWithEditButton";

const AddOrUpdateTeamMemberModal = ({
  show,
  setShow,
  handleSubmit,
  data,
  isLoading = false,
}) => {
  const [photo, setPhoto] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [officeContact, setOfficeContact] = useState("");
  const [cellContact, setCellContact] = useState("");
  const [deskContact, setDeskContact] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");

  const HandleSubmitData = async () => {
    let params = {
      photo,
      firstName,
      lastName,
      officeContact: `+${officeContact}`,
      deskContact: `+${deskContact}`,
      email,
      designation,
      description,
      order,
    };

    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`Please provide all the fields`);
      }
    }
    if (typeof photo == "") {
      return toast.error(`Please provide the profile picture`);
    }
    if (!validator.isMobilePhone(params["officeContact"], ["en-US"])) {
      return toast.warn("Your Office Contact number is not valid.");
    }

    if (!validator.isMobilePhone(params["deskContact"], ["en-US"])) {
      return toast.warn("Your Desk Contact number is not valid.");
    }

    if (!validator.isEmail(params["email"])) {
      return toast.warn("Your Email is not valid.");
    }
    params = {
      ...params,
      contact: !!cellContact ? `+${cellContact}` : "",
    };

    await handleSubmit(params);
  };
  useEffect(() => {
    if (data) {
      setFirstName(data?.firstName);
      setLastName(data?.lastName);
      setEmail(data?.email);
      setDesignation(data?.designation);
      setDescription(data?.description);
      setCellContact(data?.contact?.substring(1));
      setDeskContact(data?.deskContact?.substring(1));
      setOfficeContact(data?.officeContact?.substring(1));
      setOrder(data?.order);
      setPhoto(data?.photo);
    }
  }, [data]);
  return (
    <div>
      <style>{`
        .modal-content{
            max-height:600px;
            overflow:auto !important; 
        }
        `}</style>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={`${data ? "Edit" : "Add"} Team Member`}>
        <div className={classes.addProjectModal_main}>
          <Row className={classes.addProject_row}>
            <Col md={12}>
              <div className={classes.photoDiv}>
                <ProfileWithEditButton
                  updateImage={photo}
                  setUpdateImage={setPhoto}
                  isEdit={true}
                />
              </div>
            </Col>
            <Col md={12}>
              <Input
                setter={setFirstName}
                value={firstName}
                placeholder={"First Name"}
              />
            </Col>
            <Col md={12}>
              <Input
                setter={setLastName}
                value={lastName}
                placeholder={"Last Name"}
              />
            </Col>
            <Col md={12}>
              <Input
                type={"email"}
                setter={setEmail}
                value={email}
                placeholder={"Email"}
              />
            </Col>
            <Col md={12}>
              <Input
                setter={setDesignation}
                value={designation}
                placeholder={"Designation"}
              />
            </Col>

            <Col md={12}>
              <CustomPhoneInput
                placeholder={"Office Contact"}
                value={officeContact}
                setter={setOfficeContact}
              />
            </Col>

            <Col md={12}>
              <CustomPhoneInput
                placeholder={"Desk Contact"}
                value={deskContact}
                setter={setDeskContact}
              />
            </Col>
            <Col md={12}>
              <CustomPhoneInput
                placeholder={"Cell"}
                value={cellContact}
                setter={setCellContact}
              />
            </Col>
            <Col md={12}>
              <Input
                setter={setOrder}
                value={order}
                type={"number"}
                placeholder={"Order"}
              />
            </Col>
            <Col md={12}>
              <TextArea
                placeholder={"Description"}
                value={description}
                setter={setDescription}
              />
            </Col>
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={HandleSubmitData}
              className={classes.btn}
              label={isLoading ? "Submitting..." : data ? "Edit" : "Add"}
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default AddOrUpdateTeamMemberModal;
