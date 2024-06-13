import React, { useEffect, useRef, useState } from "react";
import * as Twilio from "twilio-client";
import Style from "./AfterLoginHeader.module.css";
import { Container, OverlayTrigger, Button } from "react-bootstrap";
import CSVReader from "react-csv-reader";
import { useDispatch, useSelector } from "react-redux";
import { BaseURL, apiUrl, imageUrl } from "../../config/apiUrl";
import { CgProfile } from "react-icons/cg";
import { AiFillLock } from "react-icons/ai";
import { GiRotaryPhone } from "react-icons/gi";
import { BiUpload } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import { signOutRequest } from "../../store/auth/authSlice";
import { io } from "socket.io-client";
import axios from "axios";
import CallingModal from "../../modals/CallingModal/CallingModal";
import styled from "styled-components";
import DialDialog from "../../pages/Conversation/dialogs/DialDialog";
import { Get, Post } from "../../Axios/AxiosFunctions";
import {
  setShowModal,
  setAddedContacts,
} from "../../store/conversation/conversationSlice";
import { MSG_ERROR } from "../../utils/contants";
import { toast } from "react-toastify";
import { Device } from "twilio-client";

const StyledDialPhone = styled.div`
  margin-right: 20px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 50%;
  padding: 10px;
`;

export const AfterLoginHeader = ({ className }) => {
  const communicationApiUrl = BaseURL("communication");

  const [showNotificationOverlay, setShowNotificationOverlay] = useState(false);
  const { user, fcmToken, access_token: accessToken } = useSelector((state) => state?.authReducer);
  const { addedContacts } = useSelector((state) => state?.conversationReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Dial Pad
  const [isDialModalOpen, setIsDialModalOpen] = useState(false);
  const [dialNumber, setDialNumber] = useState("");
  const [dialNumebrIndex, setDialNumebrIndex] = useState("");
  const [userInfos, setUserInfos] = useState([]);
  const [callModal, setCallModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOnPhone, setIsOnPhone] = useState(false);
  const [muted, setMuted] = useState(false);
  const [device, setDevice] = useState(null);

  const socket = useRef(null);

  const HandleSubmitSignOut = () => {
    socket.current = io(apiUrl);
    socket.current.emit("logout", user?._id, fcmToken);
    dispatch(signOutRequest());
    navigate("/login");
  };

  const fetchUsers = async () => {
    try {
      let response = await Get(`${communicationApiUrl}/s-contacts`, accessToken);
      setUserInfos(response.data);
    } catch (error) {
      toast.error(error?.response?.data || MSG_ERROR);
    }
  };

  const getTwilioToken = async () => {
    try {
      const res = await axios.get(
        `${communicationApiUrl}/token?identity=${user.email}`
      );
      if (res.data) {
        setDevice(new Device(res.data));
      }
    } catch (err) {
      console.log("Could not fetch token, see console.log");
      console.error(err);
    }
  };

  const onPushNumber = (item) => {
    let real = dialNumber;

    if (real[0] === "0" && item.main === "0" && real.length === 1) {
      real = "+";
    } else {
      real = real.concat(item.main);
    }
    setDialNumber(real);
  };

  const onFunction = async (type) => {
    if (type === "back") {
      let real = dialNumber.slice(0, -1);
      setDialNumber(real);
    } else if (type === "dial") {
      let real = dialNumber;
      setPhoneNumber(real);

      setCallModal(true);

      if (!isOnPhone) {
        setMuted(false);
        setIsOnPhone(true);
        Twilio.Device.connect({ number: real });
      }
    }
  };

  const callModalClose = () => {
    setCallModal(false);
    // hang up call in progress

    if (isOnPhone) {
      Twilio.Device.disconnectAll();
    }
  };

  const toggleMute = () => {
    const tempMuted = !muted;
    setMuted(tempMuted);
    Twilio?.Device?.activeConnection()?.mute(tempMuted);
  };

  // add contact
  const handleBulkUpload = (data, fileInfo) => {
    const keys = data[0];
    const contacts = data.slice(1).map((values) => {
      return keys.reduce((object, key, index) => {
        object[key] = values[index];
        return object;
      }, {});
    });

    const validContacts = contacts.filter((contact) => {
      return contact.firstName && contact.lastName && contact.email;
    });

    dispatch(setAddedContacts([...addedContacts, ...validContacts]));

    if (validContacts.length !== contacts.length) {
      console.warn("Some contacts were ignored due to missing required fields");
    }

    console.log(validContacts); // Logs an array of valid contacts in object form
    // Further process your valid contacts here as required
    dispatch(setShowModal(true)); // Show modal after uploading contacts
  };

  useEffect(() => {
    fetchUsers();
    getTwilioToken();
  }, []);

  return (
    <Container className={[Style.navbarContainer, className].join(" ")}>
      <>
        {/* <StyledDialPhone>
          <GiRotaryPhone size={30} onClick={() => setIsDialModalOpen(true)} />
        </StyledDialPhone> */}
        <div>
          <OverlayTrigger
            placement={"bottom"}
            show={showNotificationOverlay}
            trigger={["click"]}
            overlay={
              <div className={[Style.notifyoverlayDiv]}>
                <ul>
                  <li onClick={() => navigate("/update-profile")}>
                    {" "}
                    <CgProfile
                      size={24}
                      color={"var(--sidebar-text-color)"}
                    />{" "}
                    Update Profile
                  </li>
                  <li
                    onClick={() => navigate("/update-password")}
                    style={{ marginBottom: 10 }}
                  >
                    <AiFillLock size={24} color={"var(--sidebar-text-color)"} />{" "}
                    Update Password
                  </li>
                  <li
                    onClick={() =>
                      document.getElementById("csvUploadButton").click()
                    }
                  >
                    <BiUpload size={24} color={"var(--sidebar-text-color)"} />{" "}
                    Bulk Upload
                  </li>
                  <li
                    className={[Style?.Logout].join(" ")}
                    onClick={() => {
                      HandleSubmitSignOut();
                    }}
                  >
                    <TbLogout size={24} color={"var(--sidebar-text-color)"} />
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
            }
            onToggle={() =>
              setShowNotificationOverlay(!showNotificationOverlay)
            }
          >
            <div className={[Style.profileImg]}>
              <img src={imageUrl(user?.photo)} alt="..." />
            </div>
          </OverlayTrigger>
        </div>

        <CSVReader
          onFileLoaded={handleBulkUpload}
          inputId="csvUploadButton"
          inputStyle={{ display: "none" }}
        />

        <DialDialog
          open={isDialModalOpen}
          setOpen={setIsDialModalOpen}
          contacts={userInfos}
          device={device}
        />
        {/* <DialModal
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
        /> */}

        <CallingModal
          show={callModal}
          onHide={callModalClose}
          phoneNumber={phoneNumber}
          muted={muted}
          toggleMute={toggleMute}
        />
      </>
    </Container>
  );
};
