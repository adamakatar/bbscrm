import React from "react";
import classes from "./SingleRoomInbox.module.css";
import parse from "html-react-parser";
import { BsTrash } from "react-icons/bs";
import moment from "moment";

const SingleRoomInbox = ({
  item,
  onClick,
  selectedMail,
  setShow,
  setSingleMainUid,
}) => {
  return (
    <>
      <div
        style={
          ![selectedMail?.uid]?.includes(undefined) &&
          selectedMail?.uid == item?.uid
            ? { backgroundColor: "rgb(229, 245, 255)" }
            : { backgroundColor: "#fff" }
        }
        onClick={onClick}
        className={classes.all_rooms}>
        <p className={classes.heading}>• {item?.subject}</p>
        <p className={classes.text}>{parse(`${item?.textAsHtml}`)}</p>
        <p className={classes.dateText}>
          {moment(item?.date).format("L")} {moment(item?.date).format("LT")}
        </p>
        <div
          onClick={() => {
            setShow(true);
            setSingleMainUid(item?.uid);
          }}
          className={classes.deleteEmailMain}>
          <BsTrash size={22} />
        </div>
      </div>
      <div className={classes.hr_line}></div>
    </>
  );
};

export default SingleRoomInbox;
