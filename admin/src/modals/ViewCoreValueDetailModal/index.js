import React from "react";
import { Col, Row } from "react-bootstrap";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ViewCoreValueDetail.module.css";
import parse from "html-react-parser";
import moment from "moment";

const ViewCoreValueDetailModal = ({ show, setShow, data }) => {
  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      width={"750px"}
      borderRadius={"10px"}
      header={"Core Value Detail"}>
      <Row className="gy-2">
        <Col md={6}>
          <div className={classes.MainDiv}>
            <h6>Title:</h6>
            <p>{data?.title}</p>
          </div>
        </Col>
        <Col md={6}>
          <div className={classes.MainDiv}>
            <h6>Order:</h6>
            <p>{data?.order}</p>
          </div>
        </Col>
        <Col md={6}>
          <div className={classes.MainDiv}>
            <h6>Created At:</h6>
            <p>{moment(data?.createdAt).format("LL")}</p>
          </div>
        </Col>
        <Col md={12}>
          <div>
            <h6 className={classes.mainHead}>Description:</h6>
            <p className={classes.descText}>{parse(`${data?.description}`)}</p>
          </div>
        </Col>
      </Row>
    </ModalSkeleton>
  );
};

export default ViewCoreValueDetailModal;
