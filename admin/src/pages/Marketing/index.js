import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { IoIosSend } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiHomeAlt } from "react-icons/bi";
import { MdModeEdit } from "react-icons/md";
import classes from "./Marketing.module.css";
import { useSelector } from "react-redux";
import { Delete, Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { apiHeader, BaseURL, recordsLimit } from "../../config/apiUrl";
import { toast } from "react-toastify";
import AddOrUpdateEmailTemplates from "../../modals/AddOrUpdateEmailTemplates";
import AreYouSureModal from "../../modals/AreYouSureModal";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Checkbox } from "../../Component/Checkbox/Checkbox";
import Loader from "../../Component/Loader";
import NoData from "../../Component/NoData/NoData";
import AttachmentUpload from "../../Component/AttachmentUpload";
import PaginationComponent from "../../Component/PaginationComponent";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import SendMailToFilterUserModal from "../../modals/SendMailToFilterUserModal";
import parse from "html-react-parser";
import { useDispatch } from "react-redux";
import { setEmailTemplates } from "../../store/common/commonSlice";
import AddMultiValueInputContainer from "../../Component/AddMultiValueInputContainer";

const TemplateBox = ({ data, selected, onClick, onDelete, onEdit }) => {
  return (
    <div
      className={[
        classes.box,
        selected?._id == data?._id && classes.selectedBox,
      ].join(" ")}
      onClick={() => onClick(data)}>
      <h6>{data?.subject}</h6>
      <p className="">{parse(data?.message)}</p>
      <div className={classes.editAndDelete}>
        <div className={classes.icon} onClick={onDelete}>
          <RiDeleteBinLine />
        </div>
        <div className={classes.icon} onClick={() => onEdit()}>
          <MdModeEdit />
        </div>
      </div>
    </div>
  );
};

