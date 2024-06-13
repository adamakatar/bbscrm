import { useState, useEffect } from "react";
import classes from "./Conversation.module.css";
import { Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import * as Twilio from "twilio-client";

import { BsTelephone, BsBell } from "react-icons/bs";
import axios from "axios";
import { BaseURL } from "../../config/apiUrl";

import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { useDispatch, useSelector } from "react-redux";
import "./callbutton.css";
import { styles, callStyles, DialStyles } from "./styles";

import CallingModal from "../../modals/CallingModal/CallingModal";
import IncomingModal from "../../modals/IncomingModal/IncomingModal";
import ContactsModal from "../../modals/ContactsModal/ContactsModal";
import AddContactModal from "../../modals/AddContactModal/AddContactModal";
import DialModal from "../../modals/DialModal/DialModal";
import SearchBox from "../../Component/SearchBox";
import AllContacts from "../../Component/AllContacts";
import { AlertDismissibleExample } from "../../Component/AlertDismissibleExample";
import Loader from '../../Component/Loader';
import { keys } from "../../constant/key";
import { DropDown } from "../../Component/DropDown/DropDown";
import SearchInput from "../../Component/SearchInput";

import { setShowModal, setAddedContacts } from "../../store/conversation/conversationSlice";
import { toast } from "react-toastify";

const Conversation = () => {
  const dispatch = useDispatch();

  const { access_token: token, user } = useSelector(
    (state) => state?.authReducer
  );
  const { hasNotification } = useSelector((state) => state?.commonReducer);
  const { showModal, addedContacts } = useSelector(
    (state) => state?.conversationReducer
  );

  // email form content
  const [emailHistory, setEmailHistory] = useState([]);
  const [smsHistory, setSmsHistory] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [userInfos, setUserInfos] = useState([]);
  const [alertStatus, setAlertStatus] = useState(false);

  const [to, setTo] = useState(``);
  const [subject, setSubject] = useState(``);
  const [emailContent, setEmailContent] = useState(``);

  // sms form content
  const [smsContent, setSmsContent] = useState(``);

  // input content is check if it is email or sms
  const [activeForm, setActiveForm] = useState(`email`);

  // axios request sending url defined
  const baseApiUrl = BaseURL(`sendgrid`);
  const communicationApiUrl = BaseURL("communication");
  const usersApiUrl = BaseURL("users");
  const notesApiUrl = BaseURL("notes");

  // userInfo
  const [userName, setUserName] = useState("");
  const [userNameWithRole, setUserNameWithRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dialNumebrIndex, setDialNumebrIndex] = useState("");
  const [dialNumber, setDialNumber] = useState("");

  const [selectedUserType, setSelectedUserType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // unread functionality
  const [unreadUsers, setUnreadUsers] = useState([]);
  const [unreadIds, setUnreadIds] = useState([]);

  // Note
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [noteArr, setNoteArr] = useState([]);
  const [displayNote, setDisplayNote] = useState("");
  const [displayInfo, setDisplayInfo] = useState({});

  // Modal after add contact from csv
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContact, setNewContact] = useState({
    id: "",
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    role: "",
  });

  // Define state variables for calling
  const [openIncomingModal, setOpenIncomingModal] = useState(false);
  const [conn, setConn] = useState(null);
  const [incomingPhoneNumber, setIncomingPhoneNumber] = useState("");
  const [callerName, setCallerName] = useState("");
  const [callModal, setCallModal] = useState(false);
  const [isOnPhone, setIsOnPhone] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dial Pad
  const [isDialModalOpen, setIsDialModalOpen] = useState(false);

  // Filter conversation
  const [filterOption, setFilterOption] = useState({
    label: "All Conversations",
    value: "all-conversation",
  });
  // For search
  const [search, setSearch] = useState("");

  const [changeUserFlag, setChangeUserFlag] = useState(false);

  const openDialModal = () => {
    setIsDialModalOpen(true);
    console.log(isDialModalOpen, "isDailOpen");
  };

  // get sms and email history
  useEffect(() => {
    fetchUsers();
    fetchEmailHistory();
    fetchSmsHistory();
    fetchCallHistory();
    fetchAllNotes();
  }, [
    baseApiUrl,
    communicationApiUrl,
    usersApiUrl,
    notesApiUrl,
    hasNotification,
  ]);

  useEffect(() => {
    // Fetch Twilio capability token from server
    const getTwilioToken = async () => {
      try {
        const res = await axios.get(
          `${communicationApiUrl}/token?identity=${user.email}`
        );
        if (res.data) {
          Twilio.Device.setup(res.data, { debug: true });
        }
      } catch (err) {
        console.log("Could not fetch token, see console.log");
        console.error(err);
      }
    };
    getTwilioToken();

    // Configure event handlers for Twilio Device
    Twilio.Device.disconnect(() => {
      setConn(null);
      setIsOnPhone(false);
      setOpenIncomingModal(false);
      console.log("Call ended");
    });

    Twilio.Device.ready(() => {
      console.log("Connected");
    });

    Twilio.Device.connect((connection) => {
      setConn(connection);
      console.log("Connect event: ", connection);
    });

    Twilio.Device.incoming(async (connection) => {
      let response = await axios.get(`${communicationApiUrl}/contact-gain`);

      const from = connection.parameters.From;
      const incomingCaller = response?.data?.find(
        (row) => row.contact?.replaceAll(" ", "") === from
      );
      const name = incomingCaller
        ? incomingCaller?.firstName + " " + incomingCaller?.lastName
        : "";

      setConn(connection);
      setIncomingPhoneNumber(from);
      setCallerName(name);
      setOpenIncomingModal(true);

      console.log("Incoming connection from " + from);
      // accept the incoming connection and start two-way audio
      connection.on("reject", () => {
        setConn(null);
        setOpenIncomingModal(false);
      });
    });

    Twilio.Device.on("cancel", () => {
      setConn(null);
      setOpenIncomingModal(false);
    });

    Twilio.Device.on("reject", () => {
      setConn(null);
      setOpenIncomingModal(false);
    });

    return () => {
      Twilio.Device.destroy();
    };
  }, []);

  const fetchEmailHistory = async () => {
    const response = await axios.get(`${baseApiUrl}/getEmailHistory`);
    setEmailHistory(response.data, "email");
    console.log(response.data, "getEmailHistory");
  };

  const fetchSmsHistory = async () => {
    const response = await axios.get(`${communicationApiUrl}/sms-history`);
    setSmsHistory(response.data);
  };

  const fetchCallHistory = async () => {
    const response = await axios.get(`${communicationApiUrl}/call-history`);
    console.log(response.data, "callhistory");
    setCallHistory(response.data);
  };

  const fetchUsers = async () => {
    let response = await axios.get(`${communicationApiUrl}/contact-gain`);
    console.log(response.data);
    setUserInfos(response.data);
  };

  const fetchAllNotes = async () => {
    let response = await axios.get(`${notesApiUrl}/getAllNotes`);
    console.log(response.data);
    setNoteArr(
      [...response.data]?.sort((a, b) => new Date(b.date) - new Date(a.date))
    );
  };

  useEffect(() => {
    let unread = emailHistory
      .filter((email) => !email.isRead && email.from !== userEmail)
      .map((email) => email.from);
    let unreadId = emailHistory
      .filter((email) => !email.isRead && email.from !== userEmail)
      .map((email) => email._id);
    setUnreadUsers([...new Set(unread)]); // we use Set to remove duplicates
    setUnreadIds([...new Set(unreadId)]); // we use Set to remove duplicates
  }, [emailHistory]);

  const fetchNotes = async (sender, receiver) => {
    try {
      const data = {
        sender: sender,
        receiver: receiver,
      };
      const response = await axios.post(`${notesApiUrl}/getNote`, data);
      console.log(response.data[0]);
      setNoteText(response.data[0].text);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleUserClick = (users) => {
    axios
      .post(`${communicationApiUrl}/read-conversation`, {
        contactId: users._id,
        userId: user._id,
      })
      .then((response) => {
        setUserInfos((prev) => {
          const clonePrev = [...prev];
          const updatingRowIndex = clonePrev.findIndex(
            (row) => row._id === users._id
          );
          clonePrev[updatingRowIndex].readUserIds.push(user._id);

          return clonePrev;
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setUserEmail(users.email);
    setUserNameWithRole(
      users.firstName + " " + users.lastName + " (" + users.role + ")"
    );
    setUserName(users.firstName + " " + users.lastName);
    const userContact = users.contact;
    const _phoneNumber =
      userContact?.slice(0, 1) === "+" ? userContact : `+1${userContact}`;
    setPhoneNumber(_phoneNumber);
    setDialNumber(_phoneNumber);

    setChangeUserFlag((prev) => !prev);

    if (noteArr) {
      // console.log(noteArr, "noteArrrrrrrrrr");
      const note = noteArr.find(
        (note) =>
          (note.sender === user.email || note.sender === "admin@admin.com") &&
          note.receiver === users.email
      );
      // if (note !== undefined) {
      // setNoteText(note.text);
      // setDisplayNote(note.text);
      // setDisplayInfo(note);
      // } else {
      //   setNoteText("");
      //   setDisplayNote("");
      // }
      setNoteText("");
      setDisplayNote("");
      const notesArr = noteArr.filter(
        (note) =>
          (note.sender === user.email || note.sender === "admin@admin.com") &&
          note.receiver === users.email
      );
      setNotes(notesArr);
    }

    if (selectedUserType === "unread") {
      axios
        .post(`${baseApiUrl}/mark-email-as-read`, {
          emailId: user.id,
        })
        .then((response) => {
          console.log("Email marked as read:", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // add contact
  // const handleBulkUpload = (data, fileInfo) => {
  //   const keys = data[0];
  //   const contacts = data.slice(1).map((values) => {
  //     return keys.reduce((object, key, index) => {
  //       object[key] = values[index];
  //       return object;
  //     }, {});
  //   });

  //   const validContacts = contacts.filter((contact) => {
  //     return contact.firstName && contact.lastName && contact.email;
  //   });

  //   dispatch(setAddedContacts([...addedContacts, ...validContacts]));

  //   if (validContacts.length !== contacts.length) {
  //     console.warn("Some contacts were ignored due to missing required fields");
  //   }

  //   console.log(validContacts); // Logs an array of valid contacts in object form
  //   // Further process your valid contacts here as required
  //   dispatch(setShowModal(true)); // Show modal after uploading contacts
  // };
  const handleAddContact = () => {
    setShowAddContactModal(true);
  };

  const handleInputChange = (event) => {
    setNewContact({
      ...newContact,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(setAddedContacts([...addedContacts, newContact]));

    let response = await axios.post(
      `${communicationApiUrl}/contact-regist`,
      newContact
    );
    // setUserInfos(response.data.result);

    setNewContact({
      id: "",
      firstName: "",
      lastName: "",
      contact: "",
      email: "",
      role: "",
    });
    setShowAddContactModal(false);
    dispatch(setShowModal(true));
    fetchUsers();
  };

  const changeNoteText = (editNotes) => {
    // setNoteText(editNotes);
    setDisplayNote(editNotes);
    if (editNotes !== "" && user.email) {
      handleNoteAddition(editNotes);
    } else {
      console.log("please input text");
    }
  };

  const handleNoteAddition = async (createdNoteText) => {
    const newNote = {
      text: createdNoteText,
      date: new Date().toLocaleString(),
      writer: user.firstName + " " + user.lastName,
      sender: user.email,
      receiver: userEmail,
    };
    try {
      const response = await axios.post(`${notesApiUrl}/create`, newNote);
      console.log(response, "note console=========");
      setNotes((prevNotes) => [newNote, ...prevNotes]);
      setNoteText("");
      setDisplayNote("");
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = userInfos.filter((user) => {
    // Case insensitive search:
    const userName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const doesNameMatch = userName.includes(searchTerm.toLowerCase());
    const doesEmailMatch = user.email.includes(searchTerm.toLowerCase());

    let isUserTypeMatch =
      selectedUserType === "all" || user.role === selectedUserType;
    if (selectedUserType === "unread") {
      // only users with unread emails
      isUserTypeMatch = unreadUsers.includes(user.email);
    }

    return (doesNameMatch || doesEmailMatch) && isUserTypeMatch;
  });

  // close Modal
  const handleClose = () => dispatch(setShowModal(false));

  // dropdown
  const handleDropdownClick = (userType) => {
    setSelectedUserType(userType);
  };

  // handle sending sms and email button
  const handleSendSmsOrEmail = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (activeForm === "email") {
      // await axios.post(`${baseApiUrl}/send-email`, {to, subject, emailContent});
      const res = await axios.post(`${baseApiUrl}/send-email`, {
        from: user?.imap?.user,
        to: userEmail,
        subject,
        emailContent,
      });
      setTo("");
      setSubject("");
      setEmailContent("");
      if (res) {
        console.log('>>>>>>>>> res => ', res);
        fetchCallHistory();
        fetchEmailHistory();
        fetchSmsHistory();
        setLoading(false);
        if (typeof res.data === 'string') {
          return toast.error(res.data);
        } else {
          return toast.success('Sent.');
        }
      }
    } else {
      const response = await axios.post(`${communicationApiUrl}/send-sms`, {
        to: phoneNumber,
        body: smsContent,
      });
      setSmsContent("");

      fetchCallHistory();
      fetchEmailHistory();
      fetchSmsHistory();
      setLoading(false);
    }
  };

  // handle making call
  const handleCall = async (event) => {
    event.preventDefault();
    if (phoneNumber === "") return;
    setCallModal(true);

    if (!isOnPhone) {
      setMuted(false);
      setIsOnPhone(true);
      Twilio.Device.connect({ number: phoneNumber });
    }
  };

  const callModalClose = () => {
    setCallModal(false);
    // hang up call in progress

    if (isOnPhone) {
      Twilio.Device.disconnectAll();
    }
  };

  const incomingModalClose = () => {
    setOpenIncomingModal(false);
    setCallerName("");
    Twilio.Device.disconnectAll();
  };

  const toggleMute = () => {
    const tempMuted = !muted;
    setMuted(tempMuted);
    Twilio.Device.activeConnection().mute(tempMuted);
  };

  // clear form content about sms / email
  const clearContent = (event) => {
    event.preventDefault();
    if (activeForm === "email") {
      setTo("");
      setSubject("");
      setEmailContent("");
    } else {
      setSmsContent("");
    }
  };

  function combineLogs(emailHistory, smsHistory, callHistory) {
    const combinedLogs = [];
    const sent2Me = filterOption.value === "sent-to-me";

    if (emailHistory) {
      emailHistory.forEach((email) => {
        if (sent2Me) {
          if (email.from === user.email || email.to === user.email) {
            if (search) {
              const isMatch =
                email?.subject?.toLowerCase()?.includes(search.toLowerCase()) ||
                email?.text?.toLowerCase()?.includes(search.toLowerCase());
              if (isMatch) {
                combinedLogs.push({
                  type: "email",
                  sentAt: email.sentAt,
                  from: email.from,
                  to: email.to,
                  subject: email.subject,
                  text: email.text,
                  id: email._id,
                });
              }
            } else {
              combinedLogs.push({
                type: "email",
                sentAt: email.sentAt,
                from: email.from,
                to: email.to,
                subject: email.subject,
                text: email.text,
                id: email._id,
              });
            }
          }
        } else {
          if (search) {
            const isMatch =
              email?.subject?.toLowerCase()?.includes(search.toLowerCase()) ||
              email?.text?.toLowerCase()?.includes(search.toLowerCase());
            if (isMatch) {
              combinedLogs.push({
                type: "email",
                sentAt: email.sentAt,
                from: email.from,
                to: email.to,
                subject: email.subject,
                text: email.text,
                id: email._id,
              });
            }
          } else {
            combinedLogs.push({
              type: "email",
              sentAt: email.sentAt,
              from: email.from,
              to: email.to,
              subject: email.subject,
              text: email.text,
              id: email._id,
            });
          }
        }
      });
    }

    if (smsHistory) {
      smsHistory.forEach((sms) => {
        if (sent2Me) {
          if (sms.from === user.contact || sms.to === user.contact) {
            if (search) {
              const isMatch = sms.body
                ?.toLowerCase()
                ?.includes(search.toLowerCase());
              if (isMatch) {
                combinedLogs.push({
                  type: "sms",
                  sentAt: sms.dateSent,
                  from: sms.from,
                  to: sms.to,
                  status: sms.status,
                  direction: sms.direction,
                  body: sms.body,
                });
              }
            } else {
              combinedLogs.push({
                type: "sms",
                sentAt: sms.dateSent,
                from: sms.from,
                to: sms.to,
                status: sms.status,
                direction: sms.direction,
                body: sms.body,
              });
            }
          }
        } else {
          if (search) {
            const isMatch = sms.body
              ?.toLowerCase()
              ?.includes(search.toLowerCase());
            if (isMatch) {
              combinedLogs.push({
                type: "sms",
                sentAt: sms.dateSent,
                from: sms.from,
                to: sms.to,
                status: sms.status,
                direction: sms.direction,
                body: sms.body,
              });
            }
          } else {
            combinedLogs.push({
              type: "sms",
              sentAt: sms.dateSent,
              from: sms.from,
              to: sms.to,
              status: sms.status,
              direction: sms.direction,
              body: sms.body,
            });
          }
        }
      });
    }

    if (callHistory) {
      callHistory.forEach((call) => {
        if (!search) {
          if (sent2Me) {
            if (call.from === user.contact || call.to === user.contact) {
              combinedLogs.push({
                type: "call",
                sentAt: call.dateCreated,
                from: call.from,
                to: call.to,
                status: call.direction,
              });
            }
          } else {
            combinedLogs.push({
              type: "call",
              sentAt: call.dateCreated,
              from: call.from,
              to: call.to,
              status: call.direction,
            });
          }
        }
      });
    }

    combinedLogs.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

    return combinedLogs;
  }

  const onPushNumber = (item) => {
    let real = dialNumber;
    real = real.concat(item.main);
    setDialNumber(real);
  };

  const onFunction = async (type) => {
    if (type === "back") {
      let real = dialNumber.slice(0, dialNumber.length - 1);
      setDialNumber(real);
    } else if (type === "dial") {
      let real = dialNumber;

      if (userInfos.find((item) => item.contact === real) === undefined) {
        setIsDialModalOpen(false);
        setAlertStatus(true);
      } else {
        const userContact = userInfos.find(
          (item) => item.contact === real
        ).contact;
        setPhoneNumber(userContact);

        if (userInfos.find((item) => item.contact === real) === "") return;
        setCallModal(true);

        if (!isOnPhone) {
          setMuted(false);
          setIsOnPhone(true);
          Twilio.Device.connect({ number: userContact });
        }
      }
    }
  };

  return (
    <>
      <SideBarSkeleton>
        <div className={classes.mainContainer}>
          <AlertDismissibleExample
            show={alertStatus}
            changeStatus={(bool) => setAlertStatus(bool)}
          />
          <div>
            <CallingModal
              show={callModal}
              onHide={callModalClose}
              phoneNumber={phoneNumber}
              muted={muted}
              toggleMute={toggleMute}
            />

            <IncomingModal
              device={Twilio.Device}
              connection={conn}
              show={openIncomingModal}
              onHide={incomingModalClose}
              name={callerName}
              phoneNumber={incomingPhoneNumber}
              muted={muted}
              toggleMute={toggleMute}
            />
          </div>
          <div>
            <ContactsModal
              show={showModal}
              onHide={handleClose}
            />
          </div>
          {/* <Row className={classes.mainHeading}> */}
          <Row style={{ alignItems: "center" }}>
            <Col lg={3} style={{ width: "20%" }}>
              <h3>Conversations</h3>
            </Col>
            <Col lg={9}>
              <div className={classes.mainHeading}>
                <div></div>
                <h4 style={{ marginBottom: 0 }}>{userNameWithRole}</h4>
                <div>
                  {/* <CSVReader
                    onFileLoaded={handleBulkUpload}
                    inputId="csvUploadButton"
                    inputStyle={{ display: "none" }}
                  />
                  <Button
                    className={classes.btnBell}
                    onClick={() =>
                      document.getElementById("csvUploadButton").click()
                    }
                  >
                    Bulk Upload
                  </Button>{" "} */}
                  <Button
                    className={classes.btnBell}
                    onClick={handleAddContact}
                  >
                    Add Contact
                  </Button>{" "}
                  <AddContactModal
                    show={showAddContactModal}
                    onHide={() => setShowAddContactModal(false)}
                    newContact={newContact}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                  />
                  <Button
                    className={classes.btnCall}
                    onClick={openDialModal}
                    variant="success"
                  >
                    <BsTelephone />
                  </Button>{" "}
                  <DialModal
                    isOpen={isDialModalOpen}
                    close={() => setIsDialModalOpen(false)}
                    userInfos={userInfos}
                    dialNumber={dialNumber}
                    setDialNumber={setDialNumber}
                    keys={keys}
                    setDialNumebrIndex={setDialNumebrIndex}
                    dialNumebrIndex={dialNumebrIndex}
                    onPushNumber={onPushNumber}
                    onFunction={onFunction}
                    classes={classes}
                    DialStyles={DialStyles}
                  />
                  <Button className={classes.btnBell} variant="warning">
                    <BsBell />
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {loading ? <Loader /> : (
            <Row className={classes.mainRow}>
              <Col lg={3} style={{ width: "20%" }}>
                <SearchBox
                  setSearchTerm={setSearchTerm}
                  handleDropdownClick={handleDropdownClick}
                  filteredUsers={filteredUsers}
                  handleUserClick={handleUserClick}
                  classes={classes}
                  callStyles={callStyles}
                />
              </Col>
              <Col lg={9}>
                {/* Chat Hisotry */}
                <AllContacts
                  changeNoteText={changeNoteText}
                  styles={styles}
                  user={user}
                  userName={userName}
                  phoneNumber={phoneNumber}
                  userEmail={userEmail}
                  noteText={noteText}
                  setNoteText={setNoteText}
                  displayNote={displayNote}
                  setDisplayNote={setDisplayNote}
                  handleNoteAddition={handleNoteAddition}
                  notes={notes}
                  handleCall={handleCall}
                  activeForm={activeForm}
                  setActiveForm={setActiveForm}
                  emailHistory={emailHistory}
                  smsHistory={smsHistory}
                  callHistory={callHistory}
                  subject={subject}
                  setSubject={setSubject}
                  emailContent={emailContent}
                  setEmailContent={setEmailContent}
                  smsContent={smsContent}
                  setSmsContent={setSmsContent}
                  handleSendSmsOrEmail={handleSendSmsOrEmail}
                  clearContent={clearContent}
                  combineLogs={combineLogs}
                  classes={classes} // If you are passing styles and classes
                  callStyles={callStyles} // If you are passing styles and classes
                  displayInfo={displayInfo}
                  filterOption={filterOption}
                  setFilterOption={setFilterOption}
                  changeUserFlag={changeUserFlag}
                  search={search}
                  setSearch={setSearch}
                />
              </Col>
            </Row>
          )}

        </div>
      </SideBarSkeleton>
    </>
  );
};

export default Conversation;
