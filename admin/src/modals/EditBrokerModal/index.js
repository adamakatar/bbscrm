import React, { useState } from "react";
import { Input } from "../../Component/Input/Input";
import ModalSkeleton from "../ModalSkeleton";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../Component/Button/Button";
import classes from "./EditBrokerModal.module.css";
import CustomPhoneInput from "../../Component/CustomPhoneInput";
import { TextArea } from "../../Component/TextArea";
import { toast } from "react-toastify";
import validator from "validator";
import { ProfileWithEditButton } from "../../Component/ProfileWithEditButton";
import { DropDown } from "../../Component/DropDown/DropDown";
import { formRegEx, formRegExReplacer } from "../../config/apiUrl";

const desigOptions = [
  { label: "Broker", value: "broker" },
  { label: "Seller", value: "seller" },
  { label: "Buyer", value: "buyer" },
  { label: "Admin", value: "admin" },
  { label: "Landlord", value: "landlord" },
  { label: "Lawyer", value: "lawyer" },
  { label: "Accountant", value: "accountant" },
  { label: "Job Applicant", value: "job applicant" },
  { label: "Title Company", value: "title company" },
  { label: "3rd Party Contact", value: "3rd party contact" },
  { label: "Service Provider", value: "service provider" },
];

const EditBrokerModal = ({
  show,
  setShow,
  handleSubmit,
  isLoading = false,
  data = null,
  userType = "",
  heading,
}) => {
  const [photo, setPhoto] = useState(data?.photo ? data?.photo : "");
  const [firstName, setFirstName] = useState(
    data?.firstName ? data?.firstName : ""
  );
  const [lastName, setLastName] = useState(
    data?.lastName ? data?.lastName : ""
  );
  const [city, setCity] = useState(data?.city ? data?.city : "");
  const [personalContact, setPersonalContact] = useState(
    data?.contact ? data?.contact?.substring(1) : ""
  );
  const [officeContact, setOfficeContact] = useState(
    data?.officeContact ? data?.officeContact?.substring(1) : ""
  );
  const [cellContact, setCellContact] = useState(
    data?.cell !== "" ? data?.cell?.substring(1) : ""
  );
  const [deskContact, setDeskContact] = useState(
    data?.deskContact !== "" ? data?.deskContact?.substring(1) : ""
  );
  const [email, setEmail] = useState(data?.email ? data?.email : "");
  const [designation, setDesignation] = useState(
    data?.designation
      ? userType == "buyer-seller"
        ? desigOptions?.find((it) => it?.value == data?.designation)
        : data?.designation
      : ""
  );
  const [description, setDescription] = useState(
    data?.description ? data?.description : ""
  );
  const [meetingLink, setMeetingLink] = useState(
    data?.meetingLink ? data?.meetingLink : ""
  );
  const [mobilePhone, setMobilePhone] = useState(
    data?.mobilePhone ? data?.mobilePhone : ""
  );
  const [HomePhone, setHomePhone] = useState(
    data?.HomePhone ? data?.HomePhone : ""
  );
  const [workPhone, setWorkPhone] = useState(
    data?.workPhone ? data?.workPhone : ""
  );
  const HandleSubmitData = async () => {
    let params = {
      firstName,
      lastName,
      ...(userType !== "buyer-seller" && {
        officeContact:
          officeContact.charAt(0) !== "+" ? `+${officeContact}` : officeContact,
        contact:
          personalContact.charAt(0) !== "+"
            ? `+${personalContact}`
            : personalContact,
      }),
      ...(userType == "buyer-seller" && { designation: designation?.value }),
      // for buyer seller
      ...(userType == "buyer-seller" && {
        mobilePhone:
          mobilePhone.charAt(0) !== "+" ? `+${mobilePhone}` : mobilePhone,
      }),
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(
          `Please fill the ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()} field!`
        );
      }
    }
    if (
      userType !== "buyer-seller" &&
      !validator.isMobilePhone(params["officeContact"])
    ) {
      return toast.warn("Your Office Contact number is not valid.");
    }
    if (
      userType !== "buyer-seller" &&
      !validator.isMobilePhone(params["contact"])
    ) {
      return toast.warn("Your Contact number is not valid.");
    }

    params = {
      ...params,
      ...(userType !== "buyer-seller" && {
        designation,
        deskContact: deskContact
          ? deskContact.charAt(0) !== "+"
            ? `+${deskContact}`
            : deskContact
          : "",
        cell: cellContact
          ? cellContact.charAt(0) !== "+"
            ? `+${cellContact}`
            : cellContact
          : "",
      }),
      ...(userType == "broker" && {
        meetingLink,
      }),
      ...((userType == "broker" || heading == "Edit Admin User") && {
        photo,
      }),
      // for buyer seller
      ...(userType == "buyer-seller" && {
        HomePhone: HomePhone
          ? HomePhone.charAt(0) !== "+"
            ? `+${HomePhone}`
            : HomePhone
          : "",
        workPhone: workPhone
          ? workPhone.charAt(0) !== "+"
            ? `+${workPhone}`
            : workPhone
          : "",
        city,
      }),
      // for broker
      ...(["broker", "buyer-seller"].includes(userType) && {
        description,
      }),
    };
    if (
      userType !== "buyer-seller" &&
      deskContact !== "" &&
      !validator.isMobilePhone(params["deskContact"])
    ) {
      return toast.warn("Your Desk Contact number is not valid.");
    }
    if (
      userType !== "buyer-seller" &&
      cellContact !== "" &&
      !validator.isMobilePhone(params["cell"])
    ) {
      return toast.warn("Your Cell Contact number is not valid.");
    }
    if (
      userType == "buyer-seller" &&
      HomePhone !== "" &&
      !validator.isMobilePhone(params["HomePhone"])
    ) {
      return toast.warn("Your Home Phone number is not valid.");
    }
    if (
      userType == "buyer-seller" &&
      workPhone !== "" &&
      !validator.isMobilePhone(params["workPhone"])
    ) {
      return toast.warn("Your Work Phone number is not valid.");
    }

    await handleSubmit(params);
  };

  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={heading}
      >
        <div className={classes.addProjectModal_main}>
          <Row className={classes.addProject_row}>
            {(userType == "broker" || heading == "Edit Admin User") && (
              <div className={classes.photoDiv}>
                <ProfileWithEditButton
                  updateImage={photo}
                  setUpdateImage={setPhoto}
                  isEdit={true}
                />
              </div>
            )}
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
              disabled={true}
            />
            {userType == "buyer-seller" ? (
              <Col md={12}>
                <Col md={12} className={classes.inputCol}>
                  <DropDown
                    placeholder={"Role"}
                    options={desigOptions}
                    value={designation}
                    setter={setDesignation}
                    customStyle={{ marginBottom: "24px" }}
                    optionLabel={"label"}
                    optionValue={"value"}
                  />
                </Col>
                <Col md={12} className={classes.inputCol}>
                  <Input
                    setter={setCity}
                    value={city}
                    placeholder={"Address (Optional)"}
                  />
                </Col>
              </Col>
            ) : (
              <Input
                setter={setDesignation}
                value={designation}
                placeholder={"Designation (Optional)"}
              />
            )}

            {userType !== "buyer-seller" && (
              <Col md={6}>
                <CustomPhoneInput
                  placeholder={"Contact"}
                  value={personalContact}
                  setter={setPersonalContact}
                />
              </Col>
            )}
            {userType == "buyer-seller" && (
              <>
                <Col md={6}>
                  <CustomPhoneInput
                    setter={setMobilePhone}
                    value={mobilePhone}
                    placeholder={"Mobile Phone"}
                  />
                </Col>
                <Col md={6}>
                  <CustomPhoneInput
                    setter={setHomePhone}
                    value={HomePhone}
                    placeholder={"Home Phone (Optional)"}
                  />
                </Col>
                <Col md={6}>
                  <CustomPhoneInput
                    setter={setWorkPhone}
                    value={workPhone}
                    placeholder={"Work Phone (Optional)"}
                  />
                </Col>
              </>
            )}
            {userType !== "buyer-seller" && (
              <>
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
              </>
            )}
            {userType == "broker" && (
              <Input
                setter={setMeetingLink}
                value={meetingLink}
                placeholder={"Meeting Link (Optional)"}
              />
            )}
            {["broker", "buyer-seller"].includes(userType) && (
              <TextArea
                placeholder={
                  userType == "buyer-seller"
                    ? "Notes (Optional)"
                    : "Description (Optional)"
                }
                value={description}
                setter={setDescription}
              />
            )}
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={HandleSubmitData}
              className={classes.btn}
              label={isLoading ? "Submitting..." : heading}
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </>
  );
};

export default EditBrokerModal;
