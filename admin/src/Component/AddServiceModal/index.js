import React, { useEffect, useState } from "react";
import classes from "./AddServiceModal.module.css";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import ModalSkeleton from "../../modals/ModalSkeleton";
import { Radio } from "../Radio/Radio";

const Index = ({
  show,
  setShow,
  handleSubmit,
  data,
  isLoading = false,
  isEdit,
}) => {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(0);
  const [img, setImg] = useState(null);
  const [radioType, setRadioType] = useState("services");
  const HandleSubmitData = async () => {
    await handleSubmit({
      title,
      type: radioType,
      order: order?.toString(),
      ...(isEdit && { serviceId: isEdit?._id }),
    });
    setTitle("");
    setOrder(0);
    setImg(null);
  };

  useEffect(() => {
    setTitle(isEdit?.title);
    setOrder(isEdit?.order);
    setRadioType(isEdit?.type);
  }, [isEdit]);

  return (
    <div>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={`${isEdit ? "Edit" : "Add"} Service`}>
        <div className={classes.addProjectModal_main}>
          <Row className={classes.addProject_row}>
            <Col md={12}>
              <Input
                setter={setTitle}
                value={title}
                placeholder={"Title"}
                label={"Title"}
              />
            </Col>
            <Col md={12}>
              <Input
                setter={setOrder}
                value={order}
                placeholder={"Order"}
                label={"Order"}
              />
            </Col>

            <Col md={12}>
              <label className={classes.label}>Type</label>
              <Radio
                label="services"
                setValue={setRadioType}
                value={radioType}
              />
              <Radio label="home" setValue={setRadioType} value={radioType} />
            </Col>
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={() => HandleSubmitData()}
              className={classes.btn}
              label={
                isLoading
                  ? "Submitting..."
                  : `${isEdit ? "Edit" : "Add"} Service`
              }
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default Index;
