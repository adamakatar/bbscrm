import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
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
import ContactsSection from "./sections/ContactsSection";
import SendConversationSection from "./sections/SendConversationSection";
import ConversationSection from "./sections/ConversationSection";
import NoteSection from "./sections/NoteSection";
import { Link } from "react-router-dom";
import AddTaskDialog from "./dialogs/AddTaskDialog";
import DialDialog from "./dialogs/DialDialog";

export default function Conversation() {
  const { user, access_token: accessToken } = useSelector(
    (state) => state?.authReducer || {}
  );

  const [addContactDialogOpened, setAddContactDialogOpened] = useState(false);
  const [addTaskDialogOpened, setAddTaskDialogOpened] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialDialogOpened, setDialDialogOpened] = useState(false);

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
            setContacts(res.data);
          } else if (typeof res.data === "string") {
            toast.error(res.data);
          }
        })
        .catch((err) => {
          return toast.error(err?.response?.data || MSG_ERROR);
        });
    };

    getData();
    const id = setInterval(() => {
      getData();
    }, INTERVAL_FOR_RUNTIME_2);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (currentContact) {
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
                fontWeight={700}
                color="primary"
              >
                Conversations
              </Typography>
              <Stack spacing={1} direction="row">
                <TextField
                  size="small"
                  type="number"
                  InputProps={{
                    startAdornment: "$",
                  }}
                />
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
                  component={Link}
                  to="/calendar"
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
                <IconButton color="primary" onClick={() => setDialDialogOpened(true)}>
                  <Phone />
                </IconButton>
                <IconButton color="primary">
                  <NotificationsActive />
                </IconButton>
              </Stack>
            </Stack>

            <Stack flexGrow={1}>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                {/* User list */}
                <Grid item md={3}>
                  <ContactsSection
                    contacts={contacts}
                    setContacts={setContacts}
                    currentContact={currentContact}
                    setCurrentContact={setCurrentContact}
                  />
                </Grid>

                {/* Email and conversation */}
                <Grid item md={6}>
                  <Stack
                    height="calc(100vh - 170px)"
                    spacing={2}
                    overflow="auto"
                  >
                    {/* Send SMS and Email */}
                    <SendConversationSection
                      currentContact={currentContact}
                      setConversations={setConversations}
                    />

                    {/* Conversation */}
                    <ConversationSection
                      flexGrow={1}
                      conversations={conversations}
                      currentContact={currentContact}
                      loading={loading}
                    />
                  </Stack>
                </Grid>

                {/* Note */}
                <Grid item md={3}>
                  <NoteSection currentContact={currentContact} />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </Container>
      </SideBarSkeleton>

      <AddContactDialog
        open={addContactDialogOpened}
        setOpen={setAddContactDialogOpened}
      />

      <AddTaskDialog
        open={addTaskDialogOpened}
        setOpen={setAddTaskDialogOpened}
      />

      <DialDialog
        open={dialDialogOpened}
        setOpen={setDialDialogOpened}
        contacts={contacts}
        setConversations={setConversations}
      />
    </Box>
  );
}