function Marketing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allEmailTemplates } = useSelector((state) => state?.commonReducer);
  const [sendTo, setSendTo] = useState("");
  const [isAllowAllUsers, setIsAllowAllUsers] = useState([]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState([]);
  const [selected, setSelected] = useState(null);

  const [isMobile, setIsMobile] = useState(false);

  // For Crud Api
  const accessToken = useSelector((state) => state?.authReducer?.access_token);
  const { allUsers, allListing } = useSelector((state) => state?.commonReducer);
  const [allCities, setAllCities] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isUpdating, setIsUpdating] = useState("");
  const [isOpenModal, setIsOpenModal] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  // cc
  const [ccText, setCCText] = useState("");
  const [ccArray, setCCArray] = useState([]);

  // Get Api
  const getAllEmailTemplates = async () => {
    const url = BaseURL(
      `templates/admin/all?page=${page}&limit=${recordsLimit}`
    );
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setData(response?.data?.data);
      setTotalPages(response?.data?.results);
    }
    setLoading(false);
  };
  // Post Api
  const createTemplate = async (e) => {
    const url = BaseURL(`templates/create`);
    setIsUpdating("add");
    const response = await Post(url, e, apiHeader(accessToken, true));
    if (response !== undefined) {
      const newData = [...data];
      newData.push(response?.data);
      setData(newData);
      const newTemplates = [...allEmailTemplates];
      newTemplates?.push(response?.data);
      dispatch(setEmailTemplates(newTemplates));
      toast.success("Email template created successfully");
      setIsUpdating("");
      setIsOpenModal("");
    } else {
      setIsUpdating("");
    }
  };
  // Patch Api
  const updateTemplate = async (e) => {
    const url = BaseURL(`templates/update`);
    setIsUpdating("update");
    const response = await Patch(url, e, apiHeader(accessToken, true));
    if (response !== undefined) {
      const newData = [...data];
      newData.splice(
        newData.findIndex((item) => item?._id == response?.data?._id),
        1,
        response?.data
      );
      setData(newData);
      const newTemplates = [...allEmailTemplates];
      newTemplates?.splice(
        newData.findIndex((item) => item?._id == response?.data?._id),
        1,
        response?.data
      );
      dispatch(setEmailTemplates(newTemplates));
      setSelected(response?.data);
      toast.success("Email template updated successfully");
      setIsUpdating("");
      setIsOpenModal("");
    } else {
      setIsUpdating("");
    }
  };

  // Delete Api

  const deleteTemplate = async () => {
    const url = BaseURL(`templates/delete/${selected?._id}`);
    setIsUpdating("delete");
    const response = await Delete(url, null, apiHeader(accessToken));
    if (response !== undefined) {
      const newData = [...data];
      newData.splice(
        newData.findIndex((item) => item?._id == response?.data?._id),
        1
      );
      setData(newData);
      const newTemplates = [...allEmailTemplates];
      newTemplates?.splice(
        newData.findIndex((item) => item?._id == response?.data?._id),
        1
      );
      dispatch(setEmailTemplates(newTemplates));
      setSelected(null);
      toast.success("Email template deleted successfully");
      setIsUpdating("");
      setIsOpenModal("");
    } else {
      setIsUpdating("");
    }
  };

  // Send Mail Api
  const sendMail = async () => {
    if (selected == null) {
      return toast.error("Template not selected");
    }
    if (
      !isAllowAllUsers.includes("Do you want to send all users?") &&
      sendTo?.length == 0
    ) {
      return toast.error("Please select users");
    }
    const url = BaseURL(`templates/send-promotion-mails`);
    const body = {
      templateId: selected?._id,
      userIds: !isAllowAllUsers.includes("Do you want to send all users?")
        ? sendTo?.map((item) => item?._id)
        : allUsers?.map((item) => item?._id),
      cc: ccArray,
    };
    setIsUpdating("send");
    const response = await Post(url, body, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success("Email send successfully");
      setIsUpdating("");
      setCCArray([]);
      setCCText("");
      setSendTo("");
    } else {
      setIsUpdating("");
    }
  };

  useEffect(() => {
    isMobileViewHook(setIsMobile);
    getAllData();
  }, []);

  useEffect(() => {
    if (data?.length !== 0) getAllEmailTemplates();
  }, [page]);
  const getAllData = async () => {
    setLoading(true);
    const [cities, templates, groups, categories] = await Promise.all([
      Get(BaseURL(`business/cities`), accessToken, false),
      Get(
        BaseURL(`templates/admin/all?page=${page}&limit=${recordsLimit}`),
        accessToken
      ),
      Get(BaseURL(`groups`), accessToken, false),
      Get(BaseURL(`business/categories`), accessToken, false),
    ]);
    setAllCities(cities?.data?.data?.cities);
    setAllCategories(categories?.data?.data?.categories);
    setAllGroups(groups?.data?.data);
    setData(templates?.data?.data);
    setTotalPages(templates?.data?.results);
    setLoading(false);
  };

  useEffect(() => {
    if (selected !== null) {
      setSubject(selected?.subject);
      setDescription(selected?.message);
      setAttachment(selected?.attachment);
    }
  }, [selected]);

  //End For Crud Api

  const InboxComp = () => (
    <>
      {selected ? (
        <Row className="gx-0">
          <Col md={12} className={classes?.newMessageHeaderContainer}>
            <h5 className={classes.heading}>New Message</h5>
            <Button
              label={"Filter"}
              onClick={() => {
                setShowFilterModal(!showFilterModal);
              }}
              disabled={sendTo !== "" ? true : false}
            />
          </Col>
          <Col md={12} className={classes.mb20}>
            <DropDown
              label={"Send To"}
              value={sendTo}
              setter={(e) => {
                setSendTo(e);
              }}
              disabled={isAllowAllUsers.includes(
                "Do you want to send all users?"
              )}
              options={allUsers}
              optionValue={"_id"}
              getOptionLabel={(e) => {
                return `${e?.firstName} ${e?.lastName} ${e?.email}`;
              }}
              isMulti={true}
              placeholder={"Select Users"}
            />
          </Col>
          <Col md={12} className={classes.mb20}>
            <Checkbox
              label={"Do you want to send all users?"}
              value={isAllowAllUsers}
              setValue={(e) => {
                if (e.includes("Do you want to send all users?")) {
                  setSendTo([]);
                }
                setIsAllowAllUsers(e);
              }}
            />
          </Col>
          <Col md={12} className={classes.mb20}>
            <AddMultiValueInputContainer
              title={"CC"}
              inputValue={ccText}
              inputSetter={setCCText}
              arrayValue={ccArray}
              arraySetter={setCCArray}
              placeholder={"Add CC"}
              type={"email"}
              autoFocus="autoFocus"
            />
          </Col>
          <Col md={12} className={classes.mb20}>
            <Input
              label={"Subject"}
              value={subject}
              setter={setSubject}
              disabled={selected !== null}
            />
          </Col>
          <Col md={12} className={classes.mb20}>
            <label className={classes.viewTemplateDescLabel}>Description</label>
            <div className={classes.viewTemplateDesc}>{parse(description)}</div>
          </Col>
          <Col md={12} className={classes.mb20}>
            <Row className="gy-3">
              {attachment?.map((item, i) => {
                return (
                  <Col md={4} sm={6}>
                    <AttachmentUpload state={item} edit={false} />
                  </Col>
                );
              })}
            </Row>
          </Col>
          <Col md={12}>
            <Button
              label={isUpdating == "send" ? "Please Wait..." : "Send Message"}
              rightIcon={<IoIosSend size={20} style={{ marginLeft: "10px" }} />}
              onClick={sendMail}
              disabled={isUpdating == "send"}
            />
          </Col>
        </Row>
      ) : (
        <NoData text="No Template Selected Yet" />
      )}
    </>
  );
  const RoomsComp = () => (
    <div className={classes.leftBox}>
      <div className={classes.leftHead}>
        <BiHomeAlt />
        <h4>Templates</h4>
      </div>
      <div className={classes.leftContent}>
        {loading ? (
          <Loader />
        ) : data?.length == 0 ? (
          <NoData text={"No Templates Found"} />
        ) : (
          data?.map((item) => {
            return (
              <TemplateBox
                data={item}
                onClick={(e) => setSelected(e)}
                selected={selected}
                onEdit={() => {
                  setSelected(item);
                  setIsOpenModal("update");
                }}
                onDelete={() => {
                  setSelected(item);
                  setIsOpenModal("delete");
                }}
              />
            );
          })
        )}
      </div>
      {data?.length > 0 && (
        <div className={[classes.paginationDiv]}>
          <PaginationComponent
            totalPages={Math.ceil(totalPages / recordsLimit)}
            currentPage={page}
            setCurrentPage={setPage}
          />
        </div>
      )}
    </div>
  );

  // Send Mail Api
  const sendFilterMail = async (params) => {
    if (selected == null) {
      return toast.error("Template not selected");
    }
    const url = BaseURL(`templates/group-send-promotion-mails`);
    const body = {
      templateId: selected?._id,
      ccArray,
      ...params,
    };
    setIsUpdating("send");
    const response = await Post(url, body, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success("Email send successfully");
      setShowFilterModal(false);
      setCCArray([]);
      setCCText("");
      setSendTo("");
    }
    setIsUpdating("");
  };

  return (
    <SideBarSkeleton>
      <div className={classes.content}>
        <div className={classes.head}>
          <h5>Email Templates</h5>
          <Button
            label="Add Template"
            className={classes.addTempBtn}
            onClick={() => setIsOpenModal("add")}
          />
        </div>
        <Row className={classes.row}>
          {!isMobile ? (
            <>
              <Col lg={4} xl={4}>
                <RoomsComp />
              </Col>
              <Col lg={8} xl={8}>
                <div className={classes.rightBox}>
                  <InboxComp />
                </div>
              </Col>
            </>
          ) : (
            <>
              {!selected ? (
                <Col md={12}>
                  <RoomsComp />
                </Col>
              ) : (
                <Col md={12}>
                  <div className={classes.rightBox}>
                    <Button
                      label={"Back"}
                      onClick={() => setSelected(null)}
                      className={classes.backBtn}
                      leftIcon={<MdOutlineArrowBackIosNew />}
                    />

                    <InboxComp />
                  </div>
                </Col>
              )}
            </>
          )}
        </Row>
      </div>

      {isOpenModal == "add" && (
        <AddOrUpdateEmailTemplates
          isLoading={isUpdating == "add"}
          show={isOpenModal == "add"}
          setShow={() => setIsOpenModal("")}
          handleSubmit={createTemplate}
        />
      )}
      {isOpenModal == "update" && (
        <AddOrUpdateEmailTemplates
          isLoading={isUpdating == "update"}
          show={isOpenModal == "update"}
          setShow={() => setIsOpenModal("")}
          handleSubmit={updateTemplate}
          data={selected}
        />
      )}
      {showFilterModal && (
        <SendMailToFilterUserModal
          isLoading={isUpdating == "add" || isUpdating == "update"}
          show={showFilterModal}
          setShow={() => setShowFilterModal(false)}
          handleSubmit={sendFilterMail}
          allListings={allListing}
          allCategories={allCategories}
          allCities={allCities}
          allGroups={allGroups}
        />
      )}

      <AreYouSureModal
        setShow={() => setIsOpenModal("")}
        show={isOpenModal == "delete"}
        isApiCall={isUpdating == "delete"}
        onClick={deleteTemplate}
        subTitle={"Do you want to delete this email template?"}
      />
    </SideBarSkeleton>
  );
}

export default Marketing;
