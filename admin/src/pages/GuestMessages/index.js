import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { RiSendPlaneFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { Get } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import Loader from "../../Component/Loader";
import NoData from "../../Component/NoData/NoData";
import PaginationComponent from "../../Component/PaginationComponent";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { apiUrl, BaseURL, recordsLimit } from "../../config/apiUrl";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";
import { IoChevronBackSharp } from "react-icons/io5";

import classes from "./GuestMessages.module.css";
import useDebounce from "../../CustomHooks/useDebounce";
import SearchInput from "../../Component/SearchInput";
import { toast } from "react-toastify";

const RoomBox = ({
  item,
  setChatsPage,
  setChatsData,
  setSelectedRoom,
  selectedRoom,
}) => {
  return (
    <div
      className={[
        classes.singleRoom_head,
        selectedRoom?._id == item?._id && classes.selectedRoom,
      ].join(" ")}
      onClick={() => {
        setChatsPage(1);
        setChatsData([]);
        setSelectedRoom(item);
      }}>
      <div className={classes.singleRoom_main}>
        <div className={classes.roomDetails}>
          <div className={classes.info_main}>
            <h6 className={classes.userName}>
              {item?.users[item?.users?.length - 1]?.userId?.firstName}
            </h6>
            <div className={classes.lastMsg}>
              <p>{item?.lastMessage?.text}</p>
            </div>
          </div>
          <p className={classes.date}>
            {moment(item?.updatedAt).format("DD MMM YYYY")}
          </p>
        </div>
      </div>
    </div>
  );
};

const RenderRooms = ({
  roomsData,
  roomsLoading,
  setChatsPage,
  setChatsData,
  selectedRoom,
  setSelectedRoom,
  roomsTotalCount,
  setRoomsPage,
  roomsPage,
  search,
  setSearch,
}) => {
  return (
    <div className={classes.allRooms_main}>
      <div className={classes.searchInputDiv}>
        <SearchInput
          value={search}
          setter={setSearch}
          placeholder={"Search"}
          customStyle={{ width: "100%", boxShadow: "none" }}
          inputStyle={{
            border: "1px solid #000",
            padding: "8px",
          }}
        />
      </div>
      {roomsLoading ? (
        <Loader />
      ) : roomsData?.length == 0 ? (
        <NoData text={"No Rooms Found"} />
      ) : (
        <>
          <div className={classes.roomsBox}>
            {roomsData?.map((item, index) => {
              return (
                <RoomBox
                  key={index}
                  item={item}
                  setChatsData={setChatsData}
                  setChatsPage={setChatsPage}
                  setSelectedRoom={setSelectedRoom}
                  selectedRoom={selectedRoom}
                />
              );
            })}
          </div>
          {roomsData?.length > 0 && (
            <div className={classes.pagination}>
              <PaginationComponent
                totalPages={Math.ceil(roomsTotalCount / recordsLimit)}
                setCurrentPage={setRoomsPage}
                currentPage={roomsPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const RenderChat = ({ item, userData }) => {
  const decideChatUser = item?.from == userData?._id;
  return (
    <>
      {decideChatUser ? (
        <div className={classes.single_msg_right}>
          <div className={classes.msg_text_main}>
            <div className={classes.msg_text}>
              <p>{item?.message?.text}</p>
            </div>
            <p className={classes.msgSendTime_right}>
              {" "}
              {moment(item?.createdAt).format("hh:mm a")}
            </p>
          </div>
        </div>
      ) : (
        <div className={classes.single_msg}>
          <div className={classes.msg_text_main}>
            <div className={classes.msg_text}>
              <p>{item?.message?.text}</p>
            </div>
            <p className={classes.msgSendTime}>
              {moment(item?.createdAt).format("hh:mm a")}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

const SendInput = ({ sendMsg, scrollToBottom }) => {
  const [messageText, setMessageText] = useState("");

  return (
    <div className={classes.chatInput_box}>
      <input
        onKeyUp={async (e) => {
          if (e.key == "Enter") {
            await sendMsg(messageText);
            await scrollToBottom();
            setMessageText("");
          }
        }}
        type="text"
        placeholder="Type Your Message Here..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <div className={classes.input_icon}>
        <span
          onClick={async () => {
            await sendMsg(messageText);
            await scrollToBottom();
            setMessageText("");
          }}
          className={classes.snd_btn}>
          <RiSendPlaneFill className={classes.send_icon} />
        </span>
      </div>
    </div>
  );
};

const RenderChats = ({
  chatsData,
  chatsLoading,
  sendMsg,
  scrollToBottom,
  msgEndRef,
  selectedRoom,
  chatsTotalCount,
  setPageNo,
  pageNo,
  getAllchats,
}) => {
  const userData = useSelector((state) => state?.authReducer?.user);

  return (
    <div className={classes.chat_main}>
      {chatsLoading ? (
        <Loader />
      ) : (
        <div className={classes.scroller_height}>
          {chatsTotalCount > 1 && chatsTotalCount >= pageNo && (
            <div className={classes.loadMoreBtnDiv}>
              <Button
                label={"Load More"}
                className={classes.loadMoreBtn}
                onClick={() => {
                  const incPage = ++pageNo;
                  getAllchats(incPage);
                  setPageNo(incPage);
                }}
              />
            </div>
          )}
          <div className={classes.allChat_main}>
            {chatsData?.map((item, i) => {
              return (
                <>
                  {i == 0 ? (
                    <div className={classes.msg_day}>
                      <div className={classes.day}>
                        <p>{moment(item?.createdAt).format("DD MMM YYYY")}</p>
                      </div>
                    </div>
                  ) : (
                    moment(chatsData[i - 1]?.createdAt).format(
                      "DD MMM YYYY"
                    ) !==
                      moment(chatsData[i]?.createdAt).format("DD MMM YYYY") && (
                      <div className={classes.msg_day}>
                        <div className={classes.day}>
                          <p>{moment(item?.createdAt).format("DD MMM YYYY")}</p>
                        </div>
                      </div>
                    )
                  )}
                  <div className={classes.message_main}>
                    <RenderChat userData={userData} item={item} />
                  </div>
                </>
              );
            })}
            <SendInput sendMsg={sendMsg} scrollToBottom={scrollToBottom} />
          </div>
          <div ref={msgEndRef} />
        </div>
      )}
    </div>
  );
};

const GuestMessages = () => {
  const token = useSelector((state) => state?.authReducer?.access_token);
  const userData = useSelector((state) => state?.authReducer?.user);
  const socket = useRef(null);
  const msgEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  //   rooms
  const [roomsPage, setRoomsPage] = useState(1);
  const [roomsTotalCount, setRoomsTotalCount] = useState(1);
  const [roomsData, setRoomsData] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  //   chats
  const [chatsData, setChatsData] = useState([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [chatsPage, setChatsPage] = useState(1);
  const [chatsTotalCount, setChatsTotalCount] = useState(1);
  //   selected room
  const [selectedRoom, setSelectedRoom] = useState(null);

  // search for room
  const [search, setSearch] = useState("");
  const debounceSearchTerm = useDebounce(search, 500);

  function scrollToBottom() {
    msgEndRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function handleNewUser(user, msg) {
    toast.success("New user sent a message");
    console.log(user, msg);
  }

  useEffect(() => {
    isMobileViewHook(setIsMobile, 992);
    socket.current = io(apiUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 180000,
      reconnectionDelayMax: 300000,
    });
    socket.current?.emit("join", { _id: userData?._id });
    socket.current?.emit("chatJoin", { _id: userData?._id, roomId: '111' });
    socket.current?.on("newUser", handleNewUser);
    return () => {
      socket.current?.emit("disconnected", { _id: userData?._id });
      socket.current?.off("newUser");
    };
  }, []);

  const getAllRoom = async (page = roomsPage) => {
    const apiUrl = BaseURL(
      `chats/guest-chats-for-admin?page=${page}&limit=${recordsLimit}&search=${search}`
    );
    setRoomsLoading(true);
    const response = await Get(apiUrl, token);
    if (response !== undefined) {
      setRoomsData(response?.data?.data?.data);
      setRoomsTotalCount(response?.data?.data?.totalCount);
    }
    setRoomsLoading(false);
  };

  useEffect(() => {
    getAllRoom(roomsPage);
  }, [roomsPage]);

  useEffect(() => {
    getAllRoom(1);
  }, [debounceSearchTerm]);

  const getAllchats = async (page = chatsPage) => {
    const apiUrl = BaseURL(
      `chats/guest-room-messages/${selectedRoom?._id}?page=${page}&limit=${recordsLimit}&search=${search}`
    );
    page == 1 && setChatsLoading(true);
    const response = await Get(apiUrl, token);
    if (response !== undefined) {
      setChatsData([...response?.data?.data?.chat?.reverse(), ...chatsData]);
      setChatsTotalCount(Math.ceil(response?.data?.totalCount / recordsLimit));
    }
    page == 1 && setChatsLoading(false);
    page == 1 && scrollToBottom();
  };

  useEffect(() => {
    if (selectedRoom !== null) {
      getAllchats();
      socket.current?.emit("chatJoin", {
        roomId: selectedRoom?._id,
        userId: userData?._id,
      });
      socket.current?.emit("mark-as-read", {
        roomId: selectedRoom?.id,
        userId: userData?._id,
      });
      socket.current?.on("msg", (msg, room) => {
        if (selectedRoom?._id == room && msg.user !== userData?._id) {
          setChatsData((prev) => [...prev, msg]);
          socket.current?.emit("mark-as-read", {
            roomId: selectedRoom?.id,
            userId: userData?._id,
          });
          scrollToBottom();
        }
      });
    }
    return () => {
      socket.current?.off("msg")
    }
  }, [selectedRoom]);

  const sendMsg = (e) => {
    if (e == "") {
      return;
    }

    const msg = {
      from: userData?._id,
      message: {
        text: e,
        user: userData?._id,
      },
      createdAt: moment().format(),
    };
    const newData = [...chatsData];
    newData.push({ ...msg, roomId: selectedRoom?._id });
    setChatsData(newData);
    delete msg?.createdAt;
    socket.current?.emit("msg", {
      ...msg,
      roomId: selectedRoom?._id,
    });

    return;
  };

  return (
    <SideBarSkeleton>
      <div className={classes.main_container}>
        <div className={classes.main_header}>
          <div className={classes.heading}>
            <h4>Support Chat</h4>
          </div>
        </div>
        <Row>
          {isMobile ? (
            <Col md={12}>
              {selectedRoom ? (
                <>
                  <IoChevronBackSharp
                    size={30}
                    className={classes.mb10}
                    onClick={() => {
                      setSelectedRoom(null);
                    }}
                  />
                  <RenderChats
                    selectedRoom={selectedRoom}
                    sendMsg={sendMsg}
                    scrollToBottom={scrollToBottom}
                    msgEndRef={msgEndRef}
                    chatsData={chatsData}
                    chatsLoading={chatsLoading}
                    chatsTotalCount={chatsTotalCount}
                    setPageNo={setChatsPage}
                    pageNo={chatsPage}
                    getAllchats={getAllchats}
                  />
                </>
              ) : (
                <Col md={12}>
                  <RenderRooms
                    setChatsData={setChatsData}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom}
                    setChatsPage={setChatsPage}
                    setRoomsPage={setRoomsPage}
                    roomsData={roomsData}
                    roomsLoading={roomsLoading}
                    roomsPage={roomsPage}
                    roomsTotalCount={roomsTotalCount}
                    setSearch={setSearch}
                    search={search}
                  />
                </Col>
              )}
            </Col>
          ) : (
            <>
              <Col lg={4} xxl={3}>
                <RenderRooms
                  setChatsData={setChatsData}
                  selectedRoom={selectedRoom}
                  setSelectedRoom={setSelectedRoom}
                  setChatsPage={setChatsPage}
                  setRoomsPage={setRoomsPage}
                  roomsData={roomsData}
                  roomsLoading={roomsLoading}
                  roomsPage={roomsPage}
                  roomsTotalCount={roomsTotalCount}
                  setSearch={setSearch}
                  search={search}
                />
              </Col>
              <Col lg={8} xxl={9}>
                {selectedRoom ? (
                  <RenderChats
                    selectedRoom={selectedRoom}
                    sendMsg={sendMsg}
                    scrollToBottom={scrollToBottom}
                    msgEndRef={msgEndRef}
                    chatsData={chatsData}
                    chatsLoading={chatsLoading}
                    chatsTotalCount={chatsTotalCount}
                    setPageNo={setChatsPage}
                    pageNo={chatsPage}
                    getAllchats={getAllchats}
                  />
                ) : (
                  <div className={classes.chat_main}>
                    <NoData text="No Room Selected" />
                  </div>
                )}
              </Col>
            </>
          )}
        </Row>
      </div>
    </SideBarSkeleton>
  );
};

export default GuestMessages;
