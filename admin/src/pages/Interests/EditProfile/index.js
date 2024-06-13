import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { Get, Post } from "../../../Axios/AxiosFunctions";
import { Button } from "../../../Component/Button/Button";
import { Input } from "../../../Component/Input/Input";
import { ProfileWithEditButton } from "../../../Component/ProfileWithEditButton";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import { BaseURL, apiHeader, imageUrl } from "../../../config/apiUrl";
import classes from "./EditProfile.module.css";
import Maps from "../../../Component/MapAndPlaces";

let fetchTimes = 0;

const EditInterestsProfile = () => {
  const { access_token: token } = useSelector(
    (state) => state?.authReducer
  );
  
  const id = useParams().id;

  const [firstName, setFirstName] = useState("");
  const [photo, setPhoto] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");

  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [minAnnualIncomeNeeds, setMinAnnualIncomeNeeds] = useState("");
  const [timeAllocatedForBusiness, setTimeAllocatedForBusiness] = useState("");
  const [businessInterested, setBusinessInterested] = useState("");
  const [capitalAvailable, setCapitalAvailable] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [currentOccupation, setCurrentOccupation] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [isOpenModal, setIsOpenModal] = useState(false);
  // for imap

  const handleUpdateUser = async () => {

    const apiUrl = BaseURL(`leads/admin/update/${id}`);
    setLoading(true);
    const response = await Post(apiUrl, {
        nda : {
            firstName,
            lastName,
            contact,
            email,
            streetAddress,
            city,
            preferredLocation: [...preferredLocation.split(",")],
            capitalAvailable: [...capitalAvailable.split(",")],
            currentOccupation,
            businessInterested,
            timeAllocatedForBusiness,
            minAnnualIncomeNeeds    
        }
    }, apiHeader(token));

    if(response == undefined)
        toast.error("Unknown error occured");
    else
        toast.success("Update succeed");
    setLoading(false);
  };

  const getInterestDetail = async () => {
    const apiUrl = BaseURL(`leads/admin/details/${id}`);
    setLoading(true);
    const response = await Get(apiUrl, token);
    if (response !== undefined) {
      setFirstName(response?.data?.lead?.buyer?.firstName);
      setLastName(response?.data?.lead?.buyer?.lastName);
      setPhoto(response?.data?.lead?.buyer?.photo);
      setContact(response?.data?.lead?.buyer?.contact);
      setEmail(response?.data?.lead?.buyer?.email);
      setStreetAddress(response?.data?.lead?.buyer?.nda?.streetAddress);
      setState(response?.data?.lead?.buyer?.nda?.state);
      setZipCode(response?.data?.lead?.buyer?.nda?.zipCode || "");
      setCity(response?.data?.lead?.buyer?.nda?.city);
      setMinAnnualIncomeNeeds(response?.data?.lead?.buyer?.nda?.minAnnualIncomeNeeds);
      setTimeAllocatedForBusiness(response?.data?.lead?.buyer?.nda?.timeAllocatedForBusiness);
      setBusinessInterested(response?.data?.lead?.buyer?.nda?.businessInterested);
      setCapitalAvailable(response?.data?.lead?.buyer?.nda?.capitalAvailable?.[0]);
      setPreferredLocation(response?.data?.lead?.buyer?.nda?.preferredLocation?.[0]);
      setCurrentOccupation(response?.data?.lead?.buyer?.nda?.currentOccupation);
    }
    setLoading(false);
  };

  useEffect(() => {
    getInterestDetail();
  }, []);

  return (
    <>
      <SideBarSkeleton>
        <div className={classes.mainContainer}>
          <div className={classes.headerContainer}>
            <h3>Update Profile</h3>
          </div>
          <Row>
            <Col md={12} className={classes.imgCol}>
              <ProfileWithEditButton
                updateImage={photo}
                setUpdateImage={setPhoto}
                onClick={() =>
                  window.open(
                    typeof photo == "object"
                      ? URL.createObjectURL(photo)
                      : imageUrl(photo),
                    "_blank"
                  )
                }
              />
              <Button
                label={"Upload Profile"}
                onClick={() => setIsOpenModal(true)}
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
                value={email}
                setter={setEmail}
                label={"Email"}
                disabled={true}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"Contact"}
                value={contact}
                setter={setContact}
                label={"Contact"}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
                <Maps
                  setAddress={setStreetAddress}
                  address={streetAddress}
                  setPlaceDetail={(e) => {
                    setCity(e?.city);
                    setState(e?.state);
                    setZipCode(e?.zipcode);
                  }}
                  type={"Places"}
                  placeholder={"Street Address"}
                  loader={
                    <Input placeholder={"Street Address"} type={"text"} />
                  }
                />
            </Col>
            <Col md={6} className={classes.inputCol}>
                <Input
                    type="number"
                    setter={(e) => {
                        if (e < 0) {
                        } else setZipCode(e);
                    }}
                    value={zipCode}
                    placeholder={"Zipcode"}
                />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"State"}
                value={state}
                setter={setState}
                label={"State"}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"City"}
                value={city}
                setter={setCity}
                label={"City"}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"Minimum Annual Income Needs"}
                value={minAnnualIncomeNeeds}
                setter={setMinAnnualIncomeNeeds}
                label={"Minimum Annual Income Needs"}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"Time Allocated For Business"}
                value={timeAllocatedForBusiness}
                setter={setTimeAllocatedForBusiness}
                label={"Time Allocated For Business"}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"Business Interested In"}
                value={businessInterested}
                setter={setBusinessInterested}
                label={"Business Interested In"}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"Capital Available For Purchase"}
                value={capitalAvailable}
                setter={setCapitalAvailable}
                label={"Capital Available For Purchase"}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"Location Preference"}
                value={preferredLocation}
                setter={setPreferredLocation}
                label={"Location Preference"}
              />
            </Col>
            <Col md={6} className={classes.inputCol}>
              <Input
                placeholder={"Current Occupation"}
                value={currentOccupation}
                setter={setCurrentOccupation}
                label={"Current Occupation"}
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
      </SideBarSkeleton>
    </>
  );
};

export default EditInterestsProfile;
