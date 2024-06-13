import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import classes from "./Email.module.css";
import { Get, Post } from "../../Axios/AxiosFunctions";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import { RiSendPlaneFill, RiFileExcel2Line } from "react-icons/ri";
import { BiFilter } from "react-icons/bi";
import { FiHome } from "react-icons/fi";
import { TbSend } from "react-icons/tb";
import {
  BsTrash,
  BsImage,
  BsFileEarmarkWord,
  BsFileEarmark,
} from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { team1 } from "../../constant/imagePath";
import { Button } from "../../Component/Button/Button";
import SingleRoomInbox from "../../Component/SingleRoomInbox";
import NoData from "../../Component/NoData/NoData";
import { Input } from "../../Component/Input/Input";
import MailSkeleton from "../../Component/MailSkeleton/MailSkeleton";
import { toast } from "react-toastify";
import AreYouSureModal from "../../modals/AreYouSureModal";
import { VscFilePdf } from "react-icons/vsc";
import parse from "html-react-parser";
import DateRangeForEmailModal from "../../modals/DateRangeForEmailModal";
import moment from "moment";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";
import { IoChevronBackOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import ConfigureEmailModal from "../../modals/ConfigureEmailModal";
import { DropDown } from "../../Component/DropDown/DropDown";
import AttachmentUpload from "../../Component/AttachmentUpload";
import QuillInput, { CkEditorInput } from "../../Component/QuillInput";
import AddMultiValueInputContainer from "../../Component/AddMultiValueInputContainer";
import ReplyEmailModal from "../../modals/ReplyEmailModal";

function FileDownload({ item }) {
  function bufferToBase64(buf) {
    var binstr = Array.prototype.map
      .call(buf, function (ch) {
        return String.fromCharCode(ch);
      })
      .join("");
    return btoa(binstr);
  }

  return (
    <a
      href={`data:${item?.contentType};base64,${bufferToBase64(
        item?.content?.data
      )}`}
      download
      className={classes.fileInnerMain}>
      <div className={classes.fileInner}>
        <div className={classes.fileIconHead}>
          {["png", "jpg", "jpeg", "jfif"].includes(
            item?.filename?.split(".")[1]
          ) ? (
            <BsImage size={45} color={"red"} />
          ) : item?.filename?.split(".")[1] == "pdf" ? (
            <VscFilePdf size={45} color={"red"} />
          ) : ["doc", "docx"].includes(item?.filename?.split(".")[1]) ? (
            <BsFileEarmarkWord size={45} color={"red"} />
          ) : (
            <RiFileExcel2Line size={45} color={"red"} />
          )}
        </div>
        <p>{item?.filename}</p>
      </div>
    </a>
  );
}

const EmailInbox = ({
  emailType,
  setIsOpenFilterModal,
  setSelectedMail,
  setSearchStatus,
  getAllTempelates,
  searchStatus,
  isLoading,
  allTempelates,
  setDescription,
  setSubject,
  setOpenMsgBox,
  selectedMail,
  handleDeleteMain,
  setShow,
  setSingleMainUid,
  setSingleTemplate,
}) => {
  return (
    <div className={classes.room_main}>
      <>
        <div className={`${classes.inboxHead_main} ${classes.hr_line}`}>
          <div className={classes.inboxHead_inner}>
            {emailType == "INBOX" ? (
              <FiHome className={classes.Home_icon} />
            ) : emailType == "DRAFTS" ? (
              <BsFileEarmark className={classes.Home_icon} />
            ) : emailType == "SENT" ? (
              <TbSend className={classes.Home_icon} />
            ) : emailType == "JUNK" ? (
              <BsTrash className={classes.Home_icon} />
            ) : emailType == "DELETED" ? (
              <BsTrash className={classes.Home_icon} />
            ) : (
              ""
            )}
            <h6>
              {emailType == "INBOX"
                ? "Inbox"
                : emailType == "DRAFTS"
                ? "Draft"
                : emailType == "SENT"
                ? "Sent"
                : emailType == "JUNK"
                ? "Junk"
                : emailType == "DELETED"
                ? "Deleted"
                : ""}
            </h6>
          </div>
          <BiFilter
            onClick={() => setIsOpenFilterModal(true)}
            className={classes.filterIcon}
          />
        </div>

        {emailType == "INBOX" && (
          <div className={classes.allAndUnread}>
            <Row className="text-center gx-0">
              <Col xs={12}>
                <div
                  className={[
                    classes.all,
                    searchStatus == "ALL" && classes.after_click,
                  ].join(" ")}>
                  <p>All</p>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {searchStatus == "ALL" ? (
          isLoading == "initial" ? (
            <>
              {Array(5)
                .fill(0)
                ?.map((item, i) => (
                  <MailSkeleton key={i} />
                ))}
            </>
          ) : allTempelates?.length == 0 ? (
            <NoData text="No Emails Found" className={classes.templateNodata} />
          ) : (
            allTempelates
              ?.sort((a, b) => new Date(b?.date) - new Date(a?.date))
              ?.map((item, index) => {
                return (
                  <SingleRoomInbox
                    key={index}
                    onClick={() => {
                      if (emailType == "DRAFTS") {
                        const descriptionHtmlToText = item?.textAsHtml.replace(
                          /<[^>]+>/g,
                          ""
                        );
                        setDescription(descriptionHtmlToText);
                        setSubject(item?.subject || "");
                        setSelectedMail(item);
                        setOpenMsgBox("open");
                      } else {
                        setOpenMsgBox("");
                        setSelectedMail(item);
                      }
                    }}
                    item={item}
                    selectedMail={selectedMail}
                    handleDeleteMain={handleDeleteMain}
                    setShow={setShow}
                    setSingleMainUid={setSingleMainUid}
                  />
                );
              })
          )
        ) : isLoading == "initial" ? (
          <>
            {Array(5)
              .fill(0)
              ?.map((item, i) => (
                <MailSkeleton key={i} />
              ))}
          </>
        ) : allTempelates?.length == 0 ? (
          <NoData text="No Emails Found" className={classes.templateNodata} />
        ) : (
          allTempelates?.map((item, index) => {
            return (
              <SingleRoomInbox
                key={index}
                onClick={() => setSelectedMail(item)}
                item={item}
                selectedMail={selectedMail}
              />
            );
          })
        )}
      </>
    </div>
  );
};

const SelectedEmail = ({
  selectedMail,
  setSelectedMail,
  openMsgBox,
  setOpenMsgBox,
  sendTo,
  setSendTo,
  subject,
  setSubject,
  description,
  setDescription,
  handleSendMain,
  isSending,
  emailType,
  attachment,
  ccText,
  setCCText,
  ccArray,
  setCCArray,
  setReplyModal,
  setFowardModal,
}) => {
  return (
    <>
      <style>{`
      .ck.ck-content{
     min-height:300px;
     max-height:400px;
     overflow-y:scroll;
      }`}</style>
      {setSelectedMail && (
        <IoChevronBackOutline
          size={32}
          onClick={() => {
            setSelectedMail(undefined);
            setOpenMsgBox("");
          }}
          className={classes.emailBackIcon}
        />
      )}
      <div className={classes.rightBox}>
        <Row className="gx-0 h-100">
          {selectedMail == null && openMsgBox == "" ? (
            <Col md={12}>
              <NoData text="Not Selected Yet" />
            </Col>
          ) : ["open", "open-template"].includes(openMsgBox) ? (
            <>
              <Col md={12}>
                <h5 className={classes.heading}>New Message</h5>
              </Col>
              <Col md={12} className={classes.mb31}>
                <Input
                  label={"Send To"}
                  value={sendTo}
                  setter={setSendTo}
                  placeholder={"Email"}
                />
              </Col>
              <Col md={12} className={classes.mb31}>
                <AddMultiValueInputContainer
                  title={"CC"}
                  inputValue={ccText}
                  inputSetter={setCCText}
                  arrayValue={ccArray}
                  arraySetter={setCCArray}
                  placeholder={"Add CC"}
                  type={"email"}
                />
              </Col>

              <Col md={12} className={classes.mb31}>
                <Input
                  label={"Subject"}
                  value={subject}
                  setter={setSubject}
                  disabled={openMsgBox == "open-template"}
                />
              </Col>
              <Col
                md={12}
                className={classes.mb31}
                style={{ position: "relative" }}>
                {openMsgBox == "open-template" ? (
                  <QuillInput
                    label={"Description"}
                    value={description}
                    setter={setDescription}
                    className={classes.textArea}
                    disabled={true}
                  />
                ) : (
                  <CkEditorInput
                    label={"Description"}
                    value={description}
                    setter={setDescription}
                    quillClass={classes.quillClass}
                    disabled={openMsgBox == "open-template"}
                  />
                )}
              </Col>
              {openMsgBox == "open-template" && (
                <Col md={12} className={classes.mb31}>
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
              )}

              <Col md={12}>
                <Button
                  onClick={() => handleSendMain(sendTo, subject, description)}
                  label={isSending ? "Sending Message" : "Send Message"}
                  rightIcon={
                    <IoIosSend size={20} style={{ marginLeft: "10px" }} />
                  }
                  disabled={isSending}
                />
              </Col>
            </>
          ) : (
            <Col md={12}>
              <div className={classes.emailHeader}>
                <div className={classes.nameAndMail_main}>
                  <h6>{selectedMail?.subject}</h6>
                  <p>{selectedMail?.from}</p>
                </div>
                <p className={classes.dateText}>
                  {moment(selectedMail?.date).format("L")}{" "}
                  {moment(selectedMail?.date).format("LT")}
                </p>
              </div>

              <div className={classes.email_content}>
                <div className={classes.fileMain}>
                  <Row>
                    {emailType == "INBOX" &&
                      selectedMail?.attachments?.map((item) => {
                        return (
                          <Col md={3}>
                            <FileDownload item={item} />
                          </Col>
                        );
                      })}
                  </Row>
                </div>
                <p className={classes.email_text}>
                  {parse(`${selectedMail?.textAsHtml}`)}
                </p>
              </div>
              {emailType == "INBOX" && (
                <div className={classes.forwardBtnDiv}>
                  <Button label={"Reply"} onClick={() => setReplyModal(true)} />
                  <Button
                    label={"Foward"}
                    onClick={() => setFowardModal(true)}
                  />
                </div>
              )}
            </Col>
          )}
        </Row>
      </div>
    </>
  );
};

const Email = () => {
  const token = useSelector((state) => state?.authReducer?.access_token);
  const { allEmailTemplates } = useSelector((state) => state?.commonReducer);
  const isMailFromState = useLocation()?.state?.emailData;
  const isOnlyMailFromState = useLocation()?.state?.email;
  const [allTempelates, setAllTempelates] = useState([]);
  const [emailType, setEmailType] = useState("INBOX");
  const [isLoading, setIsLoading] = useState("initial");
  const [selectedMail, setSelectedMail] = useState(undefined);
  const [searchStatus, setSearchStatus] = useState("ALL");
  const [isApiCall, setIsApiCall] = useState(false);
  const [show, setShow] = useState(false);
  const [singleMainUid, setSingleMainUid] = useState();
  const [sendTo, setSendTo] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [openMsgBox, setOpenMsgBox] = useState("");
  const [attachment, setAttachment] = useState([{}]);

  const [ccText, setCCText] = useState("");
  const [ccArray, setCCArray] = useState([]);

  const [replyModal, setReplyModal] = useState(false);
  const [fowardModal, setFowardModal] = useState(false);

  // Templates
  const [singleTemplate, setSingleTemplate] = useState(null);

  const [configureEmail, setConfigureEmail] = useState(false);
  const [configureEmailStatus, setConfigureEmailStatus] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [dates, setDates] = useState([
    moment().startOf("week").format("YYYY-MM-DD"),
    moment().endOf("week").format("YYYY-MM-DD"),
  ]);
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);

  const [isSending, setIsSending] = useState(false);

  let mainEmailType;

  const mailObject = {
    INBOX: "INBOX",
    SENT: "INBOX.Sent",
    DRAFTS: "INBOX.Drafts",
    JUNK: "INBOX.spam",
    DELETED: "INBOX.Trash",
  };

  mainEmailType = mailObject[emailType];

  async function getEmailTemplateDetail() {
    const url = BaseURL(`templates/single/${singleTemplate?._id}`);
    const response = await Get(url, token);
    if (response !== undefined) {
      const currentTemp = response?.data?.data;
      setSubject(currentTemp?.subject);
      setDescription(currentTemp?.message);
      setAttachment(currentTemp?.attachment);
      setOpenMsgBox("open-template");
    }
  }

  const getAllTempelates = async (
    loadingType = "initial",
    type = searchStatus,
    startDate = dates[0],
    endDate = dates[1]
  ) => {
    const apiUrl = BaseURL(
      `mails?search=${type}&mood=${mainEmailType}&from=${startDate}&to=${endDate}`
    );
    setIsLoading(loadingType);
    const response = await Get(apiUrl, token);
    if (response !== undefined) {
      setAllTempelates(response?.data?.data);
      setIsLoading("");
    } else {
      setIsLoading("");
      setConfigureEmailStatus(true);
    }
  };
  useEffect(() => {
    getAllTempelates();
  }, [emailType]);

  useEffect(() => {
    if (singleTemplate !== null) {
      getEmailTemplateDetail();
    }
  }, [singleTemplate]);

  useEffect(() => {
    isMobileViewHook(setIsMobile, 1200);
    if (isMailFromState) {
      setSelectedMail(isMailFromState);
    }
    if (isOnlyMailFromState) {
      setSendTo(isOnlyMailFromState);
      setOpenMsgBox("open");
    }
  }, []);

  const handleDeleteMain = async () => {
    const apiUrl = BaseURL(`mails/delete`);
    const body = {
      uids: singleMainUid,
    };
    setIsApiCall(true);
    const response = await Post(apiUrl, body, apiHeader(token));
    if (response !== undefined) {
      setAllTempelates(
        allTempelates.filter((item) => item?.uid !== singleMainUid)
      );
      setIsApiCall(false);
      setSelectedMail(undefined);
      toast.success("Mail Delete successfully");
      setShow(false);
    } else {
      setIsApiCall(false);
    }
  };

  const handleSendMain = async (sendTo, subject, description) => {
    const apiUrl = BaseURL(`mails/send-email`);
    const body = {
      email: sendTo,
      subject: subject,
      message: description,
    };
    for (var key in body) {
      if (body[key] == "" || body[key] == null || body[key] == undefined) {
        if (body[key] == "email") {
          return toast.error(`Please fill send To field`);
        } else {
          return toast.error(`Please fill ${key} field`);
        }
      }
    }

    setIsSending(true);
    const formData = new FormData();
    formData.append("email", sendTo);
    formData.append("subject", subject);
    formData.append("message", description);
    formData.append("cc", ccArray);
    const response = await Post(apiUrl, formData, apiHeader(token, true));
    if (response !== undefined) {
      toast.success("Email send successfully");
      setSendTo("");
      setSubject("");
      setCCArray([]);
      setCCText("");
      setDescription("");
      setAttachment([{}]);
      setSingleTemplate(null);
      setOpenMsgBox("");
      setIsSending(false);
      //
      setReplyModal(false);
      setFowardModal(false);
    } else {
      setIsSending(false);
    }
  };

  const sidebarMenu = [
    {
      title: "Inbox",
      slug: "INBOX",
      icon: <FiHome className={classes.icon} />,
    },
    { title: "Sent", slug: "SENT", icon: <TbSend className={classes.icon} /> },
    {
      title: "Draft",
      slug: "DRAFTS",
      icon: <BsFileEarmark className={classes.icon} />,
    },
    { title: "Junk", slug: "JUNK", icon: <BsTrash className={classes.icon} /> },
    {
      title: "Deleted",
      slug: "DELETED",
      icon: <BsTrash className={classes.icon} />,
    },
  ];

  return (
    <>
      <SideBarSkeleton>
        <div className={classes.mainContainer}>
          <div className={classes.mainHeading}>
            <h3>Email</h3>
            <div className={classes.btnAndDropDown}>
              <DropDown
                options={allEmailTemplates}
                setter={(e) => {
                  setSelectedMail(undefined);
                  setSingleTemplate(e);
                }}
                value={singleTemplate}
                placeholder={"Select mail template"}
                optionLabel={"subject"}
                optionValue={"subject"}
                customStyle={{
                  width: "250px",
                  padding: "0px 2px",
                }}
              />
              {configureEmailStatus && (
                <Button
                  label={"Configure Email"}
                  onClick={() => setConfigureEmail(true)}
                  customStyle={{ height: "46px" }}
                />
              )}
            </div>
          </div>

          <Row>
            <Col xl={2} className={classes.sideBarFilterCol}>
              <div className={classes.sideBar_main}>
                <Button
                  onClick={() => {
                    setSearchStatus("ALL");
                    setOpenMsgBox("open");
                    setSelectedMail(undefined);
                    setSingleTemplate(null);
                    setSubject("");
                    setDescription("");
                    setSendTo("");
                  }}
                  className={classes.message_btn}>
                  New Message
                  <span>
                    <RiSendPlaneFill className={classes.send_icon} />
                  </span>
                </Button>

                <div className={classes.list_main}>
                  {sidebarMenu?.map((item) => (
                    <div
                      onClick={() => {
                        setSearchStatus("ALL");
                        setAllTempelates([]);
                        setSelectedMail(undefined);
                        setOpenMsgBox("");
                        setSingleTemplate(null);
                        setEmailType(item?.slug);
                      }}
                      className={
                        emailType == item?.slug
                          ? classes.list_innerClick
                          : classes.list_inner
                      }>
                      {item?.icon}
                      <p>{item?.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            <Col xl={3} className={classes.inboxCol}>
              {isMobile ? (
                selectedMail == undefined &&
                openMsgBox == "" && (
                  <EmailInbox
                    emailType={emailType}
                    setIsOpenFilterModal={setIsOpenFilterModal}
                    setSelectedMail={setSelectedMail}
                    setSearchStatus={setSearchStatus}
                    getAllTempelates={getAllTempelates}
                    searchStatus={searchStatus}
                    isLoading={isLoading}
                    allTempelates={allTempelates}
                    setDescription={setDescription}
                    setSubject={setSubject}
                    setOpenMsgBox={setOpenMsgBox}
                    selectedMail={selectedMail}
                    handleDeleteMain={handleDeleteMain}
                    setShow={setShow}
                    setSingleMainUid={setSingleMainUid}
                    setSingleTemplate={setSingleTemplate}
                  />
                )
              ) : (
                <EmailInbox
                  emailType={emailType}
                  setIsOpenFilterModal={setIsOpenFilterModal}
                  setSelectedMail={setSelectedMail}
                  setSearchStatus={setSearchStatus}
                  getAllTempelates={getAllTempelates}
                  searchStatus={searchStatus}
                  isLoading={isLoading}
                  allTempelates={allTempelates}
                  setDescription={setDescription}
                  setSubject={setSubject}
                  setOpenMsgBox={setOpenMsgBox}
                  selectedMail={selectedMail}
                  handleDeleteMain={handleDeleteMain}
                  setShow={setShow}
                  setSingleMainUid={setSingleMainUid}
                  setSingleTemplate={setSingleTemplate}
                />
              )}
            </Col>

            <Col xl={7}>
              {isMobile ? (
                (selectedMail !== undefined || openMsgBox !== "") && (
                  <SelectedEmail
                    setReplyModal={setReplyModal}
                    setFowardModal={setFowardModal}
                    selectedMail={selectedMail}
                    setSelectedMail={setSelectedMail}
                    setOpenMsgBox={setOpenMsgBox}
                    openMsgBox={openMsgBox}
                    sendTo={sendTo}
                    setSendTo={setSendTo}
                    subject={subject}
                    setSubject={setSubject}
                    description={description}
                    setDescription={setDescription}
                    handleSendMain={handleSendMain}
                    isSending={isSending}
                    emailType={emailType}
                    attachment={attachment}
                    ccText={ccText}
                    setCCText={setCCText}
                    ccArray={ccArray}
                    setCCArray={setCCArray}
                  />
                )
              ) : (
                <SelectedEmail
                  setReplyModal={setReplyModal}
                  setFowardModal={setFowardModal}
                  selectedMail={selectedMail}
                  openMsgBox={openMsgBox}
                  sendTo={sendTo}
                  setSendTo={setSendTo}
                  subject={subject}
                  setSubject={setSubject}
                  description={description}
                  setDescription={setDescription}
                  handleSendMain={handleSendMain}
                  isSending={isSending}
                  emailType={emailType}
                  attachment={attachment}
                  ccText={ccText}
                  setCCText={setCCText}
                  ccArray={ccArray}
                  setCCArray={setCCArray}
                />
              )}
            </Col>
          </Row>
        </div>
        <AreYouSureModal
          subTitle={`Do you want to delete this mail ?`}
          show={show}
          setShow={setShow}
          onClick={handleDeleteMain}
          isApiCall={isApiCall}
        />
        <DateRangeForEmailModal
          show={isOpenFilterModal}
          setShow={setIsOpenFilterModal}
          setDates={setDates}
          dates={dates}
          handleSubmit={() => getAllTempelates("date-selection")}
          isLoading={isLoading == "date-selection"}
        />
      </SideBarSkeleton>

      {configureEmail && (
        <ConfigureEmailModal
          show={configureEmail}
          setShow={setConfigureEmail}
          setConfigureStatus={setConfigureEmailStatus}
        />
      )}

      {replyModal && (
        <ReplyEmailModal
          selectedMail={selectedMail}
          show={replyModal}
          setShow={setReplyModal}
          onSubmit={handleSendMain}
          isSending={isSending}
          type={"reply"}
        />
      )}
      {fowardModal && (
        <ReplyEmailModal
          selectedMail={selectedMail}
          show={fowardModal}
          setShow={setFowardModal}
          onSubmit={handleSendMain}
          isSending={isSending}
          type={"foward"}
        />
      )}
    </>
  );
};

export default Email;
