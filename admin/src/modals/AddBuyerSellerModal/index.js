import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../Component/Button/Button";
import CustomPhoneInput from "../../Component/CustomPhoneInput";
import { Input } from "../../Component/Input/Input";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddBuyerSellerModal.module.css";
import { toast } from "react-toastify";
import validator from "validator";
import { formRegEx, formRegExReplacer } from "../../config/apiUrl";
import { DropDown } from "../../Component/DropDown/DropDown";

const AddBuyerSellerModal = ({ show, setShow, handleSubmit, isLoading }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [designation, setDesignation] = useState({
    label: "Buyer",
    value: "Buyer",
  });
  const [mobilePhone, setMobilePhone] = useState("");
  const [HomePhone, setHomePhone] = useState("");
  const [workPhone, setWorkPhone] = useState("");

  const handleClick = async () => {
    let params = {
      firstName,
      lastName,
      email,
      mobilePhone: `+${mobilePhone}`,
      designation: designation?.value,
    };
    if (!validator.isEmail(params["email"])) {
      return toast.warn("Your Email is not valid.");
    }
    if (!validator.isMobilePhone(params["mobilePhone"])) {
      return toast.warn("Your Mobile number is not valid.");
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
    if (HomePhone !== "" && !validator.isMobilePhone(params["HomePhone"])) {
      return toast.warn("Your Home Phone number is not valid.");
    }
    if (workPhone !== "" && !validator.isMobilePhone(params["workPhone"])) {
      return toast.warn("Your Work Phone number is not valid.");
    }
    params = {
      users: [
        {
          ...params,
          HomePhone,
          workPhone,
          city,
        },
      ],
      role: ["buyer", "seller"],
    };
    await handleSubmit(params, false);
  };
  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={"Add Buyer/Seller"}
      >
        <div className={classes.addBuyerModalMainDiv}>
          <Row>
            <Col md={6} className={classes.inputCol}>
              <Input
                setter={setFirstName}
                value={firstName}
                placeholder={"First Name"}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                setter={setLastName}
                value={lastName}
                placeholder={"Last Name"}
              />
            </Col>
            <Col md={12} className={classes.inputCol}>
              <Input
                type={"email"}
                setter={setEmail}
                value={email}
                placeholder={"Email"}
              />
            </Col>
            <Col md={12} className={classes.inputCol}>
              <CustomPhoneInput
                setter={setMobilePhone}
                value={mobilePhone}
                placeholder={"Mobile Phone"}
              />
            </Col>
            <Col md={12} className={classes.inputCol}>
              <CustomPhoneInput
                setter={setHomePhone}
                value={HomePhone}
                placeholder={"Home Phone (Optional)"}
              />
            </Col>
            <Col md={12} className={classes.inputCol}>
              <CustomPhoneInput
                setter={setWorkPhone}
                value={workPhone}
                placeholder={"Work Phone (Optional)"}
              />
            </Col>
            <Col md={12} className={classes.inputCol}>
              <DropDown
                isSearchable={false}
                placeholder={"Role"}
                options={[
                  { label: "Buyer", value: "Buyer" },
                  { label: "Seller", value: "Seller" },
                ]}
                value={designation}
                setter={setDesignation}
              />
            </Col>
            <Col md={12} className={classes.inputCol}>
              <Input
                setter={setCity}
                value={city}
                placeholder={"Address (Optional)"}
              />
            </Col>
            <Col md={12} className={classes.btnCol}>
              <Button
                label={isLoading ? "Adding..." : "Add"}
                disabled={isLoading}
                onClick={handleClick}
              />
            </Col>
          </Row>
        </div>
      </ModalSkeleton>
    </>
  );
};

export default AddBuyerSellerModal;
