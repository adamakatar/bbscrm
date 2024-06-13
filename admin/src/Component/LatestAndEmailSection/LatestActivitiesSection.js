import React, { useEffect, useState } from "react";
import classes from "./LatestAndEmailSection.module.css";
import { Get, Post } from "../../Axios/AxiosFunctions";
import { BaseURL } from "../../config/apiUrl";
import { useSelector } from "react-redux";
import { Chip } from '@mui/material';
// import { GoPrimitiveDot } from "react-icons/go";
import moment from "moment";
const LatestActivitiesSection = ({ item }) => {
  const { access_token: accessToken, user } = useSelector(
      (state) => state?.authReducer
  );
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    if (item.flag == 'chat')
    {
      Get(BaseURL(`chats/room/${item.payload?.room}`), accessToken).then((res) => {
        if (Array.isArray(res?.data?.data?.users)){
          for (let roomUser of res?.data?.data?.users){
            if (roomUser.userId?._id == user.id && roomUser.unreadCount > 0){
              setUnreadCount(roomUser.unreadCount);
            }
          }
        }
      });
    }
  }, [item]);
  return (
    <div>
      <div className={classes.bullet_main}>
        <div className={[classes.date_main]}>
          <p>{moment(item?.createdAt).format("L")}</p>
        </div>
        <div className={classes.email_date_main}>
          <p className={classes.email_para}>
            {/* {item?.seen == false && (
              // <GoPrimitiveDot className={classes.bullet_icon_two} />
            )} */}
            {item?.message}
          </p>
          {unreadCount ? (
                    <Chip label={unreadCount} color="primary" sx={{ px: 1 }} />
                ) : <></>}
        </div>

        <div className={classes.hr_line}></div>
      </div>
    </div>
  );
};

export default LatestActivitiesSection;
