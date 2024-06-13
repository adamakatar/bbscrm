import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input/Input";
import { TextArea } from "../../Component/TextArea";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddOrUpdateFaqModal.module.css";

const AddOrUpdateFaqModal = ({
  show,
  setShow,
  handleSubmit,
  data,
  isLoading = false,
}) => {
  const typeOptions = [
    { label: "Buyer", value: "buyer" },
    { label: "Seller", value: "seller" },
  ];
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [type, setType] = useState(typeOptions[0]);
  const [isActive, setIsActive] = useState("");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (data !== undefined) {
      setQuestion(data?.question);
      setAnswer(data?.answer);
      setOrder(data?.order);
      setType(typeOptions?.find((item) => item?.value == data?.type));
      setIsActive(
        data?.isActive
          ? { label: "Active", value: data?.isActive }
          : { label: "Deactive", value: data?.isActive }
      );
    }
  }, [data]);

  const HandleSubmitData = () => {
    let params = {
      question,
      answer,
      userType: type?.value,
      order: Number(order),
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`${key} can't be empty`);
      }
    }
    delete params.userType;
    params = {
      ...params,
      type: type.value,
      ...(data && { isActive: isActive?.value }),
    };
    handleSubmit(params);
  };
  return (
    <div>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={`${data == undefined ? "Add" : "Edit"} Faq`}>
        <div className={classes.container}>
          <Row className={classes.row}>
            <Col md={12}>
              <Input
                setter={setQuestion}
                value={question}
                placeholder={"Question"}
                label={"Question"}
              />
            </Col>
            <Col md={12}>
              <TextArea
                setter={setAnswer}
                value={answer}
                placeholder={"Answer"}
                label={"Answer"}
              />
            </Col>
            <Col md={12}>
              <DropDown
                setter={setType}
                value={type}
                options={typeOptions}
                placeholder={"User Type"}
                label={"User Type"}
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
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={() => HandleSubmitData()}
              className={classes.btn}
              label={
                isLoading
                  ? "Submitting..."
                  : data == null
                  ? "Add Faq"
                  : "Edit Faq"
              }
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default AddOrUpdateFaqModal;
