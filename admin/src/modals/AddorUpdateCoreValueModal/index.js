import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input/Input";
import QuillInput from "../../Component/QuillInput";
import { TextArea } from "../../Component/TextArea";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddorUpdateCoreValueModal.module.css";

const AddorUpdateCoreValueModal = ({
  show,
  setShow,
  handleSubmit,
  data,
  isLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");

  useEffect(() => {
    if (data !== undefined) {
      setTitle(data?.title);
      setDescription(data?.description);
      setOrder(data?.order);
    }
  }, [data]);

  const HandleSubmitData = async () => {
    let params = {
      title,
      description,
      order: Number(order),
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`${key} can't be empty`);
      }
    }

    await handleSubmit(params);
    setTitle("");
    setDescription("");
    setOrder(0);
  };
  return (
    <div>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={`${data == undefined ? "Add" : "Edit"} Core Value`}>
        <div className={classes.container}>
          <Row className={classes.row}>
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
                type={"number"}
              />
            </Col>
            <Col md={12}>
              <QuillInput
                setter={setDescription}
                value={description}
                placeholder={"Description"}
                label={"Description"}
              />
            </Col>
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={() => HandleSubmitData()}
              className={classes.btn}
              label={
                isLoading
                  ? "Submitting..."
                  : data == null
                  ? "Add Core Value"
                  : "Edit Core Value"
              }
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default AddorUpdateCoreValueModal;
