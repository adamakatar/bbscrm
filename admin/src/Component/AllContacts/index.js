import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { BsTelephone, BsEnvelope } from "react-icons/bs";
import { MdEmail, MdTextsms, MdCall } from "react-icons/md";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button as BottonTheme } from "../Button/Button";
import Contact from "../../pages/Conversation/Contact";
import { customStyle } from "../../pages/Conversation/styles";
import { useNavigate, useParams } from "react-router-dom";
import AddTaskModal from "../../modals/AddTaskModal";
import {
  BaseURL,
  apiHeader,
  formRegEx,
  formRegExReplacer,
} from "../../config/apiUrl";
import { useSelector } from "react-redux";
import { Get, Post } from "../../Axios/AxiosFunctions";
import { toast } from "react-toastify";

import styled from "styled-components";
import SearchInput from "../SearchInput";
import { DropDown } from "../DropDown/DropDown";
import { filterConversationOptions } from "../../constant/commonData";
import moment from "moment/moment";
import BookMeetingDialog from "../../Component/BookMeetingDialog";

const ScrollableList = styled.div`
  height: 450px;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: darkgrey transparent;
  ::-webkit-scrollbar {
    width: 10px;
    display: block;
  }

  ::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: grey;
  }
`;

const ScrollableTextarea = styled(Form.Control)`
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: darkgrey transparent;
  ::-webkit-scrollbar {
    width: 10px;
    display: block;
  }

  ::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: grey;
  }
`;

const StyledNoteAuthor = styled.p`
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 0px;
`;

