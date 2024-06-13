import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input/Input";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddProjectModal.module.css";

const AddProjectModal = ({
  show,
  setShow,
  handleSubmit,
  data,
  isLoading = false,
  selectedListings = [],
  assignees = []
}) => {
  const { user } = useSelector((state) => state?.authReducer);

  const { allListing, allBrokers } = useSelector(
    (state) => state?.commonReducer
  );
  const isAdmin = !user?.role?.includes("broker");

  const [projectName, setProjectName] = useState("");
  const [listingName, setListingName] = useState("");
  const [assignTo, setAssignTo] = useState([]);

  useEffect(() => {
    if (!!data) {
      let listObject = allListing.find((x) => x?._id == data?.business?._id);
      setProjectName(data?.name);
      setListingName(listObject);
      setAssignTo(data?.assignTo);
    }
  }, []);

  const HandleSubmitData = () => {
    const newAssignToArray = assignTo?.map((item, index) => {
      return item?._id;
    });

    handleSubmit({
      name: projectName,
      assignTo: newAssignToArray,
      business: listingName?._id,
    });
  };

  return (
    <>
      <style>{`
        .modal-content{
          overflow:visible !important;
        }
      `}</style>
      <div>
        <ModalSkeleton
          show={show}
          setShow={setShow}
          width="700px"
          borderRadius="20px"
          header={data == null ? "Add Project" : "Edit Project"}>
          <div className={classes.addProjectModal_main}>
            <Row className={classes.addProject_row}>
              <Input
                setter={setProjectName}
                value={projectName}
                placeholder={"Project Name"}
              />
              <DropDown
                setter={(e) => {
                  setListingName(e);
                  let listBrokers = [];
                  listBrokers = e?.broker.map((item) => item?._id);
                  setAssignTo(listBrokers);
                }}
                value={listingName}
                placeholder={"Listing Name"}
                options={selectedListings?.filter((item) => item?.title)}
                optionLabel={"title"}
                optionValue={"title"}
              />
              <DropDown
                setter={setAssignTo}
                value={assignTo}
                isMulti
                placeholder={"Assigned To"}
                options={assignees[0]}
                getOptionLabel={(option) =>
                  option?.firstName + " " + option?.lastName
                }
                getOptionValue={(option) =>
                  option?.firstName + " " + option?.lastName
                }
              />
            </Row>
            <div className={classes.btn_main}>
              <Button
                onClick={() => HandleSubmitData()}
                className={classes.btn}
                label={
                  isLoading
                    ? "Submitting..."
                    : data == null
                    ? "Add Project"
                    : "Edit Project"
                }
                disabled={isLoading}
              />
            </div>
          </div>
        </ModalSkeleton>
      </div>
    </>
  );
};

export default AddProjectModal;
