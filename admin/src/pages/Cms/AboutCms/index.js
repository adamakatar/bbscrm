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
import UploadImageBox from "../../../Component/UploadImageBox";
import { apiHeader, BaseURL, CreateFormData } from "../../../config/apiUrl";
import classes from "./AboutCms.module.css";
import QuillInput from "../../../Component/QuillInput";
import Loader from "../../../Component/Loader";

const AboutCms = () => {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [data, setData] = useState(null);
  const [pageName, setPageName] = useState("");
  const [loading, setLoading] = useState(false);
  // section 1
  const [section1Title, setSection1Title] = useState("");
  const [section1SubTitle1, setSection1SubTitle1] = useState("");
  const [section1SubTitle2, setSection1SubTitle2] = useState("");
  const [section1SubTitle3, setSection1SubTitle3] = useState("");
  const [section1Image, setSection1Image] = useState("");
  // section 2
  const [section2Title, setSection2Title] = useState("");
  const [section2Description, setSection2Description] = useState("");
  // section 3
  const [section3Title, setSection3Title] = useState("");
  const [section3Description, setSection3Description] = useState("");
  const [section3Image, setSection3Image] = useState("");
  // section 4
  const [section4Description, setSection4Description] = useState("");
  const [section4Image, setSection4Image] = useState("");
  // section 5
  const [section5Description, setSection5Description] = useState("");
  const [section5Image, setSection5Image] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);

  const getPageData = async () => {
    const url = BaseURL("cms/page/about");
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      const aboutData = response?.data?.page?.about;
      setData(aboutData);
      setPageName(aboutData?.pageName);
      // section 1
      setSection1Title(aboutData?.section1_title);
      setSection1SubTitle1(aboutData?.section1_subTitle1);
      setSection1SubTitle2(aboutData?.section1_subTitle2);
      setSection1SubTitle3(aboutData?.section1_subTitle3);
      setSection1Image(aboutData?.section1_image);
      // section 2
      setSection2Title(aboutData?.section2_title);
      setSection2Description(aboutData?.section2_description);
      // section 3
      setSection3Title(aboutData?.section3_title);
      setSection3Description(aboutData?.section3_description);
      setSection3Image(aboutData?.section3_image);
      // section 4
      setSection4Description(aboutData?.section4_description);
      setSection4Image(aboutData?.section4_image);
      // section 5
      setSection5Description(aboutData?.section5_description);
      setSection5Image(aboutData?.section5_image);
    }
    setLoading(false);
  };
  useEffect(() => {
    getPageData();
  }, []);

  const submit = async () => {
    const url = BaseURL("cms/page/update");
    const params = {
      _id: data?._id,
      pageName,
      section1_title: section1Title,
      section1_subTitle1: section1SubTitle1,
      section1_subTitle2: section1SubTitle2,
      section1_subTitle3: section1SubTitle3,
      section1_image: section1Image,

      section2_title: section2Title,
      section2_description: section2Description,

      section3_title: section3Title,
      section3_description: section3Description,
      section3_image: section3Image,

      section4_description: section4Description,
      section4_image: section4Image,

      section5_description: section5Description,
      section5_image: section5Image,
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`Please fill all the fields!`);
      }
    }
    const formDataParams = CreateFormData(params);
    setIsUpdating(true);
    const response = await Patch(url, formDataParams, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success("About us page updated successfully");
    }
    setIsUpdating(false);
  };

  return (
    <SideBarSkeleton>
      <div className={classes.mainContainer}>
        <h4 className={classes.heading}>About Page</h4>
        {loading ? (
          <Loader />
        ) : (
          <Row className={classes.formRow}>
            {/* section 1 */}
            <Col md={6} className={classes.formCol}>
              <Input
                value={section1Title}
                setter={setSection1Title}
                placeholder="Section 1 Title"
                label="Section 1 Title"
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <UploadImageBox
                state={section1Image}
                setter={setSection1Image}
                label="Section 1 Image"
                hideDeleteIcon={false}
                imgClass={classes.boxImageClass}
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <Input
                value={section1SubTitle1}
                setter={setSection1SubTitle1}
                placeholder="Section 1 Sub Title 1"
                label="Section 1 Sub Title 1"
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <Input
                value={section1SubTitle2}
                setter={setSection1SubTitle2}
                placeholder="Section 1 Sub Title 2"
                label="Section 1 Sub Title 2"
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <Input
                value={section1SubTitle3}
                setter={setSection1SubTitle3}
                placeholder="Section 1 Sub Title 3"
                label="Section 1 Sub Title 3"
              />
            </Col>
            {/* section 2 */}
            <Col md={12} className={classes.formCol}>
              <Input
                value={section2Title}
                setter={setSection2Title}
                placeholder="Section 2 Title"
                label="Section 2 Title"
              />
            </Col>

            <Col md={12} className={classes.formCol}>
              <QuillInput
                value={section2Description}
                setter={setSection2Description}
                placeholder="Section 2 Description"
                label="Section 2 Description"
              />
            </Col>
            {/* section 3 */}

            <Col md={12} className={classes.formCol}>
              <Input
                value={section3Title}
                setter={setSection3Title}
                placeholder="Section 3 Title"
                label="Section 3 Title"
              />
            </Col>

            <Col md={6} className={classes.formCol}>
              <QuillInput
                value={section3Description}
                setter={setSection3Description}
                placeholder="Section 3 Description"
                label="Section 3 Description"
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <UploadImageBox
                state={section3Image}
                setter={setSection3Image}
                label="Section 3 Image"
                hideDeleteIcon={false}
                imgClass={classes.boxImageClass}
              />
            </Col>
            {/* section 4 */}

            <Col md={6} className={classes.formCol}>
              <QuillInput
                value={section4Description}
                setter={setSection4Description}
                placeholder="Section 4 Description"
                label="Section 4 Description"
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <UploadImageBox
                state={section4Image}
                setter={setSection4Image}
                label="Section 4 Image"
                hideDeleteIcon={false}
                imgClass={classes.boxImageClass}
              />
            </Col>
            {/* section 5 */}

            <Col md={6} className={classes.formCol}>
              <QuillInput
                value={section5Description}
                setter={setSection5Description}
                placeholder="Section 5 Description"
                label="Section 5 Description"
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <UploadImageBox
                state={section5Image}
                setter={setSection5Image}
                label="Section 5 Image"
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
        )}
      </div>
    </SideBarSkeleton>
  );
};

export default AboutCms;
