import moment from "moment";
import React from "react";
import { Col, Row } from "react-bootstrap";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ViewAllEvents.module.css";
import NoData from "../../Component/NoData/NoData";

const ViewAllEventModal = ({
  show,
  setShow,
  eventsArray,
  setViewEventModal,
  setViewEventData,
}) => {
  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      width={"750px"}
      borderRadius={"10px"}
      header={`${
        eventsArray?.length > 0
          ? `${moment(eventsArray[0]?.date).format("DD-MM-YYYY")} Events`
          : "No Events for this Date"
      }`}>
      <Row className="gy-2">
        {eventsArray?.length > 0 ? (
          eventsArray?.map((item) => {
            return (
              <Col
                md={6}
                className={classes.EventCol}
                onClick={() => {
                  setViewEventData(item);
                  setViewEventModal(true);
                }}>
                <div
                  className={classes.viewEventMain}
                  style={{ backgroundColor: item?.color }}>
                  <p className={classes.text}>{item?.name}</p>
                  <p className={classes.time}>
                    {moment(item?.date).format("hh:mm a")}
                  </p>
                </div>
              </Col>
            );
          })
        ) : (
          <NoData text={"No Events for this date"} />
        )}
      </Row>
    </ModalSkeleton>
  );
};

export default ViewAllEventModal;
