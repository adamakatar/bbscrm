import React, { useState } from "react";
import classes from "./SendMailToFilterUserModal.module.css";
import { Row } from "react-bootstrap";
import { Button } from "../../Component/Button/Button";
import ModalSkeleton from "../ModalSkeleton";
import { DropDown } from "../../Component/DropDown/DropDown";
import { listingStatusOptions } from "../../constant/commonData";

const SendMailToFilterUserModal = ({
  show,
  setShow,
  handleSubmit,
  isLoading = false,
  allListings = [],
  allCategories = [],
  allCities = [],
  allGroups = [],
}) => {
  const [type, setType] = useState("listing");
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const HandleSubmitData = async () => {
    const params = {
      type,
      ...(type == "listing" && {
        listingIds: selectedListing.map((item) => item?._id),
        interestStatus: selectedStatus.map((item) => item?.value),
      }),
      ...(type == "category" && {
        categoryIds: selectedCategory.map((item) => item?._id),
      }),
      ...(type == "city" && {
        cities: selectedCity.map((item) => item?.value),
      }),
      ...(type == "groups" && { groupId: selectedGroup?._id }),
    };
    await handleSubmit(params);
  };
  const resetState = () => {
    setSelectedListing(null);
    setSelectedStatus(null);
    setSelectedCategory(null);
    setSelectedCity(null);
    setSelectedGroup(null);
  };

  return (
    <div>
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
        header={"Select Filters For Promotion Email"}>
        <div className={classes.addProjectModal_main}>
          <Row className={classes.addProject_row}>
            <div>
              <label className={`mb-2 ${[classes.label].join(" ")}`}>
                Select Filter Type:
              </label>
              <div className={classes?.typeBtnContainer}>
                <span
                  className={[
                    classes?.typeBtn,
                    type == "listing" && classes?.activeBtn,
                  ].join(" ")}
                  onClick={() => {
                    resetState();
                    setType("listing");
                  }}>
                  Listing
                </span>
                <span
                  className={[
                    classes?.typeBtn,
                    type == "category" && classes?.activeBtn,
                  ].join(" ")}
                  onClick={() => {
                    resetState();
                    setType("category");
                  }}>
                  Category
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
                    type == "groups" && classes?.activeBtn,
                  ].join(" ")}
                  onClick={() => {
                    resetState();
                    setType("groups");
                  }}>
                  Groups
                </span>
              </div>
            </div>
            {type == "listing" && (
              <>
                <DropDown
                  setter={setSelectedListing}
                  value={selectedListing}
                  placeholder={"Selected Listing"}
                  label={"Listings"}
                  options={allListings}
                  optionLabel={"title"}
                  optionValue={"_id"}
                  isMulti
                />
                <DropDown
                  setter={setSelectedStatus}
                  value={selectedStatus}
                  placeholder={"Selected Status"}
                  label={"Listing Status"}
                  options={listingStatusOptions}
                  isMulti
                />
              </>
            )}
            {type == "category" && (
              <>
                <DropDown
                  setter={setSelectedCategory}
                  value={selectedCategory}
                  placeholder={"Selected Category"}
                  label={"Categories"}
                  options={allCategories}
                  optionLabel={"name"}
                  optionValue={"_id"}
                  isMulti
                />
              </>
            )}
            {type == "city" && (
              <>
                <DropDown
                  setter={setSelectedCity}
                  value={selectedCity}
                  placeholder={"Selected City"}
                  label={"Cities"}
                  options={allCities.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  isMulti
                />
              </>
            )}
            {type == "groups" && (
              <>
                <DropDown
                  setter={setSelectedGroup}
                  value={selectedGroup}
                  placeholder={"Selected Group"}
                  label={"Groups"}
                  options={allGroups}
                  optionLabel={"name"}
                  optionValue={"_id"}
                />
              </>
            )}
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={HandleSubmitData}
              className={classes.btn}
              label={isLoading ? "Sending..." : "Send Email"}
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default SendMailToFilterUserModal;
