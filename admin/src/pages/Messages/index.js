import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Stack,
  Button,
  Box,
  List,
  Paper,
  Avatar,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { Search } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import { isPlainObject } from '@reduxjs/toolkit';
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import NewMessageDialog from './NewMessageDialog';
import RoomListItem from './RoomListItem';
import { Get, Put } from '../../Axios/AxiosFunctions';
import { BaseURL, apiUrl, imageUrl } from '../../config/apiUrl';
import { INTERVAL_FOR_RUNTIME, MSG_ERROR } from '../../utils/contants';
import Loader from '../../Component/Loader';
import useDebounce from '../../CustomHooks/useDebounce';

const INTERVAL_FOR_RUNTIME_CHAT = 7000;

export default function Messages() {
  const { user, access_token: accessToken } = useSelector((state) => state?.authReducer || {});
  const socket = useRef(null);

  const [rooms, setRooms] = useState([])
  const [dialogOpened, setDialogOpened] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [message, setMessage] = useState('');
  const [searchKey, setSearchKey] = useState('');

  const debouncedSearchKey = useDebounce(searchKey, 500);

  const searchedRooms = useMemo(() => {
    const pattern = new RegExp(debouncedSearchKey, 'gi');
    return rooms.filter((r) => {
      if (pattern.test(r?.title || '')) {
        return true;
      }

      const { users } = r || {};
      if (Array.isArray(users)) {
        for (let u of users) {
          const { userId: { firstName, lastName } } = isPlainObject(u?.userId) ? u : { userId: {} };

          if (pattern.test(firstName || '')) {
            return true;
          }

          if (pattern.test(lastName || '')) {
            return true;
          }
        }
      }

      return false;
    });
  }, [debouncedSearchKey, rooms])

  const getRooms = () => {
    Get(BaseURL(`chats/s-get-rooms/${user._id}`), accessToken)
      .then((res) => {
        const rooms = res.data;
        if (Array.isArray(rooms)) {
          rooms.sort((a, b) => {
            const { users: aUsers } = a || {};

            if (Array.isArray(aUsers)) {
              const aUser = aUsers.find((u) => u?.userId?._id === user?._id && u?.unreadCount > 0);
              if (aUser) {
                return -1;
              } else {
                const { users: bUsers } = b || {};
                if (Array.isArray(bUsers)) {
                  const bUser = bUsers.find((u) => u?.userId?._id === user?._id && u?.unreadCount > 0);
                  if (bUser) return 1;
                }
              }
            }
            return 0;
          });
          setRooms(rooms);
        } else if (typeof res.data === 'string') {
          toast.error(rooms);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data || MSG_ERROR);
      });
  };

  const getChatsByRoom = (roomId) => {
    Get(BaseURL(`chats/s-messages/${roomId}`), accessToken)
      .then((res) => {
        if (Array.isArray(res?.data?.data)) {
          return setChats(res.data.data);
        }
        return toast.error(res?.data?.data?.toString() || MSG_ERROR);
      })
      .catch((err) => {
        return toast.error(err?.response?.data?.toString() || MSG_ERROR);
      });
  };

  const onClickRoom = async (roomId) => {
    setIsLoadingChats(true);
    setMessage('');
    setCurrentRoom(rooms.find((r) => r?._id === roomId) || null);
    getChatsByRoom(roomId);
    setIsLoadingChats(false);
  };

  const sendMessage = async () => {
    if (message) {
      const msg = {
        from: user?._id,
        message: {
          text: message,
          user: {
            _id: user?._id,
            avatar: user?.photo,
            userName: `${user.firstName} ${user.lastName}`,
          },
        },
        createdAt: moment().format(),
      };

      setMessage('');
      setChats([msg, ...chats]);

      Put(BaseURL(`chats/s-send-message/${currentRoom?._id}`), msg, accessToken)
        .then((res) => {
          if (typeof res.data === 'string') {
            return toast.error(res.data);
          }
          return setChats((prev) => {
            prev.splice(0, 1, res.data);
            return prev;
          });
        })
        .catch((err) => {
          return toast.error(err?.response?.data || MSG_ERROR);
        });
    }
  };

  useEffect(() => {
    if (currentRoom) {
      socket.current?.emit("chatJoin", {
        roomId: currentRoom._id,
        userId: user?._id,
      });
      socket.current?.emit("mark-as-read", {
        roomId: currentRoom.id,
        userId: user?._id,
      });
      socket.current?.on("msg", (msg, room) => {
        if (currentRoom._id === room && msg.user?._id !== user?._id) {
          setChats((prev) => [...prev, msg]);
          socket.current?.emit("mark-as-read", {
            roomId: currentRoom.id,
            userId: user?._id,
          });
        }
      });

      getChatsByRoom(currentRoom._id);
      const id = setInterval(() => {
        getChatsByRoom(currentRoom._id);
      }, [INTERVAL_FOR_RUNTIME_CHAT]);
      return () => clearInterval(id);
    }
  }, [currentRoom]);

  useEffect(() => {
    socket.current = io(apiUrl, { transports: ["websocket"] });
    socket.current?.emit("join", { _id: user?._id });

    getRooms();
    const id = setInterval(() => {
      getRooms();
    }, INTERVAL_FOR_RUNTIME);

    return () => {
      socket.current?.emit("disconnected", { _id: user?._id });
      clearInterval(id);
    };
  }, []);

  return (
    <Box bgcolor={grey[100]}>
      <SideBarSkeleton>
        <Container maxWidth="7xl" sx={{ height: 'calc(100vh - 110px)' }}>
          <Stack spacing={2} height="100%">
            <Typography component="h4" variant="h4" fontWeight={700} color="primary">
              Messages
            </Typography>

            <Stack flexGrow={1}>
              <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                <Grid item md={6}>
                  <Stack alignItems="center" spacing={2} component={Paper} height="100%" p={2}>
                    <Stack alignItems="center" spacing={1} width="100%">
                      <Button
                        variant="contained"
                        sx={{ textTransform: 'capitalize' }}
                        onClick={() => setDialogOpened(true)}
                      >New Message</Button>
                      <TextField
                        InputProps={{
                          startAdornment: <Search />
                        }}
                        placeholder="Search..."
                        size="small"
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                        fullWidth
                      />
                    </Stack>

                    <List sx={{ flexGrow: 1, width: '100%', height: '100px', overflow: 'auto' }}>
                      {searchedRooms.map((r) => (
                        <RoomListItem
                          key={r._id}
                          room={r}
                          onClick={onClickRoom}
                          selected={currentRoom?._id === r?._id}
                        />
                      ))}
                    </List>
                  </Stack>
                </Grid>

                <Grid item md={6}>
                  <Stack spacing={2} component={Paper} height="100%" p={3}>
                    {isLoadingChats ? (
                      <Loader />
                    ) : (
                      <>
                        {currentRoom?.reference === "business-group" ? (
                          <Card>
                            <CardContent>
                              <Stack direction="row" spacing={2} alignItems="start">
                                <Avatar
                                  variant="rounded"
                                  src={imageUrl(currentRoom?.business?.images[0])}
                                  alt={currentRoom?.title}
                                />
                                <Stack>
                                  <Typography component="h4" variant="h4" fontWeight={700}>
                                    {currentRoom?.title}
                                  </Typography>
                                  <Typography>
                                    Listing Group
                                  </Typography>
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        ) : (<></>)}
                        <Stack flexDirection="column-reverse" flexGrow={1} gap={2} overflow="auto" py={1} height={100}>
                          {chats.map((c, i) => (
                            <Fragment key={uuidv4()}>
                              <Stack
                                direction="row"
                                justifyContent={user?._id === c?.from ? 'end' : 'start'}
                              >
                                <Stack
                                  direction={user?._id === c?.from ? 'row-reverse' : 'row'}
                                  spacing={1}
                                  width="70%"
                                >
                                  <Stack spacing={1} alignItems="center">
                                    <Avatar />
                                    <Typography component="span" fontSize={12}>
                                      {c?.message.user.userName}
                                    </Typography>
                                  </Stack>
                                  <Stack alignItems={user?._id === c?.from ? 'end' : 'start'} spacing={0.5}>
                                    <Paper
                                      sx={{
                                        p: 1,
                                        maxWidth: '100%',
                                        bgcolor: user?._id === c?.from ? 'lavender' : 'white',
                                      }}
                                    >
                                      <Typography pb={0} sx={{ overflowWrap: 'break-word' }}>
                                        {c?.message?.text}
                                      </Typography>
                                    </Paper>
                                    <Typography component="span" fontSize={14}>
                                      {moment(c?.createdAt).format("hh:mm a")}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </Stack>
                              {/* Date */}
                              {i === chats.length - 1 ? (
                                <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                  <Box bgcolor={grey[500]} height="1px" flexGrow={1} />
                                  <Box bgcolor={grey[300]} py={1} px={3} sx={{ borderRadius: 9999 }}>
                                    <Typography component="span">
                                      {moment(currentRoom?.createdAt).format("DD MMM YYYY")}
                                    </Typography>
                                  </Box>
                                  <Box bgcolor={grey[500]} height="1px" flexGrow={1} />
                                </Stack>
                              ) : moment(chats[i + 1]?.createdAt).format("DD MMM YYYY") !== moment(chats[i]?.createdAt).format("DD MMM YYYY") ? (
                                <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                  <Box bgcolor={grey[500]} height="1px" flexGrow={1} />
                                  <Box bgcolor={grey[300]} py={1} px={3} sx={{ borderRadius: 9999 }}>
                                    <Typography component="span">
                                      {moment(c?.createdAt).format("DD MMM YYYY")}
                                    </Typography>
                                  </Box>
                                  <Box bgcolor={grey[500]} height="1px" flexGrow={1} />
                                </Stack>
                              ) : (
                                <></>
                              )}
                            </Fragment>
                          ))}
                        </Stack>
                        {currentRoom ? (
                          <Stack direction="row" alignItems="start" spacing={1}>
                            <TextField
                              multiline
                              maxRows={3}
                              placeholder="Type your message here..."
                              size="small"
                              sx={{ flexGrow: 1 }}
                              onKeyUp={(e) => {
                                if (e.shiftKey && e.key === 'Enter') {
                                  e.preventDefault();
                                  setMessage(`${message}\n`);
                                } else if (e.key === 'Enter') {
                                  e.preventDefault();
                                  sendMessage();
                                }
                              }}
                              onChange={(e) => setMessage(e.target.value)}
                              value={message}
                            />
                            <Button
                              variant="contained"
                              sx={{ textTransform: 'capitalize' }}
                              onClick={sendMessage}
                            >Send</Button>
                          </Stack>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </Container>
      </SideBarSkeleton>
      <NewMessageDialog
        opened={dialogOpened}
        setOpened={setDialogOpened}
      />
    </Box>
  )
}