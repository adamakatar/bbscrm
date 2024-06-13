import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { leadStatusOptions } from "../../constant/commonData";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./UpdateNDAStatus.module.css";

const UpdateNDAStatus = ({
  show,
  setShow,
  handleSubmit,
  leadStatus,
  isLoading = false,
}) => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (leadStatus !== undefined) {
      setStatus(leadStatusOptions?.find((item) => item?.value == leadStatus));
    }
  }, [leadStatus]);

  const HandleSubmitData = () => {
    if (status == null) {
      return toast.error(`NDA Status is required`);
    }

    handleSubmit(status?.value);
  };

  return (
    <div>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={`Update Status`}>
        <div className={classes.container}>
          <Row className={classes.row}>
            <Col md={12}>
              <DropDown
                setter={setStatus}
                value={status}
                placeholder={"NDA status"}
                label={"NDA Status"}
                options={leadStatusOptions?.slice(
                  leadStatusOptions?.findIndex(
                    (item) => item?.value == status?.value
                  )
                )}
                optionLabel={"label"}
                optionValue={"value"}
              />
            </Col>
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={() => HandleSubmitData()}
              className={classes.btn}
              label={isLoading ? "Submitting..." : "Submit"}
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default UpdateNDAStatus;
