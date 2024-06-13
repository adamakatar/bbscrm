import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaPhone, FaPhoneAlt } from "react-icons/fa";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";

function IncomingModal({
  device,
  connection,
  show,
  onHide,
  name,
  phoneNumber,
  muted,
  toggleMute,
}) {
  const [accepted, setAccepted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const acceptConnection = () => {
    setAccepted(true);
    setStartTime(new Date().getTime());
    connection.accept();
  };
  const rejectConnection = () => {
    setAccepted(false);
    connection.reject();
    device.disconnectAll();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    setElapsedTime(0);
    setAccepted(false);
  }, [connection]);

  useEffect(() => {
    let intervalId;

    if (accepted) {
      intervalId = setInterval(() => {
        const now = new Date().getTime();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [accepted, startTime]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Body>
        <div id="incoming">
          <div className="modal-body">
            <div className="header-background"></div>
            <div
              className={`avatar-wrapper ${accepted ? "" : "ringing"}`}
            ></div>
            <h2 className="incoming">Incoming Call</h2>
            <h1 className="name">{name ? name : phoneNumber}</h1>
            {name && <div className="phone-number">{phoneNumber}</div>}
            {accepted && (
              <div className="elapsed-time">
                {formatTime(elapsedTime >= 3600 ? 0 : elapsedTime)}
              </div>
            )}
          </div>
          <div className={`modal-footer ${accepted ? "accepted" : ""}`}>
            <div
              className="decline"
              onClick={accepted ? onHide : rejectConnection}
            >
              <FaPhone style={{ transform: "rotate(-135deg)" }} />
            </div>
            <div
              className="accept"
              onClick={accepted ? toggleMute : acceptConnection}
            >
              {accepted ? (
                muted ? (
                  <BiMicrophoneOff />
                ) : (
                  <BiMicrophone />
                )
              ) : (
                <FaPhoneAlt />
              )}
            </div>
          </div>
        </div>
      </Modal.Body>

      <style>{`
          #incoming {
            background-color: black;
            width: 375px;
            height: 667px;
            color: white;
            display: flex;
            flex-direction: column;
            z-index: 1;
            position: relative;
          }
          .modal-dialog {
            max-width: fit-content !important;
            height: 100%;
            display: flex;
            align-items: center;
          }
          .modal-content {
            width: 375px !important;
          }
          .modal-body {
            flex-grow: 1;
            z-index: 1;
            text-align: center;
            padding: 0;
          }
          .modal-footer {
            flex-basis: 100px;
            border: none;
            padding: 15px 30px !important;
          }
          .accepted {
            display: flex !important;
            flex-direction: row-reverse !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
          .decline, .accept {
            display: inline-block;
            font-size: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
            cursor: pointer;
          }
          .accept {
            background-color: #4cda64;
            border-radius: 50px;
            float: right;
          }
          .accept:hover {
            background-color: #20C25E;
          }
          .decline {
            border-radius: 50px;
            float: left;
            background-color: #ff3b2f;
          }
          .decline:hover {
            background-color: #DC2121;
          }
          .avatar-wrapper {
            border-radius: 50%;
            display: block;
            box-sizing: border-box;
            margin: 100px auto 0 auto;
            position: relative;
            background-image: url('/user.png');
            width: 200px;
            height: 200px;
            background-size: cover;
            
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
          }
          .ringing.avatar-wrapper::after {
            content: "";
            background-color: white;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            z-index: -1;
            border-radius: 50%;
            animation: 2s pulse infinite;
          }
          
          @keyframes pulse {
            from {
              transform: none;
              opacity: 0.7;
            }
            to {
              transform: scale(1.5);
              opacity: 0;
            }
          }
          
          .header-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 200px;
            background-color: #4cda64;
            z-index: -2;
            border-bottom-left-radius: 30px;
            border-bottom-right-radius: 30px;
          }
          
          .incoming {
            margin-top: 50px;
            font-size: 25px;
            text-transform: uppercase;
            font-weight: 900;
            color: gray;
          }
          .name {
            font-size: 50px;
            font-weight: 300;
            margin: 0;
          }
          .phone-number {
            font-size: 20px;
            font-weight: 300;
            margin-top: -17px;
          }
          .elapsed-time {
            font-size: 20px;
          }
        `}</style>
    </Modal>
  );
}

export default IncomingModal;
