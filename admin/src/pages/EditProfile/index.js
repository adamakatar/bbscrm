import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import { ProfileWithEditButton } from "../../Component/ProfileWithEditButton";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { TextArea } from "../../Component/TextArea";
import { apiHeader, BaseURL, imageUrl } from "../../config/apiUrl";
import { updateUser } from "../../store/auth/authSlice";
import classes from "./editProfile.module.css";
import UpdateProfileModal from "../../modals/UpdateProfileModal";
import ConfigureEmailModal from "../../modals/ConfigureEmailModal";
import { MenuItem, Typography } from "@mui/material";
import { MainTextField } from "../../Component/styledMUIComponents";
import { MSG_ERROR } from "../../utils/contants";

let fetchTimes = 0;

const EditProfile = () => {
  const { access_token: token, user } = useSelector(
    (state) => state?.authReducer
  );
  
  console.log('========> user', user)
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(user ? user?.firstName : "");
  const [photo, setPhoto] = useState(user ? user?.photo : "");
  const [lastName, setLastName] = useState(user ? user?.lastName : "");
  const [cell, setCell] = useState('');
  const [description, setDescription] = useState(user ? user?.description : "");
  const [designation, setDesignation] = useState(user ? user?.designation : "");
  const [meetingLink, setMeetingLink] = useState(user ? user?.meetingLink : "");
  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  // for imap
  const [configureEmail, setConfigureEmail] = useState(false);
  const [twilioPhones, setTwilioPhones] = useState([]);
  const [mobilePhone, setMobilePhone] = useState(user ? user?.mobilePhone : "");

  const handleUpdateUser = async () => {
    const url = BaseURL("users/updateMe");
    let params = {
      firstName,
      lastName,
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == undefined) {
        return toast.error("Please fill the required fields");
      }
    }
    params = {
      ...params,
      description,
      designation,
      cell,
      mobilePhone,
      ...(user?.role?.includes("broker") && {
        meetingLink,
      }),
    };
    setLoading(true);
    const response = await Patch(url, params, apiHeader(token));
    if (response !== undefined) {
      dispatch(updateUser(response?.data?.user));
      toast.success("Successfully Updated");
    }
    setLoading(false);
  };

  async function uploadImg(e) {
    const url = BaseURL("users/updatePhoto");
    const formData = new FormData();
    formData.append("photo", e);
    const response = await Patch(url, formData, apiHeader(token, true));
    if (response !== undefined) {
      dispatch(updateUser(response?.data?.user));
      toast.success("Profile picture updated successfully");
      setPhoto(response?.data?.user?.photo);
      setIsOpenModal(false);
    }
  }

  useEffect(() => {
    if (fetchTimes === 0) {
      Get(BaseURL('users/get-twillio-numbers'))
        .then((res) => {
          if (typeof res?.data === 'string') {
            toast.error(res.data)
          } else {
            setTwilioPhones(res?.data || []);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data || MSG_ERROR);
        })
      fetchTimes += 1;
    }
  }, [])
  return (
    <>
      <SideBarSkeleton>
        <div className={classes.mainContainer}>
          <div className={classes.headerContainer}>
            <h3>Update Profile</h3>
            <Button
              label={"Configure Imap Email"}
              onClick={() => setConfigureEmail(true)}
            />
          </div>
          <Row>
            <Col md={12} className={classes.imgCol}>
              <ProfileWithEditButton
                updateImage={photo}
                setUpdateImage={setPhoto}
                onClick={() =>{
                  window.open(
                    typeof photo == "object"
                      ? URL.createObjectURL(photo)
                      : imageUrl(photo),
                    "_blank"
                  );
                }}
              />
              <Button
                label={"Upload Profile"}
                onClick={() => { 
                  setIsOpenModal(true);
                }}
                className={classes.updateProfileBtn}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"First Name"}
                value={firstName}
                setter={setFirstName}
                label={"First Name"}
                customStyle={{
                  boxShadow: "0px 0 5px 2px #0000000d",
                  borderRadius: "10px",
                  border: "none",
                }}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"Last Name"}
                value={lastName}
                setter={setLastName}
                label={"Last Name"}
                customStyle={{
                  boxShadow: "0px 0 5px 2px #0000000d",
                  borderRadius: "10px",
                  border: "none",
                }}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"Email"}
                value={user?.email}
                setter={() => { }}
                label={"Email"}
                disabled={true}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"Designation"}
                value={designation}
                setter={setDesignation}
                label={"Designation"}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Typography component="label" color="#02528a" fontWeight={700}>
                Phone
              </Typography>
              <MainTextField
                select
                fullWidth
                value={cell}
                onChange={(e) => setCell(e.target.value)}
              >
                {twilioPhones.map((p) => (
                  <MenuItem
                    key={p?.phoneNumber}
                    value={p?.phoneNumber}
                  >{p?.phoneNumber}</MenuItem>
                ))}
              </MainTextField>
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"Cell Phone"}
                value={mobilePhone}
                setter={setMobilePhone}
                label={"Cell Phone"}
              />
            </Col>
            {user?.role?.includes("broker") && (
              <Col md={6} className={classes.inputCol}>
                <Input
                  setter={setMeetingLink}
                  value={meetingLink}
                  placeholder={"Meeting Link (Optional)"}
                  label={"Meeting Link"}
                />
              </Col>
            )}

            <Col md={12} className={classes.inputCol}>
              <TextArea
                placeholder={"Description"}
                value={description}
                setter={setDescription}
                label={"Description"}
                className={classes.desc}
              />
            </Col>
            <Col md={12} className={classes.btnCol}>
              <Button
                label={loading ? "Updating..." : "Update"}
                disabled={loading}
                onClick={handleUpdateUser}
              />
            </Col>
          </Row>
        </div>
        <UpdateProfileModal
          show={isOpenModal}
          setPhoto={setPhoto}
          photo={photo}
          setShow={setIsOpenModal}
          handleSubmit={uploadImg}
        />
        {/* imap */}
        {configureEmail && (
          <ConfigureEmailModal
            show={configureEmail}
            setShow={setConfigureEmail}
          />
        )}
      </SideBarSkeleton>
    </>
  );
};

export default EditProfile;