const AllContacts = ({
  userName,
  phoneNumber,
  userEmail,
  noteText,
  setNoteText,
  handleNoteAddition,
  notes,
  handleCall,
  activeForm,
  setActiveForm,
  emailHistory,
  smsHistory,
  callHistory,
  subject,
  setSubject,
  emailContent,
  setEmailContent,
  smsContent,
  setSmsContent,
  handleSendSmsOrEmail,
  clearContent,
  combineLogs,
  classes, // You might need to pass styles and classes as props
  callStyles, // You might need to pass styles and classes as props
  styles,
  user,
  changeNoteText,
  displayNote,
  setDisplayNote,
  displayInfo,
  changeUserFlag,
  setSearch,
  search,
  setFilterOption,
  filterOption
}) => {
  const slug = useParams()?.slug;
  //Modal State
  const { access_token: accessToken } = useSelector(
    (state) => state.authReducer
  );
  const conversationContainerRef = useRef(null);

  const navigate = useNavigate();
  const [editNote, setEditNote] = useState(displayNote);

  // Task Modal
  const [taskModal, setTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [submitloading, setSubmitloading] = useState(false);
  const [noTask, setNoTask] = useState(false);
  const [loading, setLoading] = useState(true);

  const [adminUsers, setAdminUsers] = useState([]);
  const [expandedEmail, setExpandedEmail] = useState({});

  // Meeting
  const [bookMeetingOpened, setBookMeetingOpened] = useState(false);

  useEffect(() => {
    // setEditNote(displayNote);
    getTasks();
    getAdminUsers();
  }, [displayNote]);

  async function getAdminUsers() {
    const url = BaseURL("users/get-all-admins");
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setAdminUsers(response?.data?.data);
    }
  }

  async function getTasks() {
    let url;
    // if(slug === undefined)
    //   {
    //     url = BaseURL(`projects/${TaskSender}.${TaskReceiver}`);
    //   }
    // else
    //   url = BaseURL(`projects/testproject-1`);
    url = BaseURL(`projects/testproject-1`);
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

  const handleAddTaskSubmit = async (data) => {
    const params = { ...data, project: projectData?._id };
    for (let key in params) {
      if (key === "description") {
        continue;
      }
      if (
        params[key] === "" ||
        params[key] === null ||
        params[key] === undefined
      ) {
        return toast.error(
          `Please provide the ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()}`
        );
      }
    }
    const addTaskUrl = BaseURL("projects/add-Task");
    setSubmitloading(true);

    const response = await Post(addTaskUrl, params, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success(`Task created Successfully`);
      setProjectData(response?.data?.data);
      setNoTask(false);
      setTaskModal(false);
    }
    setSubmitloading(false);
  };

  const navigateCalenar = () => {
    navigate("/calendar");
  };

  const handleEmailClick = (id) => {
    setExpandedEmail((prev) => {
      const clonePrev = { ...prev };
      if (!clonePrev[id]) {
        clonePrev[id] = true;
      } else {
        clonePrev[id] = !clonePrev[id];
      }
      return clonePrev;
    });
  };

  useEffect(() => {
    if (conversationContainerRef.current) {
      // Scroll to the conversation container when a contact is selected
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [changeUserFlag]);

  return (
    <Card>
      <Card.Header>
        <SearchInput
          setter={setSearch}
          value={search}
          placeholder={"Search"}
        />
      </Card.Header>
      <Card.Body>
        <Row className={classes.rowContact}>
          <Col lg={9}>
            <DropDown
              setter={setFilterOption}
              value={filterOption}
              options={filterConversationOptions}
              isSearchable={false}
              optionLabel={"label"}
              optionValue={"value"}
            />
            <ScrollableList
              className={classes.message + ` mb-3 mt-3`}
              ref={conversationContainerRef}
            >
              {emailHistory || smsHistory || callHistory ? (
                <div style={styles.conversationWrapper}>
                  {combineLogs(emailHistory, smsHistory, callHistory)
                    .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
                    .map((log, index) => {
                      const {
                        type,
                        sentAt,
                        from,
                        to,
                        body,
                        status,
                        subject,
                        text,
                        id,
                      } = log;
                      let isFlag = false;
                      let isDelivered = false;
                      let iconElem = <MdEmail />;
                      let textColor = "#007BFF";
                      if (type === "email") {
                        iconElem = <MdEmail />;
                        textColor = "#007BFF";
                        isFlag =
                          ((from === user.email ||
                            from === "mjn@denverbbs.com") &&
                            to === userEmail) ||
                          ((to === user.email || to === "mjn@denverbbs.com") &&
                            from === userEmail);
                        isDelivered =
                          isFlag &&
                          (from === user.email ||
                            from === "mjn@denverbbs.com") &&
                          to === userEmail;
                      }

                      if (type === "sms") {
                        iconElem = <MdTextsms />;
                        textColor = "#707070 ";
                        isFlag =
                          status === "delivered"
                            ? (from === user.contact ||
                              from === "+18339271147") &&
                            (to === "+1" + phoneNumber || to === phoneNumber)
                            : (from === "+1" + phoneNumber ||
                              from === phoneNumber) &&
                            (to === user.contact || to === "+18339271147");

                        isDelivered = status === "delivered";
                      }

                      if (type === "call") {
                        iconElem = <MdCall />;
                        textColor = "#00CC00  ";
                        isFlag =
                          status === "outbound-api"
                            ? (from === user.contact ||
                              from === "+18339271147") &&
                            (to === "+1" + phoneNumber || to === phoneNumber)
                            : (from === "+1" + phoneNumber ||
                              from === phoneNumber) &&
                            (to === user.contact || to === "+18339271147");

                        isDelivered = status === "outbound-api";
                      }

                      const itemStyle = isDelivered
                        ? {
                          ...styles.itemOutgoing,
                          ...styles.conversationWrapperOutgoing,
                        }
                        : styles.itemIncoming;
                      const messageContent = type === "email" ? subject : body;
                      const sentDate = new Date(sentAt);
                      const dateString = new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(sentDate);
                      if (isFlag) {
                        return (
                          <div
                            key={index}
                            style={itemStyle}
                            onClick={() => handleEmailClick(id)}
                          >
                            {iconElem}
                            <b>
                              {isDelivered ? (
                                <>
                                  <Contact
                                    name={user.firstName + " " + user.lastName}
                                  />
                                </>
                              ) : (
                                <>
                                  <Contact name={userName} />
                                </>
                              )}
                            </b>
                            <div style={{ color: textColor }}>
                              <b>
                                {isDelivered ? to : from} {` (${dateString})`}
                              </b>
                              <br />
                              {messageContent}
                              <br />
                              {type === "email" && expandedEmail[id] && (
                                <div
                                  onClick={e => e.stopPropagation()}
                                  dangerouslySetInnerHTML={{ __html: text }}
                                ></div>
                              )}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                </div>
              ) : (
                <div style={styles.conversationWrapper}>
                  <div style={{ fontWeight: "bold" }}>Conversation Began</div>
                  <div>Wed, Jun 09 2023, 11:05 AM</div>
                </div>
              )}
            </ScrollableList>
            <hr />
            <div className={classes.send_message}>
              <div className="mb-3">
                <Button
                  variant={activeForm === "sms" ? "dark" : "outline-dark"}
                  onClick={() => setActiveForm("sms")}
                >
                  SMS
                </Button>{" "}
                <Button
                  variant={activeForm === "email" ? "dark" : "outline-dark"}
                  onClick={() => setActiveForm("email")}
                >
                  Email
                </Button>
              </div>
              {activeForm === "email" ? (
                <div>
                  <Row className="mb-3">
                    <Col>
                      <Form.Control
                        id="Name"
                        aria-describedby="name"
                        placeholder="Name"
                        value={userName}
                        disabled
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="email"
                        id="email"
                        aria-describedby="email"
                        placeholder="Email"
                        // value={to}
                        value={userEmail}
                        // onChange={(e) => {setTo(e.target.value)}}
                        disabled
                      />
                    </Col>
                  </Row>
                  <div className="mb-3">
                    <Form.Control
                      type="Subject"
                      id="subject"
                      aria-describedby="subject"
                      placeholder="Subject"
                      value={subject}
                      onChange={(e) => {
                        setSubject(e.target.value);
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <CKEditor
                      editor={ClassicEditor}
                      data={emailContent}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setEmailContent(data);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Input your content to send sms"
                    value={smsContent}
                    onChange={(e) => {
                      setSmsContent(e.target.value);
                    }}
                  />
                </div>
              )}
            </div>
            <BottonTheme
              label={"Clear"}
              className={classes.clean_btn}
              onClick={clearContent}
            />{" "}
            <BottonTheme
              label={"Send"}
              onClick={handleSendSmsOrEmail}
              className={classes.detail_btn}
            />
          </Col>
          <Col lg={3}>
            {/* <div className={classes.mail_name + ` mb-3`}>{userName}</div> */}
            <InputGroup className="mb-3">
              <InputGroup.Text id="phone" onClick={handleCall}>
                <BsTelephone />
              </InputGroup.Text>
              <Form.Control
                placeholder="Phone"
                aria-label="Phone"
                value={phoneNumber}
                aria-describedby="phone"
                disabled
                readOnly
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="mail">
                <BsEnvelope />
              </InputGroup.Text>
              <Form.Control
                placeholder="Mail"
                aria-label="Mail"
                value={userEmail}
                aria-describedby="mail"
                disabled
                readOnly
              />
            </InputGroup>
            <ScrollableList style={{ height: 412 }}>
              {notes.map((note, index) => (
                <div key={index}>
                  <StyledNoteAuthor>
                    {note.writer} ({moment(note.date).format('lll')})
                  </StyledNoteAuthor>
                  <p style={{ marginBottom: 0 }}>{note.text}</p>
                  {notes.length - 1 !== index && <hr />}
                </div>
              ))}
            </ScrollableList>
            <hr />
            <div className="mb-3">
              <ScrollableTextarea
                as="textarea"
                className="form-control"
                rows={3}
                value={displayNote}
                placeholder="Note"
                onChange={(e) => {
                  setDisplayNote(e.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && event.shiftKey) {
                    changeNoteText(displayNote);
                  }
                }}
              />
            </div>
            <div
              className="mb-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <BottonTheme
                label={"Add a Note"}
                className={classes.side_btn}
                disabled={noteText === "" ? false : true}
                onClick={() => {
                  changeNoteText(displayNote);
                }}
              />
            </div>
            <div className="mb-3">
              <BottonTheme
                label={"Task"}
                onClick={() => setTaskModal(true)}
                className={classes.side_btn}
              />
            </div>
            {/* <div className="mb-3">
              <BottonTheme
                label={"Book Appointment"}
                className={classes.side_btn}
                onClick={handleNoteAddition}
              />
            </div> */}
            <div className="mb-3">
              <BottonTheme
                label={"Book a Meeting"}
                className={classes.side_btn}
                onClick={navigateCalenar}
              />
            </div>
            <div className="mb-3">
              <BottonTheme
                label={"Calendar"}
                className={classes.side_btn}
                onClick={navigateCalenar}
              />
            </div>
          </Col>
        </Row>
      </Card.Body>
      <AddTaskModal
        handleSubmit={handleAddTaskSubmit}
        adminUsers={adminUsers}
        show={taskModal}
        setShow={(e) => {
          setSelectedTask(null);
          setTaskModal(e);
        }}
        data={
          selectedTask == null
            ? null
            : {
              index: selectedTask?.index,
              stageId: selectedTask?.stageId,
              title: selectedTask?.item?.title,
              description: selectedTask?.item?.description,
              assignedTo: selectedTask?.item?.assignedTo,
              deadline: selectedTask?.item?.deadlineDate,
            }
        }
        optionsArrayBroker={projectData?.assignTo}
        optionsArrayStages={projectData?.stages}
        isLoading={submitloading}
      />
      <BookMeetingDialog
        open={bookMeetingOpened}
        setOpen={setBookMeetingOpened}
      />
    </Card>
  );
};

export default AllContacts;
