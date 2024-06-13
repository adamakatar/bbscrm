import React, { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Delete, Get, Patch, Post } from "../../../Axios/AxiosFunctions";
import { Button } from "../../../Component/Button/Button";
import PaginationComponent from "../../../Component/PaginationComponent";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import {
  apiHeader,
  BaseURL,
  formRegEx,
  formRegExReplacer,
  recordsLimit,
} from "../../../config/apiUrl";
import classes from "./TaskManagerTemplateTask.module.css";
import PoperComponent from "../../../Component/PopperComponent";
import { useSelector } from "react-redux";
import TableSkeleton from "../../../Component/TableSkeleton";
import NoData from "../../../Component/NoData/NoData";
import { toast } from "react-toastify";
import AddTaskModal from "../../../modals/AddTaskModal";
import AreYouSureModal from "../../../modals/AreYouSureModal";
import { useParams } from "react-router-dom";

const TaskManagerTemplateTask = () => {
  const slug = useParams()?.slug;
  const accessToken = useSelector((state) => state?.authReducer?.access_token);
  const [allTask, setAllTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const anchorRef = useRef(null);
  const [openPopper, setOpenPopper] = useState(false);
  const [indexMap, setIndexMap] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [addTaskModal, setAddTaskModal] = useState(false);
  const [deleteTaskConfirm, setDeleteTaskConfirm] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  const addUrl = BaseURL(`template-tasks`);

  useEffect(() => {
    getAllTasks();
  }, [page]);

  const getAllTasks = async () => {
    const url = BaseURL(
      `project-templates/${slug}?page=${page}&limit=${recordsLimit}`
    );
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setAllTask(response?.data?.tasks);
      setTotalPages(Math.ceil(response?.data?.totalCount / recordsLimit));
    }
    setLoading(false);
  };

  const handleAddTask = async (params) => {
    for (let key in params) {
      if (key === "description") {
        continue; // Skip this iteration
      }
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
    const data = { ...params, slug };
    setSubmitLoading(true);

    const response = await Post(addUrl, data, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success(`Task Created Successfully.`);

      if (page == 1) {
        const oldData = [...allTask];
        oldData.unshift(response?.data?.data);
        setAllTask(oldData);
      } else {
        setPage(1);
      }
      setAddTaskModal(false);
    }
    setSubmitLoading(false);
  };

  const handleDeleteTask = async () => {
    const url = `${addUrl}/delete/${slug}/${selectedItem?._id}`;
    setSubmitLoading(true);
    const response = await Delete(url, null, apiHeader(accessToken));
    if (response !== undefined) {
      const oldData = [...allTask];
      oldData.splice(indexMap, 1);
      setAllTask(oldData);
      toast.success(`Task Deleted Successfully.`);
      setOpenPopper(false);
      setDeleteTaskConfirm(false);
      setIndexMap(null);
      setSelectedItem(null);
    }
    setSubmitLoading(false);
  };

  const handleEditTask = async (params) => {
    for (let key in params) {
      if (key === "description") {
        continue; // Skip this iteration
      }
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
    const data = {
      ...params,
      taskId: selectedItem?._id,
    };

    const response = await Patch(
      `${addUrl}/update`,
      data,
      apiHeader(accessToken)
    );
    if (response !== undefined) {
      const oldData = [...allTask];
      oldData.splice(indexMap, 1, response?.data?.data);
      setAllTask(oldData);
      toast.success(`Task Updated Successfully.`);
      setOpenPopper(false);
      setAddTaskModal(false);
      setIndexMap(null);
      setSelectedItem(null);
    }
    setSubmitLoading(false);
  };

  const handleToggleActionPopup = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };

  const handleActionClick = (flag) => {
    if (flag == "Delete") {
      setDeleteTaskConfirm(true);
    } else {
      setAddTaskModal(true);
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
        padding-block: 35px;
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
              <h3>Template Tasks</h3>
              <Button
                label="Add Task"
                className={classes.addProjectBtn}
                onClick={() => {
                  setSelectedItem(null);
                  setAddTaskModal(true);
                }}
              />
            </div>

            <div class="table100 ver1 m-b-110">
              <div class="table100-head">
                <table>
                  <thead>
                    <tr class="row100 head">
                      <th
                        class="cell100 column1"
                        style={{ width: "10%", textAlign: "start" }}>
                        S No
                      </th>
                      <th
                        class="cell100 column2"
                        style={{ width: "20%", textAlign: "start" }}>
                        Task Name
                      </th>
                      <th
                        class="cell100 column3"
                        style={{ width: "60%", textAlign: "start" }}>
                        Description
                      </th>
                      <th
                        class="cell100 column4"
                        style={{ width: "10%", textAlign: "center" }}>
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
                      {allTask?.length > 0 ? (
                        allTask?.map((item, index) => (
                          <tr
                            class="row100 body"
                            style={{
                              backgroundColor:
                                selectedItem?._id == item?._id && "#E5F5FF",
                            }}>
                            <td
                              class="cell100 column1"
                              style={{ width: "10%", textAlign: "start" }}>
                              {index + 1}
                            </td>
                            <td
                              class="cell100 column2"
                              style={{
                                width: "20%",
                                textAlign: "start",
                              }}>
                              {item?.title}
                            </td>
                            <td
                              class="cell100 column3"
                              style={{ width: "60%", textAlign: "start" }}>
                              {item?.description}
                            </td>

                            <td
                              class="cell100 column4"
                              style={{ width: "10%", textAlign: "center" }}>
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
                                    handleToggleActionPopup();
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
                        <NoData text={"No Task Found"} />
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* <div className={[classes.paginationDiv]}>
              <PaginationComponent
                totalPages={totalPages}
                currentPage={page}
                setCurrentPage={setPage}
              />
            </div> */}
          </div>
          {addTaskModal && (
            <AddTaskModal
              handleSubmit={
                selectedItem == null ? handleAddTask : handleEditTask
              }
              show={addTaskModal}
              setShow={setAddTaskModal}
              data={selectedItem}
              type={"template"}
              isLoading={submitloading}
            />
          )}
          <AreYouSureModal
            show={deleteTaskConfirm}
            setShow={setDeleteTaskConfirm}
            subTitle={`Do you want to delete ${selectedItem?.title} task`}
            onClick={handleDeleteTask}
            isApiCall={submitloading}
          />
        </SideBarSkeleton>
      </div>

      <PoperComponent
        handleClick={handleActionClick}
        open={openPopper}
        setOpen={setOpenPopper}
        anchorRef={anchorRef}
        data={["Edit", "Delete"]}
        isCloseOnClick={false}
      />
    </>
  );
};

export default TaskManagerTemplateTask;
