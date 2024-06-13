import React from "react";
import { Row, Col } from "react-bootstrap";
import { ReturnFormatedNumber } from "../../config/apiUrl";
import ModalSkeleton from "../../modals/ModalSkeleton";
import ShowMoreShowLessText from "../ShowMoreShowLess";
import classes from "./AllContactModal.module.css";
const AllContactModal = ({ show, setShow, data, title }) => {
  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width={"750px"}
        borderRadius={"10px"}
        header={title}>
        <Row className="gy-2">
          <Col md={6}>
            <div className={classes.viewContactMain}>
              <p className={classes.mainHead}>Name:</p>
              <p className={classes.text}>
                {data?.firstName + " " + data?.lastName}
              </p>
            </div>
          </Col>

          <Col md={6}>
            <div className={classes.viewContactMain}>
              <p className={classes.mainHead}>Contact:</p>
              <p className={classes.text}>
                {ReturnFormatedNumber(data?.contact)}
              </p>
            </div>
          </Col>

          <Col md={6}>
            <div className={classes.viewContactMain}>
              <p className={classes.mainHead}>Email:</p>
              <p className={classes.text} title={data?.email}>
                {data?.email}
              </p>
            </div>
          </Col>
          {data?.type !== "contact-us" && (
            <Col md={6}>
              <div className={classes.viewContactMain}>
                <p className={classes.mainHead}>Business Name:</p>
                <p className={classes.text}>{data?.businessName}</p>
              </div>
            </Col>
          )}
          {data?.type == "contact-us" && (
            <Col lg={6} md={12}>
              <div className={classes.viewContactMain}>
                <p className={classes.mainHead}>Recommend From:</p>
                <p className={classes.text}>
                  {data?.recommendFrom?.split("(")[0]?.trim()}
                </p>
              </div>
            </Col>
          )}

          <Col md={12}>
            <div className={""}>
              <p className={classes.mainHead}>Message:</p>
              <p className={`${classes.text} `}>
                <ShowMoreShowLessText visibility={250} text={data?.message} />
              </p>
            </div>
          </Col>
        </Row>
      </ModalSkeleton>
    </>
  );
};

export default AllContactModal;
