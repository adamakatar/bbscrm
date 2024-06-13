import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import UploadCsvBox from "../../Component/UploadCsvBox";
import { BulkUserCsvToJsonConvertion } from "../../Helper/CsvToJsonConvertion";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddBulkUserModal.module.css";
import { downloadFileFromUrl } from "../../constant/downloadFile";
import { DropDown } from "../../Component/DropDown/DropDown";
const AddBulkUserModal = ({
  show,
  setShow,
  handleSubmit,
  isLoading = false,
}) => {
  const [file, setFile] = useState(null);
  const [designation, setDesignation] = useState({
    label: "Buyer",
    value: "Buyer",
  });

  const HandleSubmitData = async () => {
    if (!file?.name) {
      return toast.error(`CSV File is required`);
    }
    await BulkUserCsvToJsonConvertion(file, async (e) => {
      if (e?.length > 500) {
        return toast.error("CSV must contain upto 500 users.");
      }
      const refactoredUsers = e?.forEach((item) => {
        item.designation = designation?.value;
      });
      await handleSubmit({
        users: e,
        role: ["buyer", "seller"],
      });
    });
  };

  return (
    <div>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={"Upload CSV"}
      >
        <div className={classes.container}>
          <Row className={classes.row}>
            <Col md={12} className={classes.csvBtnCol}>
              <Button
                onClick={() =>
                  downloadFileFromUrl("/bulkUserFormat.csv", "CSV Format")
                }
                label={"Download CSV Format"}
              />
            </Col>
            <Col md={12} className={classes.inputCol}>
              <UploadCsvBox
                setter={setFile}
                state={file}
                onDelete={() => setFile(null)}
                className={classes.csvBox}
              />
            </Col>
            <Col md={12} className={classes.inputCol}>
              <DropDown
                isSearchable={false}
                placeholder={"Role"}
                options={[
                  { label: "Buyer", value: "Buyer" },
                  { label: "Seller", value: "Seller" },
                ]}
                value={designation}
                setter={setDesignation}
              />
            </Col>
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={HandleSubmitData}
              className={classes.btn}
              label={isLoading ? "Uploading..." : "Upload CSV"}
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default AddBulkUserModal;
