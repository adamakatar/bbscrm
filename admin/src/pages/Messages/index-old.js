import moment from "moment";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { RiSendPlaneFill } from "react-icons/ri";
import { IoChevronBackSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { Get, Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import Loader from "../../Component/Loader";
import NoData from "../../Component/NoData/NoData";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import {
  apiHeader,
  apiUrl,
  BaseURL,
  imageUrl,
  recordsLimit,
} from "../../config/apiUrl";
import { GalleryImage } from "../../constant/imagePath";
import classes from "./Messages.module.css";
import SendMessageModal from "../../modals/SendMessageModal";
import { toast } from "react-toastify";
import PaginationComponent from "../../Component/PaginationComponent";
import { useLocation } from "react-router-dom";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";
import useDebounce from "../../CustomHooks/useDebounce";
import SearchInput from "../../Component/SearchInput";

const RenderChat = ({ item, userData }) => {
  const decideChatUser = item?.from === userData?._id;
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
          <div className={classes.chatAvatar_main}>
            <img
              style={
                item?.message?.user?.avatar == null
                  ? { padding: "15px", borderRadius: "0px" }
                  : {}
              }
              src={imageUrl(item?.message?.user?.avatar)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = GalleryImage;
              }}
              alt=""
            />
          </div>
        </div>
      ) : (
        <div className={classes.single_msg}>
          <div className={classes.chatAvatar_main}>
            <img
              style={
                item?.message?.user?.avatar == null
                  ? { padding: "15px", borderRadius: "0px" }
                  : {}
              }
              src={imageUrl(item?.message?.user?.avatar)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = GalleryImage;
              }}
              alt=""
            />
          </div>

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
        onKeyPress={async (e) => {
          if (e.key === "Enter") {
            await sendMsg(messageText);
            await scrollToBottom();
            setMessageText("");
          }
        }}
        type="text"
        placeholder="Type your message here..."
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

const RoomBox = ({
  item,
  setChatsPage,
  setChatsData,
  setSelectedRoom,
  selectedRoom,
}) => {
  const userData = useSelector((state) => state?.authReducer?.user);
  const decideRoomUser = item?.users?.find(
    (e) => e?.userId?._id !== userData?._id
  )?.userId;

  const decideGroupData = !["group", "one-to-one"].includes(item?.reference);
  const image =
    (item?.reference === "lead-group" && item?.lead?.buyer?.photo) ||
    (item?.reference === "business-group" && item?.business?.images[0]) ||
    (["one-to-one", "group"].includes(item?.reference) &&
      decideRoomUser?.photo);

  const title =
    (["business-group", "lead-group"].includes(item?.reference) &&
      item?.title) ||
    (["one-to-one", "group"].includes(item?.reference) &&
      `${decideRoomUser?.firstName} ${decideRoomUser?.lastName}`);

  return (
    <div
      className={[
        classes.singleRoom_head,
        selectedRoom?._id === item?._id && classes.selectedRoom,
      ].join(" ")}
      onClick={() => {
        setChatsPage(1);
        setChatsData([]);
        setSelectedRoom(item);
      }}>
      <div className={classes.singleRoom_main}>
        <div className={classes.avatar_main}>
          <img
            style={
              image == null ? { padding: "18px", borderRadius: "0px" } : {}
            }
            src={imageUrl(image)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = GalleryImage;
            }}
            alt=""
          />
        </div>
        <div className={classes.roomDetails}>
          <div className={classes.info_main}>
            <h6 className={classes.userName}>{title}</h6>
            {decideGroupData && (
              <span className={classes.names}>
                {item?.reference === "business-group"
                  ? item?.users
                      ?.map(
                        (e) => `${e?.userId?.firstName} ${e?.userId?.lastName}`
                      )
                      ?.join(", ")
                  : `${item?.lead?.buyer?.firstName} ${item?.lead?.buyer?.lastName}`}
              </span>
            )}
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
          {selectedRoom?.reference === "business-group" && (
            <div className={classes.chat_header}>
              <div className={classes.chat_useImg}>
                <img src={imageUrl(selectedRoom?.business?.images[0])} alt="" />
              </div>

              <h4>{selectedRoom?.title}</h4>
              <p className={classes.description}>Listing Group</p>
            </div>
          )}
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
                  {i === 0 ? (
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
const RenderRooms = ({
  roomsData,
  roomsLoading,
  setIsModalOpen,
  setChatsPage,
  setChatsData,
  selectedRoom,
  setSelectedRoom,
  roomsTotalCount,
  setRoomsPage,
  roomsPage,
  setSearch,
  search,
}) => {
  return (
    <div className={classes.allRooms_main}>
      <div className={classes.newMsg_btn}>
        <Button
          className={classes.message_btn}
          onClick={() => setIsModalOpen(true)}>
          New Message
          <span>
            <RiSendPlaneFill className={classes.send_icon} />
          </span>
        </Button>
      </div>
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
      ) : roomsData?.length === 0 ? (
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
const Messages = () => {
  const token = useSelector((state) => state?.authReducer?.access_token);
  const userData = useSelector((state) => state?.authReducer?.user);

  const roomDataFromLocation = useLocation()?.state;

  const [roomsData, setRoomsData] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [chatsData, setChatsData] = useState([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [roomsPage, setRoomsPage] = useState(1);
  const [roomsTotalCount, setRoomsTotalCount] = useState(1);
  const [chatsPage, setChatsPage] = useState(1);
  const [chatsTotalCount, setChatsTotalCount] = useState(1);

  const [isMobile, setIsMobile] = useState(false);

  // Changes
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // search for room
  const [search, setSearch] = useState("");
  const debounceSearchTerm = useDebounce(search, 500);

  const msgEndRef = useRef(null);
  const socket = useRef(null);

  function scrollToBottom() {
    // setTimeout(() => {
    msgEndRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    // }, 2000)
  }

  const getAllRoom = async (page = roomsPage) => {
    const apiUrl = BaseURL(
      `chats?page=${page}&limit=${recordsLimit}&type=all&search=${search}`
    );
    setRoomsLoading(true);
    const response = await Get(apiUrl, token);
    if (response !== undefined) {
      setRoomsData(response?.data?.data?.data);
      setRoomsTotalCount(response?.data?.data?.totalCount);
    }
    setRoomsLoading(false);
  };

  const getAllchats = async (page = chatsPage) => {
    const apiUrl = BaseURL(
      `chats/messages/${selectedRoom?._id}?page=${page}&limit=${recordsLimit}`
    );
    page === 1 && setChatsLoading(true);
    const response = await Get(apiUrl, token);
    if (response !== undefined) {
      setChatsData([...response?.data?.data.reverse(), ...chatsData]);
      setChatsTotalCount(Math.ceil(response?.data?.totalCount / recordsLimit));
    }
    page === 1 && setChatsLoading(false);
    page === 1 && scrollToBottom();
  };
  useEffect(() => {
    isMobileViewHook(setIsMobile, 992);
    socket.current = io(apiUrl, { transports: ["websocket"] });
    socket.current?.emit("join", { _id: userData?._id });
    return () => {
      socket.current?.emit("disconnected", { _id: userData?._id });
    };
  }, []);
  useEffect(() => {
    getAllRoom(roomsPage);
  }, [roomsPage]);

  useEffect(() => {
    getAllRoom(1);
  }, [debounceSearchTerm]);

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
        if (selectedRoom?._id == room && msg.user?._id !== userData?._id) {
          setChatsData((prev) => [...prev, msg]);
          socket.current?.emit("mark-as-read", {
            roomId: selectedRoom?.id,
            userId: userData?._id,
          });
          scrollToBottom();
        }
      });
    }
  }, [selectedRoom]);

  // For Location Room
  useEffect(() => {
    if (roomDataFromLocation) {
      setSelectedRoom(roomDataFromLocation);
    }
  }, [roomDataFromLocation]);

  const sendMsg = (e) => {
    if (e === "") {
      return;
    }

    const msg = {
      from: userData?._id,
      message: {
        text: e,
        user: {
          _id: userData?._id,
          avatar: userData?.photo,
          userName: `${userData.firstName} ${userData.lastName}`,
        },
      },
      createdAt: moment().format(),
    };
    const newData = [...chatsData];
    newData.push({ ...msg, roomId: selectedRoom?._id });
    setChatsData(newData);
    socket.current?.emit("msg", {
      ...msg,
      roomId: selectedRoom?._id,
    });

    return;
  };

  const getAllUsersForRoom = async (
    userType,
    setAllUsers,
    setIsFilterLoading
  ) => {
    const url = BaseURL(`users/get-all-users-for-room?role=${userType}`);
    setIsFilterLoading(true);
    const response = await Get(url, token);
    if (response !== undefined) {
      setAllUsers(response?.data?.data);
    }
    setIsFilterLoading(false);
  };
  const sendFirstMessage = async (params) => {
    const url = BaseURL("chats/start");
    setIsSending(true);
    const response = await Post(url, params, apiHeader(token));
    if (response !== undefined) {
      setRoomsData([response?.data?.data, ...roomsData]);
      toast.success("Message send successfully");
      setIsModalOpen(false);
    }
    setIsSending(false);
  };

  return (
    <>
      <SideBarSkeleton>
        <div className={classes.main_container}>
          <div className={classes.main_header}>
            <div className={classes.heading}>
              <h4>Messages</h4>
            </div>
          </div>
          <Row>
            {!isMobile ? (
              <>
                <Col lg={6} xxl={6}>
                  <RenderRooms
                    setChatsData={setChatsData}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom}
                    setChatsPage={setChatsPage}
                    setRoomsPage={setRoomsPage}
                    setIsModalOpen={setIsModalOpen}
                    roomsData={roomsData}
                    roomsLoading={roomsLoading}
                    roomsPage={roomsPage}
                    roomsTotalCount={roomsTotalCount}
                    setSearch={setSearch}
                    search={search}
                  />
                </Col>
                <Col lg={6} xxl={6}>
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
            ) : selectedRoom == null ? (
              <Col md={12}>
                <RenderRooms
                  setChatsData={setChatsData}
                  selectedRoom={selectedRoom}
                  setSelectedRoom={setSelectedRoom}
                  setChatsPage={setChatsPage}
                  setRoomsPage={setRoomsPage}
                  setIsModalOpen={setIsModalOpen}
                  roomsData={roomsData}
                  roomsLoading={roomsLoading}
                  roomsPage={roomsPage}
                  roomsTotalCount={roomsTotalCount}
                  setSearch={setSearch}
                  search={search}
                />
              </Col>
            ) : (
              <Col md={12}>
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
              </Col>
            )}
          </Row>
        </div>
        <SendMessageModal
          setShow={setIsModalOpen}
          show={isModalOpen}
          loading={isSending}
          onClick={sendFirstMessage}
          onFilter={getAllUsersForRoom}
        />
      </SideBarSkeleton>
    </>
  );
};

export default Messages;
