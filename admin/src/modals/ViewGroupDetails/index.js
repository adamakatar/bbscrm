import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Input } from "../../Component/Input/Input";
import { imageUrl } from "../../config/apiUrl";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./viewGroupDetails.module.css";

function ViewGroupModal({ show, setShow, data }) {
  const [searchUser, setSearchUser] = useState("");

  let filteredUsers = [...data?.users];
  if (searchUser?.length >= 1) {
    filteredUsers = data?.users?.filter((item) => {
      if (
        `${item?.firstName} ${item?.lastName}`
          .toLowerCase()
          .includes(searchUser?.toLowerCase())
      ) {
        return item;
      }
    });
  }

  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      width="600px"
      borderRadius="20px"
      header={`View Group`}>
      <div className={classes.container}>
        <Row className={classes.row}>
          <Col md={12}>
            <div className={classes.labelAndValue}>
              <span>Name:</span>
              <p>{data?.name}</p>
            </div>
          </Col>
          <Col md={12}>
            <div className={classes.labelAndValue}>
              <span>Group Type:</span>
              <p>{data?.type}</p>
            </div>
          </Col>
          {data?.type == "listing" && (
            <>
              <Col md={12}>
                <div className={classes.labelAndValue}>
                  <span>Listings:</span>
                </div>
              </Col>
              <Col md={12} className={classes.listings}>
                {data?.listings?.map((item) => (
                  <div className={classes.userDetails}>
                    <div className={classes.imgDiv}>
                      <img
                        src={
                          item?.images?.length > 0 && imageUrl(item?.images[0])
                        }
                      />
                    </div>
                    <p>{`${item?.title}`}</p>
                  </div>
                ))}
              </Col>
            </>
          )}
          <Col md={12}>
            <Input
              setter={setSearchUser}
              value={searchUser}
              placeholder={"Search users"}
              label={"Search Users"}
            />
          </Col>
          <Col md={12}>
            <div className={classes.labelAndValue}>
              <span>Members:</span>
            </div>
          </Col>
          <Col md={12} className={classes.members}>
            {filteredUsers?.map((item) => (
              <div className={classes.userDetails}>
                <div className={classes.imgDiv}>
                  <img src={imageUrl(item?.photo)} />
                </div>
                <p>{`${item?.firstName} ${item?.lastName}`}</p>
              </div>
            ))}
          </Col>
        </Row>
      </div>
    </ModalSkeleton>
  );
}

export default ViewGroupModal;
