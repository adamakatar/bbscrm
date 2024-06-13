import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import AttachmentUpload from "../../Component/AttachmentUpload";
import { Button } from "../../Component/Button/Button";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./UploadFileInFolderModal.module.css";

const UploadFileInFolderModal = ({
  show,
  setShow,
  handleSubmit,
  data,
  isLoading = false,
}) => {
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (data !== undefined) {
      setFile(data?.name);
    }
  }, [data]);

  const HandleSubmitData = () => {
    if (!file?.name) {
      return toast.error(`File is required`);
    }

    handleSubmit({
      file,
    });
  };

  return (
    <div>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={`${data == undefined ? "Upload" : "Edit"} File`}>
        <div className={classes.container}>
          <Row className={classes.row}>
            <Col md={12}>
              <AttachmentUpload
                setter={setFile}
                state={file}
                onDelete={() => setFile(null)}
              />
            </Col>
          </Row>
          <div className={classes.btn_main}>
            <Button
              onClick={() => HandleSubmitData()}
              className={classes.btn}
              label={
                isLoading
                  ? "Uploading..."
                  : data == null
                  ? "Upload File"
                  : "Edit File"
              }
              disabled={isLoading}
            />
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default UploadFileInFolderModal;
