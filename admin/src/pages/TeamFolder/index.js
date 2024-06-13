import React, { useEffect, useState } from "react";
import { Get, Post } from "../../Axios/AxiosFunctions";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { apiHeader, BaseURL, CreateFormData } from "../../config/apiUrl";
import classes from "./TeamFolder.module.css";
import { useSelector } from "react-redux";
import FolderAndFileBox from "../../Component/FolderAndFileBox";
import { useNavigate } from "react-router-dom";
import Loader from "../../Component/Loader";
import NoData from "../../Component/NoData/NoData";
import SearchInput from "../../Component/SearchInput";
import { Button } from "../../Component/Button/Button";
import UploadFileInFolderModal from "../../modals/UploadFileInFolderModal";
import CreateFolderModal from "../../modals/CreateFolderModal";
import { toast } from "react-toastify";

const TeamFolder = () => {
  const navigate = useNavigate();
  const { user, access_token: token } = useSelector(
    (state) => state?.authReducer
  );

  const [brokerFolders, setBrokerFolders] = useState([]);
  const [companyFolders, setCompanyFolders] = useState([]);
  const [listingFolders, setListingFolders] = useState([]);
  //dlg

  const [show, setShow] = useState("");
  const [isUploading, setIsUploading] = useState("");

  // search
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState([]);

  useEffect(() => {
    getAllTeamFolder();
  }, []);

  async function createFolder(e) {
    const url = BaseURL("data-room");
    let params = {
      ...e,
      type: 'company'
    };
    setIsUploading("folder");

    const response = await Post(url, params, apiHeader(token));
    if (response !== undefined) {
      toast.success("Folder created successfully");
      setCompanyFolders([...companyFolders, response?.data?.data]);
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
      type: 'company'
    };

    const formData = await CreateFormData(params);
    e?.roles?.map((item) => formData.append("roles[]", item));
    setIsUploading("file");

    const response = await Post(url, formData, apiHeader(token));
    if (response !== undefined) {
      toast.success("File upload successfully");
      setIsUploading("");
      setShow("");
    } else {
      setIsUploading("");
    }
  } 

  const getAllTeamFolder = async () => {
    const url = BaseURL("data-room");
    setLoading(true);
    const response = await Get(url, token);
    if (response !== undefined) {
      setBrokerFolders(response?.data?.data?.brokerFolders);
      setCompanyFolders(response?.data?.data?.companyFolders);
      setListingFolders(response?.data?.data?.listingFolders);
    }
    setLoading(false);
  };
  let tempListingFolders = [...listingFolders];
  if (search?.length > 1) {
    tempListingFolders = listingFolders?.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

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
            {loading ? (
              <Loader />
            ) : (
              <div className={[classes.foldersDiv]}>
                <div className={[classes.headerContainer]}>
                  <h4>Data Room</h4>
                </div>
                {/* brokers */}
                {user?.role.includes("broker") && (
                  <div className={classes.mainFoldersDiv}>
                    <div className={[classes.headerContainer]}>
                      <h5>Broker</h5>
                    </div>
                    {brokerFolders?.length == 0 ? (
                      <NoData
                        text="No Folders Found"
                        className={classes.noData}
                      />
                    ) : (
                      <div className={classes.folderBox}>
                        {brokerFolders?.map((item, i) => (
                          <div className={classes.folderInnerBox}>
                            <FolderAndFileBox
                              key={i}
                              data={item}
                              onClick={() =>
                                navigate(`/team-folder/broker/${item?._id}`)
                              }
                              allowDelete={false}
                              allowEdit={false}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* company */}
                <div className={classes.mainFoldersDiv}>
                  <div className={[classes.headerContainer]}>
                    <span><h5>Company</h5></span>
                  </div>
                  {companyFolders?.length == 0 ? (
                    <NoData
                      text="No Folders Found"
                      className={classes.noData}
                    />
                  ) : (
                    <div className={classes.folderBox}>
                      {companyFolders?.map((item, i) => (
                        <div className={classes.folderInnerBox}>
                          <FolderAndFileBox
                            key={i}
                            data={item}
                            onClick={() =>
                              navigate(`/team-folder/company/${item?._id}`)
                            }
                            allowDelete={false}
                            allowEdit={false}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* listing */}
                <div className={classes.mainFoldersDiv}>
                  <div className={[classes.headerContainer]}>
                    <h5>Listings</h5>
                    <SearchInput
                      setter={(e) => {
                        setSearch(e);
                      }}
                      value={search}
                      placeholder={"Search"}
                    />
                  </div>
                  {tempListingFolders?.length == 0 ? (
                    <NoData
                      text="No Folders Found"
                      className={classes.noData}
                    />
                  ) : (
                    <div className={classes.folderBox}>
                      {tempListingFolders?.map((item, i) => (
                        <div className={classes.folderInnerBox}>
                          <FolderAndFileBox
                            key={i}
                            data={item}
                            onClick={() =>
                              navigate(`/team-folder/listing/${item?._id}`)
                            }
                            allowDelete={false}
                            allowEdit={false}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </SideBarSkeleton>
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

      </div>
    </>
  );
};

export default TeamFolder;
