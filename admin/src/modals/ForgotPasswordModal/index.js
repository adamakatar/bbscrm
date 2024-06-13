import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./forgotPasswordModal.module.css";

function ForgotPasswordModal({ show, setShow }) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function onSubmit() {
    if (email == "") {
      return toast.error("Email is required");
    }
    const url = BaseURL(`auth/forgotPassword`);
    setIsSending(true);
    const response = await Post(url, { email }, apiHeader());
    if (response !== undefined) {
      toast.success(
        "Reset password link has been sent successfully. Please check your email!"
      );
      setShow(false);
    }

    setIsSending(false);
  }

  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      width="600px"
      borderRadius="20px"
      header={`Forget Password`}>
      <div className={classes.container}>
        <Row className={classes.row}>
          <Col md={12}>
            <Input
              setter={setEmail}
              value={email}
              placeholder={"Enter email here"}
              label={"Email"}
            />
          </Col>
          <Col md={12} className={classes.btn_main}>
            <Button
              label={isSending ? "Submitting..." : "Submit"}
              onClick={onSubmit}
              className={classes.btn}
              disabled={isSending}
            />
          </Col>
        </Row>
      </div>
    </ModalSkeleton>
  );
}

export default ForgotPasswordModal;
