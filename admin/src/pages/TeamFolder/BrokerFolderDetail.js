import React, { useEffect, useState } from "react";
import { RiFolderOpenFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Get, Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import CustomBreadcrumb from "../../Component/CustomBreadcrumb";
import FolderAndFileBox from "../../Component/FolderAndFileBox";
import Loader from "../../Component/Loader";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { apiHeader, BaseURL, CreateFormData } from "../../config/apiUrl";
import CreateFolderModal from "../../modals/CreateFolderModal";
import UploadFileInFolderModal from "../../modals/UploadFileInFolderModal";
import classes from "./ViewTeamFolderDetail.module.css";

const NoFolderComp = () => {
  return (
    <div className={classes.noFolderComp}>
      <RiFolderOpenFill />
      <p>No Folders And Files Found In This Folder</p>
    </div>
  );
};

const BrokerFolderDetail = () => {
  const id = useParams()?.id;
  const { user, access_token: token } = useSelector(
    (state) => state?.authReducer
  );
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  // calculate previous folder
  const [prevFolder, setPrevFolder] = useState([]);
  // For  File and Folder Modal state
  const [show, setShow] = useState("");
  const [isUploading, setIsUploading] = useState("");

  const getAllFolders = async () => {
    const url = BaseURL(
      `data-room?child=${selectedFolder == null ? id : selectedFolder?._id}`
    );
    setLoading(true);
    const response = await Get(url, token);
    if (response !== undefined) {
      setData(response?.data?.data?.folders);
      if (selectedFolder == null) {
        setPrevFolder([...prevFolder, response?.data?.data?.folders[0]]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllFolders();
  }, [selectedFolder]);

  const createFolder = async (e) => {
    const url = BaseURL("data-room");
    let params = {
      ...e,
      parent: selectedFolder == null ? id : selectedFolder?._id,
    };
    setIsUploading("folder");

    const response = await Post(url, params, apiHeader(token));
    if (response !== undefined) {
      const newData = JSON.parse(JSON.stringify(data));
      newData[0].children = [...newData[0]?.children, response?.data?.data];
      setData([...newData]);
      toast.success("Folder created successfully");
      setIsUploading("");
      setShow("");
    } else {
      setIsUploading("");
    }
  };
  // create file
  const uploadFile = async (e) => {
    const url = BaseURL("data-room");
    let params = {
      file: e?.file,
      parent: selectedFolder == null ? id : selectedFolder?._id,
    };

    const formData = await CreateFormData(params);
    e?.roles?.map((item) => formData.append("roles[]", item));
    setIsUploading("file");

    const response = await Post(url, formData, apiHeader(token));
    if (response !== undefined) {
      const newAllFoler = [...data];
      newAllFoler[0].children = [
        ...newAllFoler[0].children,
        response?.data?.data,
      ];
      setData(newAllFoler);
      toast.success("File upload successfully");
      setIsUploading("");
      setShow("");
    } else {
      setIsUploading("");
    }
  };

  const breadcrumbData = prevFolder?.map((item) => ({
    title: item?.name,
    id: item?._id,
  }));

  return (
    <SideBarSkeleton>
      <div className={[classes.mainContainer]}>
        <div className={[classes.headerContainer]}>
          <CustomBreadcrumb
            data={breadcrumbData}
            active={selectedFolder == null ? data[0]?._id : selectedFolder?._id}
            onClick={(e) => {
              const tempData = prevFolder?.find((item, i) => item?._id == e);
              setSelectedFolder(tempData);
              const tempPrev = [...prevFolder];
              const findPrevIndex = tempPrev?.findIndex(
                (item) => item?._id == e
              );
              tempPrev.splice(findPrevIndex + 1, tempPrev?.length);
              setPrevFolder(tempPrev);
            }}
          />
        </div>
        {breadcrumbData?.length == 1 ? (
          <div className={classes.btnsDiv}>
            <Button label={"Create Folder"} onClick={() => setShow("folder")} />
            <Button label={"Upload File"} onClick={() => setShow("file")} />
          </div>
        ) : (
          selectedFolder?.owner == user?._id && (
            <div className={classes.btnsDiv}>
              <Button
                label={"Create Folder"}
                onClick={() => setShow("folder")}
              />
              <Button label={"Upload File"} onClick={() => setShow("file")} />
            </div>
          )
        )}
        {loading ? (
          <div className={classes.noFolderMainDiv}>
            <Loader />
          </div>
        ) : (
          <div className={[classes.foldersDiv]}>
            <div className={classes.folderBox}>
              {data[0]?.children?.length == 0 ? (
                <div className={classes.noFolderMainDiv}>
                  <NoFolderComp />
                </div>
              ) : (
                data[0]?.children
                  ?.filter((item) => item?.owner === user?._id)
                  ?.map((item, i) => (
                    <div className={classes.folderInnerBox} key={i}>
                      <FolderAndFileBox
                        data={item}
                        allowDelete={item?.owner == user?._id}
                        allowEdit={item?.owner == user?._id}
                        //   allowDelete={
                        //     user?.role?.includes("broker")
                        //       ? data[0]?.type == "broker" ||
                        //         (breadcrumbData?.length > 1 && true)
                        //       : breadcrumbData?.length > 1 && true
                        //   }
                        //   allowEdit={
                        //     user?.role?.includes("broker")
                        //       ? data[0]?.type == "broker" ||
                        //         (breadcrumbData?.length > 1 && true)
                        //       : breadcrumbData?.length > 1 && true
                        //   }
                        onClick={() => {
                          const findObj = prevFolder?.find(
                            (innerItem) => innerItem?._id == item?._id
                          );
                          if (!findObj) {
                            setPrevFolder([...prevFolder, item]);
                          }
                          setSelectedFolder(item);
                        }}
                        onUpdate={(type, e) => {
                          const newAllFoler = [...data];
                          if (type == "edit") {
                            newAllFoler[0].children.splice(i, 1, e);
                          } else {
                            newAllFoler[0].children.splice(i, 1);
                          }
                          setData(newAllFoler);
                        }}
                      />
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>
      {show == "folder" && (
        <CreateFolderModal
          show={show == "folder"}
          setShow={() => setShow("")}
          isLoading={isUploading == "folder"}
          handleSubmit={createFolder}
        // parentRoles={
        //   selectedFolder == null ? data[0]?.roles : selectedFolder?.roles
        // }
        />
      )}
      {show == "file" && (
        <UploadFileInFolderModal
          show={show == "file"}
          setShow={() => setShow("")}
          isLoading={isUploading == "file"}
          handleSubmit={uploadFile}
        // parentRoles={
        //   selectedFolder == null ? data[0]?.roles : selectedFolder?.roles
        // }
        />
      )}
    </SideBarSkeleton>
  );
};

export default BrokerFolderDetail;
