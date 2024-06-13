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
  recordsLimit,
} from "../../../config/apiUrl";
import AddOrEditTaskManagerTemplateModal from "../../../modals/AddOrEditTaskManagerTemplateModal";
import classes from "./TaskManagerAllTemplates.module.css";
import PoperComponent from "../../../Component/PopperComponent";
import { useSelector } from "react-redux";
import TableSkeleton from "../../../Component/TableSkeleton";
import NoData from "../../../Component/NoData/NoData";
import { toast } from "react-toastify";
import AreYouSureModal from "../../../modals/AreYouSureModal";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../../CustomHooks/useDebounce";
import { setAllCommon } from "../../../store/common/commonSlice";
import { useDispatch } from "react-redux";

const TaskManagerAllTemplates = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state?.authReducer?.access_token);
  const data = useSelector((state) => state?.commonReducer);
  const [templateList, setTemplateList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);

  const anchorRef = useRef(null);
  const [openPopper, setOpenPopper] = useState(false);
  const [indexMap, setIndexMap] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [addTemplateModal, setAddTemplateModal] = useState(false);
  const [deleteTemplateConfirm, setDeleteTemplateConfirm] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  const baseApiUrl = BaseURL(`project-templates`);

  useEffect(() => {
    getAllTaskTemplates(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    getAllTaskTemplates(1);
  }, [debouncedSearchTerm]);

  const getAllTaskTemplates = async (pageNumber) => {
    const url = `${baseApiUrl}?page=${pageNumber}&limit=${recordsLimit}&search=${search}`;

    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setTemplateList(response?.data?.templates);
      setTotalPages(Math.ceil(response?.data?.totalCount / recordsLimit));
    }
    setLoading(false);
  };

  const handleAddTemplate = async (params) => {
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
    const url = `${baseApiUrl}/create`;

    const response = await Post(url, params, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success(`Template Created Successfully.`);

      if (page == 1) {
        const oldData = [...templateList];
        oldData.unshift(response?.data);
        setTemplateList(oldData);
      } else {
        setPage(1);
      }
      setAddTemplateModal(false);
      dispatch(
        setAllCommon({
          ...data,
          allTaskManagerTemplate: [
            response?.data,
            ...data?.allTaskManagerTemplate,
          ],
        })
      );
    }
    setSubmitLoading(false);
  };

  const handleDeleteTemplate = async () => {
    const url = `${baseApiUrl}/delete/${selectedItem?._id}`;
    setSubmitLoading(true);
    const response = await Delete(url, null, apiHeader(accessToken));
    if (response !== undefined) {
      const oldData = [...templateList];
      oldData.splice(indexMap, 1);
      setTemplateList(oldData);
      toast.success(`Template Deleted Successfully.`);
      setOpenPopper(false);
      setDeleteTemplateConfirm(false);
      setIndexMap(null);
      setSelectedItem(null);
    }
    setSubmitLoading(false);
  };

  const handleEditTemplate = async (params) => {
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
    const url = `${baseApiUrl}/update`;
    setSubmitLoading(true);
    const data = {
      ...params,
      slug: selectedItem?.slug,
    };

    const response = await Patch(url, data, apiHeader(accessToken));
    if (response !== undefined) {
      const oldData = [...templateList];
      oldData.splice(indexMap, 1, response?.data);
      setTemplateList(oldData);
      toast.success(`Template Updated Successfully.`);
      setOpenPopper(false);
      setAddTemplateModal(false);
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
      setDeleteTemplateConfirm(true);
    } else if (flag == "Edit") {
      setAddTemplateModal(true);
    } else {
      navigate(`/template-task/${selectedItem?.slug}`);
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
       .table100-body table{
        height:100%;
      }
      .table100-body td {
        padding-block: 35px;
      }
  @media screen and (max-width:1440px){
      // .table100-head, .table100-body{
      //   width:1000px;
      // }
      .table100.ver1{
        overflow-x:scroll !important;
      }
    }
  @media screen and (max-width:991px){
      .table100-head, .table100-body{
        width:100%;
      }     
    }
  @media screen and (max-width:900px){
      .table100-head, .table100-body{
        width:900px;
      }     
    }

      `}</style>
      <div>
        <SideBarSkeleton>
          <div className={[classes.mainContainer]}>
            <div className={[classes.headerContainer]}>
              <h3>Project Task Templates</h3>
              <div className={[classes.inputDiv]}>
                <Input
                  setter={setSearch}
                  value={search}
                  customStyle={{
                    height: "43px",
                    border: "1px solid #2A353D",
                    borderRadius: "3px",
                    width: "280px",
                    padding: "0px",
                  }}
                  inputStyle={{
                    padding: "8px 14px",
                    fontSize: "14px",
                  }}
                  placeholder={"Search"}
                  rightIcon={
                    <BiSearch size={22} color={"var(--placeholder-color)"} />
                  }
                />
                <Button
                  label="Add Template"
                  className={classes.addProjectBtn}
                  onClick={() => {
                    setSelectedItem(null);
                    setAddTemplateModal(true);
                  }}
                />
              </div>
            </div>

            <div class="table100 ver1 m-b-110">
              <div class="table100-head">
                <table>
                  <thead>
                    <tr class="row100 head">
                      <th
                        class="cell100 column1"
                        style={{ width: "10%", textAlign: "start" }}
                      >
                        S.No
                      </th>
                      <th
                        class="cell100 column2"
                        style={{ width: "50%", textAlign: "start" }}
                      >
                        Template Name
                      </th>
                      <th
                        class="cell100 column3"
                        style={{ width: "10%", textAlign: "center" }}
                      >
                        Task Count
                      </th>
                      <th
                        class="cell100 column4"
                        style={{ width: "20%", textAlign: "center" }}
                      >
                        Date Created
                      </th>
                      <th
                        class="cell100 column5"
                        style={{ width: "10%", textAlign: "center" }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              {loading ? (
                <TableSkeleton rowsCount={recordsLimit} colsCount={5} />
              ) : (
                <div class="table100-body js-pscroll ps ps--active-y">
                  <table>
                    <tbody>
                      {templateList?.length > 0 ? (
                        templateList?.map((item, index) => (
                          <tr
                            class="row100 body"
                            style={{
                              backgroundColor:
                                selectedItem?._id == item?._id && "#E5F5FF",
                            }}
                          >
                            <td
                              class="cell100 column1"
                              style={{
                                width: "10%",
                                textAlign: "start",
                              }}
                            >
                              {page == 1
                                ? index + 1
                                : recordsLimit * (page - 1) + index + 1}
                            </td>
                            <td
                              class="cell100 column2"
                              style={{ width: "50%", textAlign: "start" }}
                            >
                              {item?.name}
                            </td>
                            <td
                              class="cell100 column3"
                              style={{ width: "10%", textAlign: "center" }}
                            >
                              <div style={{ position: "relative" }}>
                                {item?.tasks?.length}
                              </div>
                            </td>
                            <td
                              class="cell100 column4"
                              style={{ width: "20%", textAlign: "center" }}
                            >
                              {moment(item?.createdAt).format("L")}
                            </td>
                            <td
                              class="cell100 column5"
                              style={{ width: "10%", textAlign: "center" }}
                            >
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
                                }}
                              >
                                <BsThreeDots
                                  size={30}
                                  className={[classes.threeDots]}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <NoData text={"No Template Found"} />
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {templateList?.length > 0 && (
              <div className={[classes.paginationDiv]}>
                <PaginationComponent
                  totalPages={totalPages}
                  currentPage={page}
                  setCurrentPage={setPage}
                />
              </div>
            )}
          </div>
        </SideBarSkeleton>
      </div>

      {addTemplateModal && (
        <AddOrEditTaskManagerTemplateModal
          handleSubmit={
            selectedItem == null ? handleAddTemplate : handleEditTemplate
          }
          show={addTemplateModal}
          setShow={setAddTemplateModal}
          data={selectedItem?.name}
          isLoading={submitloading}
        />
      )}

      <AreYouSureModal
        show={deleteTemplateConfirm}
        setShow={setDeleteTemplateConfirm}
        subTitle={`Do you want to delete ${selectedItem?.name} Template`}
        onClick={handleDeleteTemplate}
        isApiCall={submitloading}
      />

      <PoperComponent
        handleClick={handleActionClick}
        open={openPopper}
        setOpen={setOpenPopper}
        anchorRef={anchorRef}
        data={["Edit", "Preview", "Delete"]}
      />
    </>
  );
};

export default TaskManagerAllTemplates;
