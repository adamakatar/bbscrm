import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { TextArea } from "../../Component/TextArea";
import { rolesOptions } from "../../constant/commonData";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./SendMessageModal.module.css";

const SendMessageModal = ({ show, setShow, loading, onClick, onFilter }) => {
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [userType, setUserType] = useState(rolesOptions[0]);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  useEffect(() => {
    onFilter(userType?.value, setAllUsers, setIsFilterLoading);
  }, [userType]);

  const submit = async () => {
    const params = {
      message,
      userIds: [users?._id],
    };
    for (let key in params) {
      if (params[key] == "" || params[key].length == 0) {
        return toast.error("Please enter all fields");
      }
    }
    await onClick(params);
  };

  return (
    <>
      <style>{`
        .modal-content{
          overflow:visible !important;
        }
    `}</style>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={`New Message`}>
        <Row>
          <Col md={12} className={classes.formCol}>
            <DropDown
              value={userType}
              setter={(e) => {
                setUserType(e);
                setUsers("");
              }}
              label={"User Type"}
              placeholder={"Select User Type"}
              options={rolesOptions}
              optionValue={"value"}
              optionLabel={"label"}
            />
          </Col>
          <Col md={12} className={classes.formCol}>
            <DropDown
              value={users}
              setter={setUsers}
              label={"User"}
              placeholder={"Select User"}
              options={allUsers}
              optionValue={"_id"}
              getOptionLabel={(e) => `${e?.firstName} ${e?.lastName}`}
              disabled={isFilterLoading}
            />
          </Col>
          <Col md={12} className={classes.formCol}>
            <TextArea
              value={message}
              setter={setMessage}
              placeholder={"Type Here..."}
              label={"Message"}
            />
          </Col>
          <Col md={12} className={classes.btnCol}>
            <Button
              label={loading ? "Sending..." : "Send"}
              disabled={loading}
              onClick={submit}
            />
          </Col>
        </Row>
      </ModalSkeleton>
    </>
  );
};

export default SendMessageModal;
