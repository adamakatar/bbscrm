import React, { useState } from "react";
import classes from "./AddBrokerModal.module.css";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import ModalSkeleton from "../ModalSkeleton";
import { toast } from "react-toastify";
import validator from "validator";
import CustomPhoneInput from "../../Component/CustomPhoneInput";
import { DropDown } from "../../Component/DropDown/DropDown";
import { TextArea } from "../../Component/TextArea";
import { formRegEx, formRegExReplacer } from "../../config/apiUrl";

const AddBrokerModal = ({
  show,
  setShow,
  handleSubmit,
  isLoading = false,
  isOutSideUser = false,
  roleOptions,
  heading,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [personalContact, setPersonalContact] = useState("");
  const [officeContact, setOfficeContact] = useState("");
  const [cellContact, setCellContact] = useState("");
  const [deskContact, setDeskContact] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState(roleOptions ? roleOptions[0] : "");

  // for broker
  const [meetingLink, setMeetingLink] = useState("");

  const HandleSubmitData = async () => {
    let params = {
      role: isOutSideUser ? role?.value : "broker",
      firstName,
      lastName,
      officeContact: `+${officeContact}`,
      email,
      // for broker
      contact: `+${personalContact}`,
    };

    if (!validator.isEmail(params["email"])) {
      return toast.warn("Your Email is not valid.");
    }

    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(
          `Please fill the ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()} field!`
        );
      }
    }
    if (!validator.isMobilePhone(params["officeContact"], ["en-US"])) {
      return toast.warn("Your Office Contact number is not valid.");
    }
    if (!validator.isMobilePhone(params["contact"], ["en-US"])) {
      return toast.warn("Your Contact number is not valid.");
    }

    params = {
      ...params,
      designation,
      deskContact: deskContact ? `+${deskContact}` : "",
      cell: cellContact ? `+${cellContact}` : "",
      // for broker
      ...(!isOutSideUser && {
        meetingLink,
        description,
      }),
    };
    if (
      deskContact !== "" &&
      !validator.isMobilePhone(params["deskContact"], ["en-US"])
    ) {
      return toast.warn("Your Desk Contact number is not valid.");
    }
    if (
      cellContact !== "" &&
      !validator.isMobilePhone(params["cell"], ["en-US"])
    ) {
      return toast.warn("Your Cell Contact number is not valid.");
    }
    await handleSubmit(params);
  };
  return (
    <div>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={heading ? heading : "Add Broker"}
      >
        <div className={classes.addProjectModal_main}>
          <Row className={classes.addProject_row}>
            <Col md={6}>
              <Input
                setter={setFirstName}
                value={firstName}
                placeholder={"First Name"}
              />
            </Col>
            <Col md={6}>
              <Input
                setter={setLastName}
                value={lastName}
                placeholder={"Last Name"}
              />
            </Col>
            <Input
              type={"email"}
              setter={setEmail}
              value={email}
              placeholder={"Email"}
            />
            <Input
              setter={setDesignation}
              value={designation}
              placeholder={"Designation (Optional)"}
            />
            {isOutSideUser && (
              <DropDown
                setter={setRole}
                value={role}
                options={roleOptions}
                placeholder={"Select Role"}
              />
            )}

            {/* ring central */}
            <Col md={6}>
              <CustomPhoneInput
                placeholder={"Contact"}
                value={personalContact}
                setter={setPersonalContact}
              />
            </Col>
            <Col md={6}>
              <CustomPhoneInput
                placeholder={"Office Contact"}
                value={officeContact}
                setter={setOfficeContact}
              />
            </Col>
            <Col md={6}>
              <CustomPhoneInput
                placeholder={"Cell Contact (Optional)"}
                value={cellContact}
                setter={setCellContact}
              />
            </Col>
            <Col md={6}>
              <CustomPhoneInput
                placeholder={"Desk Contact (Optional)"}
                value={deskContact}
                setter={setDeskContact}
              />
            </Col>

            {!isOutSideUser && (
              <>
                <Input
                  setter={setMeetingLink}
                  value={meetingLink}
                  placeholder={"Meeting Link (Optional)"}
                />
                <TextArea
                  placeholder={"Description (Optional)"}
                  value={description}
                  setter={setDescription}
                />
              </>
            )}
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={HandleSubmitData}
              className={classes.btn}
              label={
                isLoading ? "Submitting..." : heading ? heading : "Add Broker"
              }
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default AddBrokerModal;
