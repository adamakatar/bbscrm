import React, { useEffect, useState } from "react";
import { Get, Post } from "../../Axios/AxiosFunctions";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { apiHeader, BaseURL, CreateFormData } from "../../config/apiUrl";
import classes from "./ViewTeamFolderDetail.module.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../Component/Loader";
import FolderAndFileBox from "../../Component/FolderAndFileBox";
import UploadFileInFolderModal from "../../modals/UploadFileInFolderModal";
import CreateFolderModal from "../../modals/CreateFolderModal";
import { Button } from "../../Component/Button/Button";
import { toast } from "react-toastify";
import CustomBreadcrumb from "../../Component/CustomBreadcrumb";
import { RiFolderOpenFill } from "react-icons/ri";

const NoFolderComp = () => {
  return (
    <div className={classes.noFolderComp}>
      <RiFolderOpenFill />
      <p>No Folders And Files Found In This Folder</p>
    </div>
  );
};

const ViewTeamFolderDetail = () => {
  const id = useParams()?.id;
  const token = useSelector((state) => state?.authReducer?.access_token);
  const userRole = useSelector((state) => state?.authReducer?.user?.role);
  const user = useSelector((state) => state?.authReducer?.user);

  const [allFolders, setAllFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [subFolder, setSubFolder] = useState(null);

  // calculate previous folder
  const [prevFolder, setPrevFolder] = useState([]);
  // For  File and Folder Modal state
  const [show, setShow] = useState("");
  const [isUploading, setIsUploading] = useState("");

  const isMyFolder =
    (allFolders[0]?.type == "data-room" &&
      allFolders[0]?.business?.broker?.includes(user?._id)) ||
    (allFolders[0]?.type == "company" &&
      allFolders[0]?.business?.broker?.includes(user?._id));

  // create folder
  async function createFolder(e) {
    const url = BaseURL("data-room");
    let params = {
      ...e,
      parent: subFolder == null ? id : subFolder?._id,
    };
    setIsUploading("folder");

    const response = await Post(url, params, apiHeader(token));
    if (response !== undefined) {
      // const newData = [...allFolders];
      const newData = JSON.parse(JSON.stringify(allFolders));
      newData[0].children = [...newData[0]?.children, response?.data?.data];
      setAllFolders([...newData]);
      toast.success("Folder created successfully");
      setIsUploading("");
      setShow("");
    } else {
      setIsUploading("");
    }
  }
  // create file
  async function uploadFile(e) {
    const url = BaseURL("data-room");
    let params = {
      file: e?.file,
      parent: subFolder == null ? id : subFolder?._id,
    };

    const formData = await CreateFormData(params);
    e?.roles?.map((item) => formData.append("roles[]", item));
    setIsUploading("file");

    const response = await Post(url, formData, apiHeader(token));
    if (response !== undefined) {
      const newAllFoler = [...allFolders];
      newAllFoler[0].children = [
        ...newAllFoler[0].children,
        response?.data?.data,
      ];
      setAllFolders(newAllFoler);
      toast.success("File upload successfully");
      setIsUploading("");
      setShow("");
    } else {
      setIsUploading("");
    }
  } // get all folders
  const getAllTeamFolder = async () => {
    const url = BaseURL(
      `data-room?child=${subFolder == null ? id : subFolder?._id}`
    );
    setLoading(true);
    const response = await Get(url, token);
    if (response !== undefined) {
      setAllFolders(response?.data?.data?.folders);
      if (subFolder == null) {
        setPrevFolder([...prevFolder, response?.data?.data?.folders[0]]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    // (subFolder?.children?.length > 0 || subFolder == null) &&
    getAllTeamFolder();
  }, [subFolder]);

  const breadcrumbData = prevFolder?.map((item) => ({
    title: item?.name,
    id: item?._id,
  }));


  return (
    <>
      <style>{`
      .table100-body{
        max-height:calc(100vh - 310px);
      }
      .table100-body td {
        padding-block: 25px;
      }
      `}</style>
      <div>
        <SideBarSkeleton>
          <div className={[classes.mainContainer]}>
            <div className={[classes.headerContainer]}>
              <CustomBreadcrumb
                data={breadcrumbData}
                active={subFolder == null ? allFolders[0]?._id : subFolder?._id}
                onClick={(e) => {
                  const tempData = prevFolder?.find(
                    (item, i) => item?._id == e
                  );
                  setSubFolder(tempData);

                  const tempPrev = [...prevFolder];
                  const findPrevIndex = tempPrev?.findIndex(
                    (item) => item?._id == e
                  );
                  tempPrev.splice(findPrevIndex + 1, tempPrev?.length);
                  setPrevFolder(tempPrev);
                }}
              />
            </div>
            {userRole?.some((e) => ["admin", "broker"].includes(e))
              ? (["broker", "company"].includes(allFolders[0]?.type)
                ? true
                : breadcrumbData?.length > 1) && (
                <div className={classes.btnsDiv}>
                  <Button
                    label={"Create Folder"}
                    onClick={() => setShow("folder")}
                  />
                  <Button
                    label={"Upload File"}
                    onClick={() => setShow("file")}
                  />
                </div>
              )
              : breadcrumbData?.length > 1 && (
                <div className={classes.btnsDiv}>
                  <Button
                    label={"Create Folder"}
                    onClick={() => setShow("folder")}
                  />
                  <Button
                    label={"Upload File"}
                    onClick={() => setShow("file")}
                  />
                </div>
              )}
            {
              loading ? (
                <div className={classes.noFolderMainDiv}>
                  <Loader />
                </div>
              ) : (
                <div className={[classes.foldersDiv]}>
                  <div className={classes.folderBox}>
                    {allFolders[0]?.children?.length == 0 ? (
                      <div className={classes.noFolderMainDiv}>
                        <NoFolderComp />
                      </div>
                    ) : (
                      allFolders[0]?.children?.map((item, i) => (
                        <div className={classes.folderInnerBox} key={i}>
                          <FolderAndFileBox
                            data={item}
                            // allowDelete={breadcrumbData?.length > 1 ? true : false}
                            // allowEdit={breadcrumbData?.length > 1 ? true : false}
                            allowDelete={
                              userRole?.includes("broker")
                                ? allFolders[0]?.type == "broker" ||
                                (breadcrumbData?.length > 1 && true)
                                : breadcrumbData?.length > 1 && true
                            }
                            allowEdit={
                              userRole?.includes("broker")
                                ? allFolders[0]?.type == "broker" ||
                                (breadcrumbData?.length > 1 && true)
                                : breadcrumbData?.length > 1 && true
                            }
                            onClick={() => {
                              // if (
                              //   allFolders[0]?.children?.length == 0 ||
                              //   item?.children?.length == 0
                              // ) {
                              // } else
                              const findObj = prevFolder?.find(
                                (innerItem) => innerItem?._id == item?._id
                              );
                              if (!findObj) {
                                setPrevFolder([...prevFolder, item]);
                              }
                              setSubFolder(item);
                            }}
                            onUpdate={(type, data) => {
                              const newAllFoler = [...allFolders];
                              if (type == "edit") {
                                newAllFoler[0].children.splice(i, 1, data);
                              } else {
                                newAllFoler[0].children.splice(i, 1);
                              }
                              setAllFolders(newAllFoler);
                            }}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
              // }
            }
          </div>
        </SideBarSkeleton>
      </div>
      {show == "folder" && (
        <CreateFolderModal
          show={show == "folder"}
          setShow={() => setShow("")}
          isLoading={isUploading == "folder"}
          handleSubmit={createFolder}
        // parentRoles={
        //   subFolder == null ? allFolders[0]?.roles : subFolder?.roles
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
        //   subFolder == null ? allFolders[0]?.roles : subFolder?.roles
        // }
        />
      )}
    </>
  );
};

export default ViewTeamFolderDetail;
