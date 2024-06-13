import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Button } from "../../Component/Button/Button";
import { Checkbox } from "../../Component/Checkbox/Checkbox";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input/Input";
import { leadStatusOptions } from "../../constant/commonData";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ReportsFilterModal.module.css";

const ReportsFilterModal = ({
  show,
  setShow,
  cities,
  onClick,
  isApiCall,
  resetState,
}) => {
  const { allListing } = useSelector((state) => state?.commonReducer);
  const [search, setSearch] = useState({
    search: "",
    interest: { label: "No", value: false },
    subscribed: { label: "Don`t Apply", value: "dont-apply" },
    city: { label: "no city selected", value: "no city selected" },
    zipCode: "",
    onlyBuyer: "",
    statuses: [],
    selectedListings: [],
  });
  const [type, setType] = useState("search");

  function onSubmit() {
    onClick({
      ...(type == "search" && { search: search?.search }),
      ...(type == "subscription" && { subscribed: search?.subscribed?.value }),
      ...(type == "city" && {
        city:
          search?.city?.value == "no city selected"
            ? undefined
            : search?.city?.value,
      }),
      ...(type == "interest" && {
        interest: search?.interest?.value,
        statuses: search?.statuses?.map((item) => item?.value),
        businessIds:
          search?.selectedListings?.length === 0
            ? allListing?.map((item) => item?._id)
            : search?.selectedListings?.map((item) => item?._id),
      }),
      ...(type == "zipcode" && { zipCode: search?.zipCode }),
      onlyBuyer: search?.onlyBuyer !== "" ? true : undefined,
    });
  }

  function resetState() {
    setSearch({
      search: "",
      interest: { label: "No", value: false },
      subscribed: { label: "Don`t Apply", value: "dont-apply" },
      city: { label: "no city selected", value: "no city selected" },
      zipCode: "",
      onlyBuyer: "",
      statuses: [],
      selectedListings: [],
    });
  }

  return (
    <div>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={"Select Filters For Reports Email"}>
        <div className={classes.container}>
          <Row className={classes.row}>
            <div>
              <label className={`mb-2 ${[classes.label].join(" ")}`}>
                Select Filter Type:
              </label>
              <div className={classes?.typeBtnContainer}>
                <span
                  className={[
                    classes?.typeBtn,
                    type == "search" && classes?.activeBtn,
                  ].join(" ")}
                  onClick={() => {
                    resetState();
                    setType("search");
                  }}>
                  Search
                </span>
                <span
                  className={[
                    classes?.typeBtn,
                    type == "zipcode" && classes?.activeBtn,
                  ].join(" ")}
                  onClick={() => {
                    resetState();
                    setType("zipcode");
                  }}>
                  Zipcode
                </span>
                <span
                  className={[
                    classes?.typeBtn,
                    type == "interest" && classes?.activeBtn,
                  ].join(" ")}
                  onClick={() => {
                    resetState();
                    setType("interest");
                  }}>
                  Interest
                </span>
                <span
                  className={[
                    classes?.typeBtn,
                    type == "city" && classes?.activeBtn,
                  ].join(" ")}
                  onClick={() => {
                    resetState();
                    setType("city");
                  }}>
                  City
                </span>
                <span
                  className={[
                    classes?.typeBtn,
                    type == "subscription" && classes?.activeBtn,
                  ].join(" ")}
                  onClick={() => {
                    resetState();
                    setType("subscription");
                  }}>
                  Subscription
                </span>
              </div>
            </div>

            {type == "search" && (
              <Col md={12}>
                <Input
                  label={"Search"}
                  placeholder={"Search"}
                  value={search?.search}
                  setter={(e) => setSearch({ ...search, search: e })}
                />
              </Col>
            )}
            {type == "zipcode" && (
              <Col md={12}>
                <Input
                  label={"Zipcode"}
                  placeholder={"zipcode"}
                  value={search?.zipCode}
                  setter={(e) => setSearch({ ...search, zipCode: e })}
                  type={"number"}
                />
              </Col>
            )}
            {type == "interest" && (
              <>
                <Col md={12}>
                  <DropDown
                    label={"Listings"}
                    placeholder={"Select Listings"}
                    options={allListing?.map((e) => ({
                      _id: e?._id,
                      title: e?.title,
                    }))}
                    value={search?.selectedListings}
                    setter={(e) => {
                      setSearch({ ...search, selectedListings: e });
                    }}
                    isMulti={true}
                    optionLabel={"title"}
                    optionValue={"_id"}
                  />
                </Col>
                <Col md={12}>
                  <DropDown
                    label={"Interest"}
                    placeholder={"Select interest"}
                    options={[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ]}
                    value={search?.interest}
                    setter={(e) =>
                      setSearch({ ...search, interest: e, statuses: [] })
                    }
                    optionLabel={'label'}
                    optionValue={'value'}
                  />
                </Col>
                <Col md={12}>
                  <DropDown
                    label={"Interest Status"}
                    options={leadStatusOptions}
                    value={search?.statuses}
                    setter={(e) => setSearch({ ...search, statuses: e })}
                    placeholder={"Select interest statuses"}
                    isMulti
                    disabled={!search?.interest?.value}
                    optionLabel={'label'}
                    optionValue={'value'}
                  />
                </Col>
              </>
            )}
            {type == "city" && (
              <Col md={12}>
                <DropDown
                  label={"City"}
                  options={cities?.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  value={search?.city}
                  setter={(e) => setSearch({ ...search, city: e })}
                  placeholder={"Select city"}
                />
              </Col>
            )}
            {type == "subscription" && (
              <Col md={12}>
                <DropDown
                  label={"Subscription"}
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                    { label: "Don`t Apply", value: "dont-apply" },
                  ]}
                  value={search?.subscribed}
                  setter={(e) => setSearch({ ...search, subscribed: e })}
                  placeholder={"Select subscription"}
                />
              </Col>
            )}
            <Col md={12}>
              <Checkbox
                label={"Do you want to search only buyer"}
                value={search?.onlyBuyer}
                setValue={(e) => {
                  setSearch({ ...search, onlyBuyer: e });
                }}
              />
            </Col>
            <Col md={12}>
              <Button
                label={isApiCall ? "Applying..." : "Apply"}
                onClick={onSubmit}
                className={classes.btn}
                disabled={isApiCall}
              />
            </Col>
          </Row>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default ReportsFilterModal;
