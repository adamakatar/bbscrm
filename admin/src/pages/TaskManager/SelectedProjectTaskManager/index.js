import React, { useEffect, useState } from "react";
import { Button } from "../../../Component/Button/Button";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import classes from "./SelectedProjectTaskManager.module.css";
import TodoCard from "../../../Component/TodoCard";
import { Row, Col } from "react-bootstrap";
import AddTaskModal from "../../../modals/AddTaskModal";
import AreYouSureModal from "../../../modals/AreYouSureModal";
import { Delete, Get, Patch, Post } from "../../../Axios/AxiosFunctions";
import {
  apiHeader,
  BaseURL,
  formRegEx,
  formRegExReplacer,
} from "../../../config/apiUrl";
import { useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import noTaskFoundAnimation from "../../../assets/animation/noTaskFound.json";
import SelectTemplateForProjectModal from "../../../modals/SelectTemplateForProjectModal";
import Loader from "../../../Component/Loader";
import { toast } from "react-toastify";

const SelectedProjectTaskManager = () => {
  const slug = useParams()?.slug;
  // Modal State
  const { access_token: accessToken, user } = useSelector(
    (state) => state.authReducer
  );
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitloading, setSubmitLoading] = useState(false);
  const [noTask, setNoTask] = useState(false);
  const [showSelectTemplate, setShowSelectTemplate] = useState(false);

  // For Admin Users
  const [adminUsers, setAdminUsers] = useState([]);

  const [allBrokers, setBrokers] = useState([]);

  async function getAdminUsers() {
    const url = BaseURL("users/get-all-admins");
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setAdminUsers(response?.data?.data);
    }
  }

  const HandleAddTaskSubmit = async (data) => {
    const params = { ...data, project: projectData?._id };
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
    // params.description = description;
    const addTaskUrl = BaseURL("projects/add-task");
    setSubmitLoading(true);

    const response = await Post(addTaskUrl, params, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success(`Task created Successfully.`);
      setProjectData(response?.data?.data);
      setNoTask(false);
      setShow(false);
    }
    setSubmitLoading(false);
  };
  const handleSubmitTemplate = async (templateId) => {
    const params = {
      templateId,
      projectId: projectData?._id,
      stage: projectData?.stages[0]?._id,
    };

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
    const addTempUrl = BaseURL("projects/apply/template");
    setSubmitLoading(true);

    const response = await Post(addTempUrl, params, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success(`Template Applied Successfully.`);
      setProjectData(response?.data?.data);
      setNoTask(false);
      setShowSelectTemplate(false);
    }
    setSubmitLoading(false);
  };

  async function getTasks() {
    const url = BaseURL(`projects/${slug}`);
    setLoading(true);
    const response = await Get(url, accessToken);
    let noTaskCheck = true;
    if (response !== undefined) {
      setProjectData(response?.data?.data);
      response?.data?.data?.stages.forEach((item) => {
        if (item?.tasks?.length !== 0) {
          noTaskCheck = false;
          return;
        }
      });
    }
    setNoTask(noTaskCheck);
    setLoading(false);
  }

  useEffect(() => {
    getTasks();
    getAdminUsers();
  }, []);

  const reorderColumnList = (sourceCol, startIndex, endIndex) => {
    const taskArray = sourceCol?.data;
    const [removed] = taskArray.splice(startIndex, 1);
    taskArray.splice(endIndex, 0, removed);

    const newColumn = {
      ...sourceCol,
      data: taskArray,
    };

    return newColumn;
  };

  const onDragEnd = async (result) => {
    const OldData = JSON.parse(JSON.stringify(projectData));
    const { destination, source } = result;

    // If user tries to drop in an unknown destination
    if (!destination) return;

    // if the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If the user drops within the same column but in a different positoin
    const sourceColIndex = projectData?.stages.findIndex(
      (x) => x?._id == source.droppableId
    );
    const destinationColIndex = projectData?.stages.findIndex(
      (x) => x?._id == destination.droppableId
    );
    const sourceCol = projectData?.stages[sourceColIndex];
    const destinationCol = projectData?.stages[destinationColIndex];

    if (sourceCol._id === destinationCol._id) {
      return;
    }

    // If the user moves from one column to another
    const sourceTaskArray = sourceCol?.tasks;
    const [removed] = sourceTaskArray.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      tasks: sourceTaskArray,
    };

    const destinationTaskArray = destinationCol?.tasks;
    destinationTaskArray.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      tasks: destinationTaskArray,
    };
    const switchTaskApiParams = {
      projectId: projectData?._id,
      stageFrom: sourceCol?._id,
      stageTo: destinationCol?._id,
      taskId: removed?._id,
    };

    const newStateData = JSON.parse(JSON.stringify(projectData));
    newStateData?.stages.splice(source.index, 1, newStartCol);
    newStateData?.stages.splice(destination.index, 1, newEndCol);
    await HandleSwitchTask(switchTaskApiParams, OldData);
    return;
  };

  const HandleSwitchTask = async (params, oldData) => {
    const switchUrl = BaseURL("projects/switch-task");
    setSubmitLoading(true);

    const response = await Patch(switchUrl, params, apiHeader(accessToken));
    if (response !== undefined) {
      setProjectData(response?.data?.data);
    } else {
      setProjectData(oldData);
    }
    
    toast.success("Task has been moved successfully");
    setSubmitLoading(false);
  };

  const HandleEditTaskSubmit = async (params) => {
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
    const editTaskUrl = BaseURL(
      `projects/update-task/${selectedTask?.item?._id}`
    );
    setSubmitLoading(true);

    const response = await Patch(editTaskUrl, params, apiHeader(accessToken));
    if (response !== undefined) {
      const newTasksArray = JSON.parse(JSON.stringify(projectData));
      newTasksArray?.stages[selectedTask?.stagesIndex]?.tasks.splice(
        selectedTask?.index,
        1,
        response?.data?.data
      );
      setProjectData(newTasksArray);
      toast.success(`Task Updated Successfully.`);
      setShow(false);
      setSelectedTask(null);
    }
    setSubmitLoading(false);
  };
  const HandleDeleteTaskSubmit = async () => {
    const deleteTaskUrl = BaseURL(
      `projects/delete-task/${projectData?._id}/${selectedTask?.stageId}/${selectedTask?.item?._id}`
    );
    setSubmitLoading(true);

    const response = await Delete(deleteTaskUrl, null, apiHeader(accessToken));
    if (response !== undefined) {
      const newTasksArray = JSON.parse(JSON.stringify(projectData));
      newTasksArray?.stages[selectedTask?.stagesIndex]?.tasks.splice(
        selectedTask?.index,
        1
      );
      setProjectData(newTasksArray);
      setSelectedTask(null);
      setShowDelete(false);
      let noTaskCheck = true;
      newTasksArray?.stages.forEach((item) => {
        if (item?.tasks?.length !== 0) {
          noTaskCheck = false;
          return;
        }
      });
      setNoTask(noTaskCheck);
      toast.success(`Task Deleted Successfully.`);
    }
    setSubmitLoading(false);
  };

  return (
    <div>
      <SideBarSkeleton>
        <div className={classes.taskManager_main}>
          {/* Head-section */}
          <div className={classes.head_main}>
            <div className={classes.main_heading}>
              <h4>{projectData?.name} Project</h4>
            </div>
            <div className={classes.status_btn}>
              <Button
                onClick={() => setShow(true)}
                className={classes.addStatus_btn}
                label={"Add Task"}
              />
            </div>
          </div>
          {/* Head-section */}
          {loading ? (
            <Loader />
          ) : noTask ? (
            <div className={classes?.selectTemplateContainer}>
              <Lottie
                style={{
                  width: "30%",
                  height: "70%",
                }}
                rendererSettings={{
                  preserveAspectRatio: "xMidYMid slice",
                }}
                loop={true}
                autoplay={true}
                animationData={noTaskFoundAnimation}
              />
              <p>No Task Found</p>
              <p>There are no tasks attached to this project.</p>
              <Button
                onClick={() => setShowSelectTemplate(true)}
                className={classes.addTemplate}
                label={"Select Template"}
              />
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Row className={classes.todo_main_row}>
                {projectData?.stages?.map((item, index) => {
                  return (
                    <Col xl={3} lg={4} md={6} sm={12} key={item?._id}>
                      <div className={classes.todo_main}>
                        <h6>
                          {item?.name == "Highest Priority"
                            ? "Due This Week"
                            : item?.name}
                        </h6>
                        <Droppable droppableId={item._id} id={item._id}>
                          {(droppableProvided, droppableSnapshot) => (
                            <div
                              ref={droppableProvided.innerRef}
                              {...droppableProvided.droppableProps}
                              className={classes.tasksMainContainer}>
                              {item?.tasks?.map((innerItem, innerIndex) => {
                                return (
                                  <Row className={classes.singleCard_row}>
                                    <Col lg={12}>
                                      <TodoCard
                                        bgColor={
                                          item?.name == "To Do"
                                            ? "blue"
                                            : item?.name == "Highest Priority"
                                            ? "red"
                                            : item?.name == "Pending"
                                            ? "orange"
                                            : "green"
                                        }
                                        item={innerItem}
                                        index={innerIndex}
                                        handleEdit={() => {
                                          setSelectedTask({
                                            item: innerItem,
                                            index: innerIndex,
                                            stageId: item?._id,
                                            stagesIndex: index,
                                          });
                                          setShow(true);
                                        }}
                                        handleDelete={() => {
                                          setSelectedTask({
                                            item: innerItem,
                                            index: innerIndex,
                                            stageId: item?._id,
                                            stagesIndex: index,
                                          });
                                          setShowDelete(true);
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                );
                              })}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </DragDropContext>
          )}
        </div>

        {show && (
          <AddTaskModal
            handleSubmit={
              selectedTask == null ? HandleAddTaskSubmit : HandleEditTaskSubmit
            }
            adminUsers={adminUsers}
            show={show}
            setShow={(e) => {
              setSelectedTask(null);
              setShow(e);
            }}
            data={
              selectedTask == null
                ? null
                : {
                    ...selectedTask?.item,
                    project: projectData?.name
                  }
            }
            optionsArrayBroker={allBrokers}
            optionsArrayStages={projectData?.stages}
            isLoading={submitloading}
          />
        )}
        <SelectTemplateForProjectModal
          handleSubmit={handleSubmitTemplate}
          show={showSelectTemplate}
          setShow={setShowSelectTemplate}
          isLoading={submitloading}
        />
        <AreYouSureModal
          show={showDelete}
          setShow={setShowDelete}
          subTitle={"Do you want to delete this task?"}
          onClick={HandleDeleteTaskSubmit}
          isApiCall={submitloading}
        />
      </SideBarSkeleton>
    </div>
  );
};

export default SelectedProjectTaskManager;
