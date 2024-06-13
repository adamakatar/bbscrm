import { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useSelector } from "react-redux";
import { Phone, NotificationsActive } from "@mui/icons-material";
import { toast } from "react-toastify";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import AddContactDialog from "./dialogs/AddContactDialog";
import { Get, Post } from "../../Axios/AxiosFunctions";
import { BaseURL } from "../../config/apiUrl";
import { INTERVAL_FOR_RUNTIME_2, MSG_ERROR } from "../../utils/contants";
import ProfileSection from "./sections/ProfileSection";
import ContactsSection from "./sections/ContactsSection";
import SendConversationSection from "./sections/SendConversationSection";
import ConversationSection from "./sections/ConversationSection";
import NoteSection from "./sections/NoteSection";
import { Link, useParams, useNavigate } from "react-router-dom";
import AddTaskDialog from "./dialogs/AddTaskDialog";
import DialDialog from "./dialogs/DialDialog";
import ScheduleEventDialog from "../../Component/CalendarComponent/ScheduleEventDialog";
import { Device } from "twilio-client";

export default function Conversation() {
  const { user, access_token: accessToken } = useSelector(
    (state) => state?.authReducer || {}
  );
  
  const navigate = useNavigate();

  const slug = useParams()?.slug;
  const [addContactDialogOpened, setAddContactDialogOpened] = useState(false);
  const [addTaskDialogOpened, setAddTaskDialogOpened] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialDialogOpened, setDialDialogOpened] = useState(false);
  const [scheduleMeetingDialogOpened, setScheduleMeetingDialogOpened] = useState(false)
  const [meetingInvitees, setMeetingInvitees] = useState([]);
  const [contactType, setContactType] = useState("");
  const [device, setDevice] = useState(null);
  const [forwardMsg, setForwardMsg] = useState({});

  const sendSectionRef = useRef(null);

  const gotoProfile = (user_id) => {
    if (user_id)
      navigate(`/user-detail/${user_id}`);
  };

  const handleForward = (msg) => {
    setForwardMsg(msg);
    console.log(msg);
  };

  useEffect(() => {
    const favicon = document.getElementById("favicon");
    const getData = () => {
      Get(BaseURL("communication/s-contacts"), accessToken)
        .then((res) => {
          if (Array.isArray(res.data)) {
            if (res.data.some((c) => c.unreadCount > 0)) {
              favicon.href = "/favicon1.png";
            } else {
              favicon.href = "/favicon.png";
            }
            res.data.sort((a, b) => b.unreadCount - a.unreadCount);
            console.log(">>>>>>>> contacts => ", res.data);
            setContacts(res.data);

            if (slug){
              var result = res.data.filter((contact) => {
                return contact._doc?.contact === slug
              })

              if (result.length > 0){
                setCurrentContact(result[0]);
              }
            }
            
          } else if (typeof res.data === "string") {
            toast.error(res.data);
          }
        })
        .catch((err) => {
          return toast.error(err?.response?.data || MSG_ERROR);
        });
      Get(BaseURL(`users/get-available-meeting-invitees/${user?._id}`), accessToken)
        .then((res) => {
            if (Array.isArray(res.data)) {
                setMeetingInvitees(res.data)
            } else if (typeof res.data === 'string') {
                toast.error(res.data)
            }
        })
        .catch((error) => {
            console.log('>>>>>>>>>> error => ', error);
        })
    };

    getData();
    const id = setInterval(() => {
      getData();
    }, INTERVAL_FOR_RUNTIME_2);
    
    Get(BaseURL(`communication/token?identity=${user?.email}`))
      .then((res) => {
          setDevice(new Device(res.data));
      })
      .catch((err) => {
          console.log('>>>>>>>>>> get token of twilio');
      });

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (currentContact) {
      setContactType(currentContact._doc.role[0].toUpperCase() + currentContact._doc.role.slice(1));
      if (currentContact?.unreadCount) {
        //  Mark as read
        const markAsRead = (contactId) => {
          Post(
            BaseURL("communication/read-conversation"),
            {
              contactId,
              userId: user?._id,
            },
            accessToken
          )
            .then((res) => {
              console.log(">>>>>>> markAsRead => ", res.data);
            })
            .catch((err) => {
              return toast.error(err?.response?.data || err.toString());
            });
        };

        markAsRead(currentContact._doc?._id);
      }

      //  Get call, sms, emails
      const getConversations = (contactId) => {
        setLoading(true);
        Get(
          BaseURL(`communication/s-get-conversations/${contactId}`),
          accessToken
        )
          .then((res) => {
            const { calls, smses, emails } = res.data || {};

            if (
              Array.isArray(calls) &&
              Array.isArray(smses) &&
              Array.isArray(emails)
            ) {
              const processedCalls = calls.map((c) => ({
                type: "call",
                sentAt: c?.createdAt,
                from: c?.from,
                to: c?.to,
                status: c?.direction,
              }));

              const processedSMSes = smses.map((s) => ({
                type: "sms",
                sentAt: s?.createdAt,
                from: s?.from,
                to: s?.to,
                status: s?.status,
                direction: s?.direction,
                body: s?.body,
              }));

              const processedEmails = emails.map((e) => ({
                type: "email",
                sentAt: e?.sentAt,
                from: e?.from,
                to: e?.to,
                subject: e?.subject,
                text: e?.text,
                id: e?._id,
              }));

              const _conversations = [
                ...processedCalls,
                ...processedSMSes,
                ...processedEmails,
              ].sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

              console.log(">>>>>>>> _conversations => ", _conversations);
              setLoading(false);
              setConversations(_conversations);
            }
          })
          .catch((err) => {
            console.log(err?.response?.data || err.toString());
            setLoading(false);
          });
      };
      getConversations(currentContact?._doc?._id);
    }
  }, [currentContact]);

  return (
    <Box bgcolor={grey[100]}>
      <SideBarSkeleton>
        <Container maxWidth="7xl" sx={{ height: "calc(100vh - 110px)" }}>
          <Stack spacing={2} height="100%">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                component="h4"
                variant="h4"
                color="black"
                fontWeight={700}
                fontFamily="Bebas-Neue-bold"
                fontSize="35px"
              >
                Conversations                
              </Typography>
              <Typography
                  component="h4"
                  variant="h4"
                  fontWeight={700}
                  color="primary"
                >
                  {contactType}
                </Typography>
              <Stack spacing={1} direction="row">
                <TextField
                  size="small"
                  type="number"
                  InputProps={{
                    startAdornment: "$",
                  }}
                />
                {currentContact && <Button
                  variant="contained"
                  sx={{ textTransform: "capitalize" }}
                  onClick={() => gotoProfile(currentContact.userId)}
                >
                  Profile
                </Button>}
                <Button
                  variant="contained"
                  sx={{ textTransform: "capitalize" }}
                  onClick={() => setAddTaskDialogOpened(true)}
                >
                  Task
                </Button>
                <Button
                  variant="contained"
                  sx={{ textTransform: "capitalize" }}
                  onClick={() => setScheduleMeetingDialogOpened(true)}
                >
                  Book Appointment
                </Button>
                <Button
                  variant="contained"
                  sx={{ textTransform: "capitalize" }}
                  onClick={() => setAddContactDialogOpened(true)}
                >
                  Add Contact
                </Button>
                {/*
                 <IconButton color="primary" onClick={() => setDialDialogOpened(true)}>
                    <Phone />
                  </IconButton>
                 */}
                 {/*
                <IconButton color="primary">
                  <NotificationsActive />
                </IconButton>*/}
              </Stack>
            </Stack>

            <Stack flexGrow={1}>
              <Box
                 flexDirection="row" 
                 display="inline-flex"
                 flexWrap="wrap"
                 sx={{ 
                  gap: '10px',
                  
                }}
              >
                {/* User list */}
                <Box flexGrow={1} overflow={false}>
                  <ContactsSection
                    contacts={contacts}
                    setContacts={setContacts}
                    currentContact={currentContact}
                    setCurrentContact={setCurrentContact}
                  />
                </Box>

                {/* Email and conversation */}
                <Box flexGrow={1}>
                  <Stack
                    ref={sendSectionRef}
                    height="calc(100vh - 180px)"
                    spacing={2}
                    overflow="auto"
                  >
                    {/* Send SMS and Email */}
                    <SendConversationSection
                      scrollRef={sendSectionRef}
                      contacts={contacts}
                      currentContact={currentContact}
                      setConversations={setConversations}
                      forwardMsg={forwardMsg}
                    />

                    {/* Conversation */}
                    <ConversationSection
                      flexGrow={1}
                      forwardMsg={handleForward}
                      conversations={conversations}
                      currentContact={currentContact}
                      loading={loading}
                    />
                  </Stack>
                </Box>

                {/* Note */}
                <Box flexGrow={1}>
                  <NoteSection currentContact={currentContact} />
                </Box>

                {/* Sidebar*/} 
                {/*  currentContact &&
                    <Box sx={{ 
                      position: 'fixed', 
                      top: '50%', 
                      right: '-30px',
                      transition: 'linear 0.5s',
                      "&:hover": {
                        right: '0'
                      }
                  }}>
                      <ProfileSection currentContact={currentContact} />
                  </Box>
                */}
              </Box>
            </Stack>
          </Stack>
          <Dialog
                open={scheduleMeetingDialogOpened}
                onClose={() => setScheduleMeetingDialogOpened(false)}
            >
                <ScheduleEventDialog
                    availableInvitees={meetingInvitees}
                    setLoading={setLoading}
                    handleClose={() => setScheduleMeetingDialogOpened(false)}
                />
            </Dialog>
        </Container>
      </SideBarSkeleton>

      <AddContactDialog
        open={addContactDialogOpened}
        setOpen={setAddContactDialogOpened}
      />

      <AddTaskDialog
        open={addTaskDialogOpened}
        contacts={contacts}
        setOpen={setAddTaskDialogOpened}
      />

      <DialDialog
        open={dialDialogOpened}
        setOpen={setDialDialogOpened}
        contacts={contacts}
        currentContact={currentContact}
        setConversations={setConversations}
        device={device}
        disableSideBar
      />
    </Box>
  );
}
