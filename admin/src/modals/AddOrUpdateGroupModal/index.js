import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input/Input";
import { Radio } from "../../Component/Radio/Radio";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import { leadStatusOptions } from "../../constant/commonData";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./addOrUpdateGroupModal.module.css";

function AddOrUpdateGroupModal({ show, setShow, isLoading, data, onClick }) {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [groupType, setGroupType] = useState("broker");
  const { allUsers, allBrokers, allListing } = useSelector(
    (state) => state?.commonReducer
  );
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [interestedUsers, setInterestedUsers] = useState([]);

  // For Listings
  const [businesses, setBusinesses] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // async function getInterestedBuyers(e) {
  //   const url = BaseURL("users/admin/get-buyers-from-business");
  //   const body = {
  //     businessIds: e?.map((item) => item?._id),
  //   };
  //   const response = await Post(url, body, apiHeader(accessToken));
  //   if (response !== undefined) {
  //     setInterestedUsers(response?.data?.data?.users);
  //   }
  // }

  useEffect(() => {
    if (data) {
      setUsers(data?.users);
      setName(data?.name);
      setStatuses(data?.status);
      setBusinesses(data?.type == "listing" ? data?.listings : []);
      setGroupType(
        data?.type == "listing"
          ? "listing"
          : data?.type == "user"
          ? "buyer/seller"
          : "broker"
      );
    }
  }, [data]);

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
        width="600px"
        borderRadius="20px"
        header={`${data ? "Edit" : "Add"} Group`}>
        <div className={classes.container}>
          <Row className={classes.row}>
            <Col md={12}>
              <Input
                setter={(e) => {
                  setName(e);
                }}
                value={name}
                placeholder={"Enter group title"}
                label={"Group Title"}
              />
            </Col>
            <Col md={12}>
              <div>
                <label className={classes.label}>Group Type</label>
                <div className={""}>
                  <Radio
                    setValue={(e) => {
                      if (data && e !== data?.type) {
                        return toast.error(
                          "Sorry! you can't change the group type"
                        );
                      }
                      setGroupType(e);
                    }}
                    value={groupType}
                    label={"broker"}
                  />
                  <Radio
                    setValue={(e) => {
                      if (data && e !== data?.type) {
                        return toast.error(
                          "Sorry! you can't change the group type"
                        );
                      }
                      setGroupType(e);
                    }}
                    value={groupType}
                    label={"buyer/seller"}
                  />
                  <Radio
                    setValue={(e) => {
                      if (data && e !== data?.type) {
                        return toast.error(
                          "Sorry! you can't change the group type"
                        );
                      }
                      setGroupType(e);
                    }}
                    value={groupType}
                    label={"listing"}
                  />
                </div>
              </div>
            </Col>
            {groupType == "listing" && (
              <Col md={12}>
                <DropDown
                  setter={(e) => {
                    setBusinesses(e);
                    // getInterestedBuyers(e);
                  }}
                  value={businesses}
                  options={allListing}
                  optionValue={"_id"}
                  optionLabel={"title"}
                  placeholder={"Select listings"}
                  isMulti={true}
                  label={"Listings"}
                />
              </Col>
            )}
            <Col md={12}>
              {groupType == "listing" ? (
                <DropDown
                  setter={(e) => {
                    setStatuses(e);
                  }}
                  value={statuses}
                  options={leadStatusOptions}
                  placeholder={"Select Interest Status"}
                  isMulti={true}
                  label={"Interest Status"}
                  disabled={businesses?.length == 0}
                  optionLabel={"label"}
                  optionValue={"value"}
                />
              ) : (
                <DropDown
                  setter={(e) => {
                    setUsers(e);
                  }}
                  value={users}
                  options={
                    // groupType == "listing"
                    //   ? interestedUsers
                    //   :
                    groupType == "broker" ? allBrokers : allUsers
                  }
                  optionValue={"_id"}
                  getOptionLabel={(e) =>
                    `${e.firstName} ${e.lastName} ${e.email}`
                  }
                  placeholder={"Select members"}
                  isMulti={true}
                  label={"Members"}
                />
              )}
            </Col>
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={() => {
                if (name == "") {
                  return toast.error("Please enter group name");
                }
                if (groupType == "listing" && businesses?.length == 0) {
                  return toast.error("Please select listing");
                }
                if (groupType !== "listing" && users?.length == 0) {
                  return toast.error("Please select users");
                }

                onClick({
                  ...(groupType !== "listing" && {
                    users: users?.map((item) => item?._id),
                  }),
                  name,
                  type:
                    groupType == "listing"
                      ? "listing"
                      : groupType == "buyer/seller"
                      ? "user"
                      : "broker",
                  ...(groupType == "listing" && {
                    listings: businesses?.map((item) => item?._id),
                    status: statuses?.map((item) => item?.value),
                  }),
                  ...(data && { groupId: data?._id }),
                });
              }}
              className={classes.btn}
              label={isLoading ? "Submitting..." : data ? "Edit" : "Add"}
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </>
  );
}

export default AddOrUpdateGroupModal;
