import React from "react";
import { Row, Col } from "react-bootstrap";
import ModalSkeleton from "../../modals/ModalSkeleton";
import classes from "./FreeEvaluationModal.module.css";
const AllContactModal = ({ show, setShow, getCurrentUser }) => {
  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width={"700px"}
        borderRadius={"10px"}>
        <Row>
          <h4 className={classes.mainHeading}>Valuation Details</h4>
        </Row>
        <Row className="text-center mb-4">
          <Col md={4}>
            <div className={classes.viewContactMain}>
              <p className={classes.mainHead}>Name</p>
              <p className={classes.text}>
                {getCurrentUser?.firstName + " " + getCurrentUser?.lastName}
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className={classes.viewContactMain}>
              <p className={classes.mainHead}>Business Name</p>
              <p className={classes.text}>{getCurrentUser?.businessName}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className={classes.viewContactMain}>
              <p className={classes.mainHead}>Contact</p>
              <p className={classes.text}>{getCurrentUser?.contact}</p>
            </div>
          </Col>
        </Row>
        <Row className="text-center">
          <Col md={4}>
            <div className={classes.viewContactMain}>
              <p className={classes.mainHead}>Email</p>
              <p className={classes.text}>{getCurrentUser?.email}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className={classes.viewContactMain}>
              <p className={classes.mainHead}>Message</p>
              <p className={classes.text}>{getCurrentUser?.message}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className={classes.viewContactMain}>
              <p className={classes.mainHead}>Status</p>
              <p className={classes.text}>{getCurrentUser?.status}</p>
            </div>
          </Col>
        </Row>
      </ModalSkeleton>
    </>
  );
};

export default AllContactModal;
