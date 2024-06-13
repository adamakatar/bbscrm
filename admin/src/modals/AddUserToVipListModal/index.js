import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddUserToVipList.module.css";
import { toast } from "react-toastify";
import { BaseURL } from "../../config/apiUrl";
import { Get } from "../../Axios/AxiosFunctions";
import { outSideUsersOptionsForFilter } from "../../constant/commonData";

function AddUserToVipListModal({ show, setShow, isLoading, data, onClick }) {
  const { access_token: accessToken } = useSelector(
    (state) => state.authReducer
  );

  const [users, setUsers] = useState([]);
  const [removeUser, setRemoveUser] = useState("");

  const [usersOptions, setUserOptions] = useState([]);
  const [role, setRole] = useState({ label: "Seller", value: "seller" });
  const [usersLoading, setUsersLoading] = useState(false);

  async function getUserAccToRole() {
    setUsersLoading(true);
    const url = BaseURL(`users/admin/owner-broker?userType=${role?.value}`);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setUserOptions(response?.data[`${role?.value}s`]);
    }
    setUsersLoading(false);
  }
  useEffect(() => {
    getUserAccToRole();
    if (data) {
      setUsers(data[`${role?.value}`]);
    }
  }, [role]);

  const onChange = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case "remove-value":
        if (removeUser == "") {
          setRemoveUser(actionMeta?.removedValue?._id);
          setUsers(newValue);
          return;
        } else {
          return toast.error(
            "Sorry! You can not remove multiple users at a time."
          );
        }
    }

    setUsers(newValue);
  };
  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      width="600px"
      borderRadius="20px"
      header={"Add Users To Vip List"}>
      <div className={classes.container}>
        <Row className={classes.row}>
          <Col md={12}>
            <DropDown
              onChange={setRole}
              value={role}
              options={[
                { label: "Seller", value: "seller" },
                ...outSideUsersOptionsForFilter?.filter(
                  (item) => item?.label !== "All"
                ),
              ]}
              placeholder={"Select User Type"}
              label={"User Type"}
            />
          </Col>
          <Col md={12}>
            <DropDown
              onChange={onChange}
              value={users}
              options={usersOptions}
              optionValue={"_id"}
              getOptionLabel={(e) => `${e.firstName} ${e.lastName}`}
              placeholder={"Select Users"}
              isMulti={true}
              label={"Users"}
              disabled={usersLoading}
            />
          </Col>
        </Row>
        <div className={classes.btn_main}>
          <Button
            onClick={() =>
              onClick({
                users: users?.map((item) => item?._id),
                removeUser,
              })
            }
            className={classes.btn}
            label={isLoading ? "Adding..." : "Add"}
            disabled={isLoading}
          />
        </div>
      </div>
    </ModalSkeleton>
  );
}

export default AddUserToVipListModal;
