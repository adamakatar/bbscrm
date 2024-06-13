import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import { Button } from "../../../Component/Button/Button";
import { Input } from "../../../Component/Input/Input";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import { TextArea } from "../../../Component/TextArea";
import { apiHeader, BaseURL, CreateFormData } from "../../../config/apiUrl";
import { MdOutlineAddCircle, MdCancel } from "react-icons/md";
import classes from "./ContactUsCms.module.css";
import Loader from "../../../Component/Loader";
import UploadImageBox from "../../../Component/UploadImageBox";

const ContactUsCms = () => {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // section 1
  const [pageName, setPageName] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [visitUs, setVisitUs] = useState("");
  const [haveQuestions, setHaveQuestions] = useState("");
  const [hoursOfOperation, setHoursOfOperation] = useState([]);
  const [callUs, setCallUs] = useState([]);

  // section 2
  const [getInTouchTitle, setGetInTouchTitle] = useState("");
  const [getInTouchImage, setGetInTouchImage] = useState(null);

  const getPageData = async () => {
    const url = BaseURL("cms/page/contact");
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      const contactData = response?.data?.page?.contact;
      setData(contactData);
      // section1
      setPageName(contactData?.pageName);
      setDescription(contactData?.description);
      setTitle(contactData?.title);
      setVisitUs(contactData?.visitUs);
      setHaveQuestions(contactData?.haveQuestions);
      setHoursOfOperation(contactData?.hoursOfOperation);
      setCallUs(contactData?.callUs);
      //  Section 2
      setGetInTouchImage(contactData?.getInTouchImage);
      setGetInTouchTitle(contactData?.getInTouchTitle);

      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPageData();
  }, []);

  const submit = async () => {
    const url = BaseURL("cms/page/update");

    const params = {
      _id: data?._id,
      pageName,
      title,
      description,
      visitUs,
      haveQuestions,
      getInTouchImage: getInTouchImage,
      getInTouchTitle,
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`Please fill all the fields!`);
      }
    }
    if (hoursOfOperation.length == 0) {
      return toast.error("Please fill hours of operation field");
    }
    for (let key in hoursOfOperation) {
      if (hoursOfOperation[key]?.hours == "") {
        return toast.error("Please fill hours field");
      }
      if (hoursOfOperation[key]?.days == "") {
        return toast.error("Please fill days field");
      }
    }

    if (callUs[0] == "" || callUs[1] == "") {
      return toast.error("Please fill contact numbers field");
    }
    setIsUpdating(true);

    const formDataParams = await CreateFormData(params);
    hoursOfOperation?.map((item) =>
      formDataParams.append("hoursOfOperation[]", JSON.stringify(item))
    );
    callUs?.map((item) => formDataParams.append("callUs", item));

    const response = await Patch(
      url,
      formDataParams,
      apiHeader(accessToken, true)
    );
    if (response !== undefined) {
      toast.success("Contact us page updated successfully");
    }
    setIsUpdating(false);
  };

  return (
    <SideBarSkeleton>
      <div className={classes.mainContainer}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h4 className={classes.heading}>Contact Us Page</h4>
            <Row className={classes.formRow}>
              {/* section 1 */}

              <Col md={6} className={classes.formCol}>
                <Input
                  value={title}
                  setter={setTitle}
                  placeholder="Section 1 title"
                  label="Section1 Title"
                />
              </Col>
              <Col md={12} className={classes.formCol}>
                <TextArea
                  placeholder="Section1 Description"
                  label="Section 1 Description"
                  value={description}
                  setter={setDescription}
                />
              </Col>
              <Col md={6} className={classes.formCol}>
                <Input
                  value={visitUs}
                  setter={setVisitUs}
                  placeholder="Visit us"
                  label="Visit Us"
                />
              </Col>
              <Col md={6} className={classes.formCol}>
                <Input
                  value={haveQuestions}
                  setter={setHaveQuestions}
                  placeholder="Have questions"
                  label="Have Questions"
                />
              </Col>
              <Col md={6} className={classes.formCol}>
                <Input
                  value={callUs[0]}
                  setter={(e) => {
                    const newCallUs = [...callUs];
                    newCallUs[0] = e;
                    setCallUs(newCallUs);
                  }}
                  placeholder="Contact no 1"
                  label="Contact No 1"
                />
              </Col>
              <Col md={6} className={classes.formCol}>
                <Input
                  value={callUs[1]}
                  setter={(e) => {
                    const newCallUs = [...callUs];
                    newCallUs[1] = e;
                    setCallUs(newCallUs);
                  }}
                  placeholder="Contact no 2"
                  label="Contact No 2"
                />
              </Col>
              {/* Hours of Operation */}
              {hoursOfOperation?.length < 2 && (
                <Col md={12} className={classes.addMoreBtnContainer}>
                  <Button
                    label={"Add More"}
                    onClick={() => {
                      setHoursOfOperation((prev) => [
                        ...prev,
                        { days: "", hours: "" },
                      ]);
                    }}
                    leftIcon={<MdOutlineAddCircle />}
                  />
                </Col>
              )}
              {hoursOfOperation?.map((item, i) => (
                <>
                  <Col md={6} className={classes.formCol}>
                    <Input
                      value={item?.days}
                      setter={(e) => {
                        const newData = [...hoursOfOperation];
                        newData[i].days = e;
                        setHoursOfOperation(newData);
                      }}
                      placeholder="Hours of opertaion day"
                      label="Hours Of Opertaion Day"
                    />
                  </Col>
                  <Col md={6} className={`${classes.formCol} `}>
                    <Input
                      value={item?.hours}
                      setter={(e) => {
                        const newData = [...hoursOfOperation];
                        newData[i].hours = e;
                        setHoursOfOperation(newData);
                      }}
                      placeholder="Hours of opertaion hours"
                      label="Hours Of Opertaion Day Hours"
                      rightIcon={
                        <MdCancel
                          className={classes.cancelIcon}
                          onClick={() => {
                            const newData = [...hoursOfOperation];
                            newData.splice(i, 1);
                            setHoursOfOperation(newData);
                          }}
                        />
                      }
                    />
                  </Col>
                </>
              ))}

              {/* section 2 */}
              <Col md={6} className={classes.formCol}>
                <Input
                  value={getInTouchTitle}
                  setter={setGetInTouchTitle}
                  placeholder="Get In Touch Title"
                  label="Get In Touch Title"
                />
              </Col>
              <Col md={6} className={classes.formCol}>
                <UploadImageBox
                  state={getInTouchImage}
                  setter={setGetInTouchImage}
                  label="Get In Touch Image"
                  hideDeleteIcon={false}
                  imgClass={classes.boxImageClass}
                />
              </Col>

              <Col md={12}>
                <Button
                  label={isUpdating ? "Submitting..." : "Update"}
                  onClick={submit}
                  disabled={isUpdating}
                />
              </Col>
            </Row>
          </>
        )}
      </div>
    </SideBarSkeleton>
  );
};

export default ContactUsCms;
