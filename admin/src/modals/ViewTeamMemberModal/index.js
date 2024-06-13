import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import UploadImageBox from "../../Component/UploadImageBox";
import { imageUrl } from "../../config/apiUrl";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ViewTeamMemberModal.module.css";

const RenderTitleAndValue = ({ label, value }) => (
  <div className={classes.titleAndValue}>
    <label>{label}</label>
    <p>{value ? value : "Not added yet"}</p>
  </div>
);

const ViewTeamMemberModal = ({ show, setShow, data }) => {
  const userData = data;

  return (
    <div>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={`View Member`}>
        <div className={classes.container}>
          <Row className={classes.row}>
            <Col md={12}>
              <UploadImageBox
                label={"Profile"}
                state={userData?.photo}
                edit={false}
              />
            </Col>
            <Col md={6}>
              <RenderTitleAndValue
                value={`${userData?.firstName}`}
                label={"First Name"}
              />
            </Col>
            <Col md={6}>
              <RenderTitleAndValue
                value={`${userData?.lastName}`}
                label={"Last Name"}
              />
            </Col>
            <Col md={12}>
              <RenderTitleAndValue
                value={userData?.designation}
                label={"Designation"}
              />
            </Col>
            <Col md={6}>
              <RenderTitleAndValue value={userData?.email} label={"Email"} />
            </Col>
            <Col md={6}>
              <RenderTitleAndValue
                value={userData?.officeContact}
                label={"Office Contact"}
              />
            </Col>
            <Col md={6}>
              <RenderTitleAndValue
                value={userData?.deskContact}
                label={"Desk Contact"}
              />
            </Col>
            <Col md={6}>
              <RenderTitleAndValue value={userData?.contact} label={"Cell"} />
            </Col>
            <Col md={12}>
              <RenderTitleAndValue
                value={userData?.description}
                label={"Description"}
              />
            </Col>
          </Row>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default ViewTeamMemberModal;
