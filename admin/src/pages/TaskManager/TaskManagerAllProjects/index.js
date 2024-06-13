import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { Delete, Get, Patch, Post } from "../../../Axios/AxiosFunctions";
import { Button } from "../../../Component/Button/Button";
import { Input } from "../../../Component/Input/Input";
import PaginationComponent from "../../../Component/PaginationComponent";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import {
  apiHeader,
  BaseURL,
  formRegEx,
  formRegExReplacer,
  imageUrl,
  recordsLimit,
} from "../../../config/apiUrl";
import AddProjectModal from "../../../modals/AddProjectModal";
import classes from "./TaskManagerAllProjects.module.css";
import PoperComponent from "../../../Component/PopperComponent";
import { useSelector } from "react-redux";
import TableSkeleton from "../../../Component/TableSkeleton";
import NoData from "../../../Component/NoData/NoData";
import { toast } from "react-toastify";
import AreYouSureModal from "../../../modals/AreYouSureModal";
import { Link, useNavigate } from "react-router-dom";
import useDebounce from "../../../CustomHooks/useDebounce";
import SearchInput from "../../../Component/SearchInput";

const TaskManagerAllProjects = () => {
  const navigate = useNavigate();
  const { access_token: accessToken, user } = useSelector(
    (state) => state?.authReducer
  );
  const isAdmin = !user?.role?.includes("broker");
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);

  const anchorRef = useRef(null);
  const [openPopper, setOpenPopper] = useState(false);
  const [indexMap, setIndexMap] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [addProjectModal, setAddProjectModal] = useState(false);
  const [deleteProjectConfirm, setDeleteProjectConfirm] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  // get Business Loader
  const [businessLoader, setBusinessLoader] = useState(true);
  const [businessProjects, setBusinessProjects] = useState([]);
  const [assignees, setAssignees] = useState([]);

  const addUrl = BaseURL(`projects`);

  const getBusinessProjects = async () => {
    const url = BaseURL(`business/admin/all`);
    setBusinessLoader(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setBusinessProjects(response?.data?.business);
    }
    setBusinessLoader(false);
  };

  const getAllProjects = async (pageNumber) => {
    const url = `${addUrl}?page=${pageNumber}&limit=${recordsLimit}&search=${search}`;

    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setProjectsList(response?.data?.data?.project);
      setTotalPages(Math.ceil(response?.data?.data?.totalCount / recordsLimit));
    }
    setLoading(false);
  };

  const getAssignees = async () =>{
    const url = BaseURL(`users/get-all-admins`);
    setLoading(true);
    const response = await Get(url, accessToken);
    if(!!response) 
      setAssignees(_prev =>[..._prev,response?.data?.data]);
  };

  useEffect(() => {
    getAllProjects(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    getAllProjects(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    getBusinessProjects();
    getAssignees();
  }, []);

  const handleAddProject = async (params) => {
    for (let key in params) {
      if (
        params[key] == "" ||
        params[key] == null ||
        params[key] == undefined
      ) {
        return toast.error(
          `Please provide the ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()}`
        );
      }
    }
    setSubmitLoading(true);

    const response = await Post(addUrl, params, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success(`Project Created Successfully.`);

      if (page == 1) {
        const oldData = [...projectsList];
        oldData.unshift(response?.data?.data);
        setProjectsList(oldData);
      } else {
        setPage(1);
      }
      setAddProjectModal(false);
    }
    setSubmitLoading(false);
  };

  const handleDeleteProject = async () => {
    const url = `${addUrl}/${selectedItem?.slug}`;
    setSubmitLoading(true);
    const response = await Delete(url, null, apiHeader(accessToken));
    if (response !== undefined) {
      const oldData = [...projectsList];
      oldData.splice(indexMap, 1);
      setProjectsList(oldData);
      toast.success(`Project Deleted Successfully.`);
      setOpenPopper(false);
      setDeleteProjectConfirm(false);
      setIndexMap(null);
      setSelectedItem(null);
    }
    setSubmitLoading(false);
  };

  const handleEditProject = async (params) => {
    for (let key in params) {
      if (
        params[key] == "" ||
        params[key] == null ||
        params[key] == undefined
      ) {
        return toast.error(
          `Please provide the ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()}`
        );
      }
    }
    const url = `${addUrl}/${selectedItem?.slug}`;
    setSubmitLoading(true);
    const data = {
      ...params,
      taskId: selectedItem?._id,
    };

    const response = await Patch(url, data, apiHeader(accessToken));
    if (response !== undefined) {
      const oldData = [...projectsList];
      oldData.splice(indexMap, 1, response?.data?.data);
      setProjectsList(oldData);
      toast.success(`Project Updated Successfully.`);
      setOpenPopper(false);
      setAddProjectModal(false);
      setIndexMap(null);
      setSelectedItem(null);
    }
    setSubmitLoading(false);
  };

  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };

  const handleActionClick = (flag) => {
    if (flag == "Delete") {
      setDeleteProjectConfirm(true);
    } else {
      setAddProjectModal(true);
    }
  };

  // useEffect(() => {
  //   if (!openPopper) setSelectedItem(null);
  // }, [openPopper]);

  return (
    <>
      <style>{`
      .table100-body{
        height:calc(100vh - 310px);
        overflow-y:scroll;
      }
      .table100-body td {
        padding-block: 18px;
      }
  @media screen and (max-width:1440px){
      .table100-head, .table100-body{
        width:1200px;
      }
      .table100.ver1{
        overflow-x:scroll !important;
      }
    }

      `}</style>
      <div>
        <SideBarSkeleton>
          <div className={[classes.mainContainer]}>
            <div className={[classes.headerContainer]}>
              <h3>{isAdmin ? "projects" : "assigned projects"}</h3>
              <div className={[classes.inputDiv]}>
                <SearchInput
                  setter={setSearch}
                  value={search}
                  placeholder={"Search"}
                />
                {/* {isAdmin && ( */}
                <Button
                  label="Add Project"
                  className={classes.addProjectBtn}
                  onClick={() => {
                    setSelectedItem(null);
                    setAddProjectModal(true);
                  }}
                />
                {/* )} */}
              </div>
            </div>

            <div class="table100 ver1 m-b-110">
              <div class="table100-head">
                <table>
                  <thead>
                    <tr class="row100 head">
                      <th
                        class="cell100 column1"
                        style={{ width: "20%", textAlign: "start" }}>
                        Project Name
                      </th>
                      <th
                        class="cell100 column2"
                        style={{ width: "20%", textAlign: "start" }}>
                        Listing
                      </th>
                      <th
                        class="cell100 column3"
                        style={{ width: "20%", textAlign: "start" }}>
                        Assigned Member
                      </th>
                      <th
                        class="cell100 column4"
                        style={{ width: "15%", textAlign: "start" }}>
                        Date Created
                      </th>
                      <th
                        class="cell100 column5"
                        style={{ width: "15%", textAlign: "start" }}>
                        Status
                      </th>
                      <th class="cell100 column5" style={{ width: "10%" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              {loading ? (
                <TableSkeleton rowsCount={recordsLimit} colsCount={6} />
              ) : (
                <div class="table100-body js-pscroll ps ps--active-y">
                  <table>
                    <tbody>
                      {projectsList?.length > 0 ? (
                        projectsList?.map((item, index) => (
                          <tr
                            key={index}
                            class="row100 body"
                            style={{
                              backgroundColor:
                                selectedItem?._id == item?._id && "#E5F5FF",
                            }}>
                            <td
                              class={`cell100 column1`}
                              style={{ width: "20%", textAlign: "start" }}>
                              <Link
                                to={`/task-manager/${item?.slug}`}
                                className={classes.linkText}>
                                {item?.name}
                              </Link>
                            </td>
                            <td
                              class="cell100 column2"
                              style={{
                                width: "20%",
                                textAlign: "start",
                              }}>
                              {item?.business?.title}
                            </td>
                            <td
                              class="cell100 column3"
                              style={{ width: "20%", textAlign: "start" }}>
                              <div style={{ position: "relative" }}>
                                {item?.assignTo?.slice(0, 3)?.map((item, i) => {
                                  return (
                                    <div
                                      key={i}
                                      className={[classes.teamMemberImgDiv]}
                                      style={{
                                        left:
                                          i == 1
                                            ? "35px"
                                            : i == 2
                                            ? "70px"
                                            : "0px",
                                      }}>
                                      <img
                                        src={imageUrl(item?.photo)}
                                        alt="..."
                                      />
                                    </div>
                                  );
                                })}
                                {item?.assignTo?.length > 3 && (
                                  <span className={[classes.countMember]}>
                                    +{item?.assignTo?.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td
                              class="cell100 column4"
                              style={{ width: "15%", textAlign: "start" }}>
                              {moment(item?.createdAt).format("L")}
                            </td>
                            <td
                              class="cell100 column4"
                              style={{ width: "15%", textAlign: "start" }}>
                              {item?.business?.status}
                            </td>
                            <td
                              class="cell100 column5"
                              style={{ width: "10%" }}>
                              <div
                                ref={index == indexMap ? anchorRef : null}
                                id="composition-button"
                                aria-controls={
                                  openPopper ? "composition-menu" : undefined
                                }
                                aria-expanded={openPopper ? "true" : undefined}
                                aria-haspopup="true"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIndexMap(index);
                                  setTimeout(() => {
                                    handleToggle();
                                  }, 100);
                                }}>
                                <BsThreeDots
                                  size={30}
                                  className={[classes.threeDots]}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <NoData text={"No Project Found"} />
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className={[classes.paginationDiv]}>
              <PaginationComponent
                totalPages={totalPages}
                currentPage={page}
                setCurrentPage={setPage}
              />
            </div>
          </div>
        </SideBarSkeleton>
      </div>

      {addProjectModal && (
        <AddProjectModal
          handleSubmit={
            selectedItem == null ? handleAddProject : handleEditProject
          }
          show={addProjectModal}
          setShow={setAddProjectModal}
          data={selectedItem}
          isLoading={submitloading}
          selectedListings={businessProjects}
          assignees={assignees}
        />
      )}

      <AreYouSureModal
        show={deleteProjectConfirm}
        setShow={setDeleteProjectConfirm}
        subTitle={`Do you want to delete ${selectedItem?.name} Project`}
        onClick={handleDeleteProject}
        isApiCall={submitloading}
      />

      <PoperComponent
        handleClick={handleActionClick}
        open={openPopper}
        setOpen={setOpenPopper}
        anchorRef={anchorRef}
        // data={isAdmin ? ["Edit", "Delete"] : ["Preview"]}
        data={["Edit", "Delete"]}
      />
    </>
  );
};

export default TaskManagerAllProjects;
