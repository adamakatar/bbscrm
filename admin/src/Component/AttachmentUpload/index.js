import React, { useRef } from "react";
import { MdModeEdit, MdPictureAsPdf } from "react-icons/md";
import { RiDeleteBinLine, RiFileExcel2Fill } from "react-icons/ri";
import { AiFillEye } from "react-icons/ai";
import { FaFileUpload, FaFileCsv, FaFileWord } from "react-icons/fa";

import classes from "./AttachmentUpload.module.css";
import { imageUrl } from "../../config/apiUrl";
import { Button } from "../Button/Button";
import { toast } from "react-toastify";

function RenderComp({ state }) {
  return (
    <>
      {((typeof state == "object"
        ? ["png", "jpeg", "jpg", "svg", "jfif"].includes(
            state?.name?.split(".")[1]
          )
        : ["png", "jpeg", "svg+xml", "jpg", "jfif"].includes(
            state?.split(".")[1]
          )) && (
        <img
          className={classes.img}
          src={
            typeof state == "object"
              ? URL.createObjectURL(state)
              : `${imageUrl(state)}`
          }
        />
      )) ||
        ((typeof state == "object"
          ? ["doc", "docx"].includes(state?.name?.split(".")[1])
          : state?.split(".")[1] == "docx") && (
          <FaFileWord className={classes.typeIcon} size={35} />
        )) ||
        ((typeof state == "object"
          ? ["xlsx"]?.includes(state?.name?.split(".")[1])
          : state?.split(".")[1] == "xlsx") && (
          <RiFileExcel2Fill className={classes.typeIcon} size={35} />
        )) ||
        ((typeof state == "object"
          ? ["pdf"]?.includes(state?.name?.split(".")[1])
          : state?.split(".")[1] == "pdf") && (
          <MdPictureAsPdf className={classes.typeIcon} size={35} />
        )) ||
        ((typeof state == "object"
          ? ["csv"]?.includes(state?.name?.split(".")[1])
          : state?.split(".")[1] == "csv") && (
          <FaFileCsv className={classes.typeIcon} size={35} />
        ))}
    </>
  );
}

function AttachmentUpload({ state, setter, edit = true, onDelete }) {
  const inputRef = useRef(null);
  const HandleUploadFile = (e) => {
    const fileType = e.target.files[0].type;
    if (fileType?.split("/")[1] == "mp4") {
      return toast.warn("Invalid file type");
    }
    setter(e.target.files[0]);
  };
  return (
    <div className={classes.box}>
      {state?.name || typeof state == "string" ? (
        <div className={classes.csvBox}>
          <RenderComp state={state} />
          {/* On Hover */}
          <div className={classes.viewBtnBox}>
            <Button
              leftIcon={<AiFillEye />}
              className={classes.icon}
              onClick={() =>
                window.open(
                  typeof state == "object"
                    ? URL.createObjectURL(state)
                    : `${imageUrl(state)}`
                )
              }
            />
          </div>
          {/* On Hover */}

          {edit && (
            <div className={classes.editAndDelete}>
              <Button
                className={classes.icon}
                onClick={() => {
                  onDelete();
                }}
                leftIcon={<RiDeleteBinLine />}
              />

              <Button
                className={classes.icon}
                onClick={() => {
                  inputRef.current.click();
                }}
                leftIcon={<MdModeEdit />}
              />
            </div>
          )}
        </div>
      ) : (
        <div
          className={classes.csvBox}
          onClick={() => {
            edit && inputRef.current.click();
          }}
        >
          {edit ? (
            <>
              <FaFileUpload color={"var(--main-color)"} size={30} />
              <span className={classes?.uploadText}>upload</span>
            </>
          ) : (
            <FaFileCsv color={"var(--main-color)"} size={50} />
          )}
        </div>
      )}
      {/* Input For Image Upload */}
      <input
        hidden
        type={"file"}
        ref={inputRef}
        onChange={(e) => HandleUploadFile(e)}
      />
    </div>
  );
}

export default AttachmentUpload;
