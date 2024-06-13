import React, { useState } from "react";
import classes from "./FolderAndFileBox.module.css";
import { AiFillFolderOpen } from "react-icons/ai";
import { apiHeader, BaseURL, imageUrl } from "../../config/apiUrl";
import { FaFileCsv, FaFileWord } from "react-icons/fa";
import { RiFileExcel2Fill, RiDeleteBinLine } from "react-icons/ri";
import { MdPictureAsPdf, MdModeEdit } from "react-icons/md";
import { BsFillImageFill } from "react-icons/bs";
import { Delete, Patch } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import CreateFolderModal from "../../modals/CreateFolderModal";
import { toast } from "react-toastify";
import AreYouSureModal from "../../modals/AreYouSureModal";
import { mediaUrl } from "../../config/apiUrl";

const FolderAndFileBox = ({
  data,
  onClick,
  onUpdate,
  allowEdit,
  allowDelete,
}) => {
  const { access_token } = useSelector((state) => state.authReducer);
  const [isOpenModal, setIsOpenModal] = useState("");
  const [isUpdating, setIsUpdating] = useState("");

  async function update(e) {
    const url = BaseURL("data-room/update");
    let params = {
      folderId: data?._id,
      name: e?.name,
    };
    setIsUpdating("updating-folder");
    const response = await Patch(url, params, apiHeader(access_token));
    if (response) {
      onUpdate("edit", data?.isFile ? response?.data?.data : response?.data);
      setIsUpdating("");

      toast.success(
        `${data?.isFile ? "File" : "Directory"} edited successfully`
      );
      setIsOpenModal("");
    } else {
      setIsUpdating("");
    }
  }

  async function deleteFolder() {
    const url = BaseURL(`data-room/delete/${data?._id}`);

    setIsUpdating("deleting");
    const response = await Delete(url, null, apiHeader(access_token));
    if (response) {
      onUpdate("delete");
      setIsUpdating("");
      toast.success(
        `${data?.isFile ? "File" : "Directory"} deleted successfully`
      );
      setIsOpenModal("");
    }
    setIsUpdating("");
  }

  return (
    <div
      className={classes.folderDiv}
      onClick={() => {
        if (isOpenModal === "") {
          data?.isFile
            ? window.open(
                ["pdf", "docx", "xlsx", "csv"]?.includes(
                  data?.name?.split(".")[1]
                )
                  ? `${mediaUrl(data?.name)}`
                  : `${imageUrl(data?.name)}`
              )
            : onClick();
        }
      }}
    >
      {data?.isFile ? (
        <>
          {(["png", "jpeg", "svg+xml", "jpg"].includes(
            data?.name?.split(".")[1]
          ) && (
            <BsFillImageFill
              className={classes.typeIcon}
              size={70}
              color={"var(--dashboard-main-color)"}
            />
          )) ||
            (data?.name?.split(".")[1] === "docx" && (
              <FaFileWord
                className={classes.typeIcon}
                size={70}
                color={"var(--dashboard-main-color)"}
              />
            )) ||
            (data?.name?.split(".")[1] === "xlsx" && (
              <RiFileExcel2Fill
                className={classes.typeIcon}
                size={70}
                color={"var(--dashboard-main-color)"}
              />
            )) ||
            (data?.name?.split(".")[1] === "pdf" && (
              <MdPictureAsPdf
                className={classes.typeIcon}
                size={70}
                color={"var(--dashboard-main-color)"}
              />
            )) ||
            (data?.name?.split(".")[1] === "csv" && (
              <FaFileCsv
                className={classes.typeIcon}
                size={70}
                color={"var(--dashboard-main-color)"}
              />
            ))}
        </>
      ) : (
        <AiFillFolderOpen size={80} color={"var(--dashboard-main-color)"} />
      )}
      <p
        className={classes.folderName}
        title={data?.isFile ? data?.fileName : data?.name}
      >
        {data?.isFile ? data?.fileName : data?.name}
      </p>
      <div className={classes.btnsDiv}>
        {allowDelete && (
          <div
            className={classes.icon}
            onClick={(e) => {
              e?.stopPropagation();
              setIsOpenModal("deleting");
            }}
          >
            <RiDeleteBinLine />
          </div>
        )}
        {allowEdit && (
          <>
            {!data?.isFile && (
              <div
                className={classes.icon}
                onClick={(e) => {
                  e?.stopPropagation();
                  setIsOpenModal("updating-folder");
                }}
              >
                <MdModeEdit />
              </div>
            )}
          </>
        )}
      </div>
      {isOpenModal === "updating-folder" && (
        <CreateFolderModal
          isLoading={isUpdating === "updating-folder"}
          setShow={() => setIsOpenModal("")}
          show={isOpenModal === "updating-folder"}
          data={data}
          handleSubmit={update}
        />
      )}

      {isOpenModal === "deleting" && (
        <AreYouSureModal
          isApiCall={isUpdating === "deleting"}
          setShow={() => setIsOpenModal("")}
          show={isOpenModal === "deleting"}
          onClick={deleteFolder}
          subTitle={`Do you want to delete this ${
            data?.isFile ? "file" : "folder"
          }?`}
        />
      )}
    </div>
  );
};

export default FolderAndFileBox;
