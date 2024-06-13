import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import { Button } from "../../../Component/Button/Button";
import { Input } from "../../../Component/Input/Input";
import Loader from "../../../Component/Loader";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import { TextArea } from "../../../Component/TextArea";
import UploadImageBox from "../../../Component/UploadImageBox";
import { apiHeader, BaseURL, CreateFormData } from "../../../config/apiUrl";
import classes from "./HomeCms.module.css";

const HomeCms = () => {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [dataLoading, setDataLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pageId, setPageId] = useState("");

  // section 1
  const [section1Title, setSection1Title] = useState("");
  const [section1Image, setSection1Image] = useState("");
  const [section1SubTitle, setSection1Sub1Title] = useState("");
  const [section1Description, setSection1Description] = useState("");
  // section 2
  const [section2Icon1, setSection2Icon1] = useState(null);
  const [section2Title1, setSection2Title1] = useState("");
  const [section2Description1, setSection2Description1] = useState("");
  const [section2Icon2, setSection2Icon2] = useState("");
  const [section2Title2, setSection2Title2] = useState("");
  const [section2Description2, setSection2Description2] = useState("");
  // section 3
  const [section3Image, setSection3Image] = useState(null);
  const [section3Title, setSection3Title] = useState("");
  const [section3Description, setSection3Description] = useState("");
  // section 5
  const [section5Title1, setSection5Title1] = useState("");
  const [section5Description1, setSection5Description1] = useState("");
  const [section5Title2, setSection5Title2] = useState("");
  const [section5Description2, setSection5Description2] = useState("");

  const getPageData = async () => {
    const url = BaseURL("cms/page/home");
    setDataLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      const homeData = response?.data?.page?.home;
      setPageId(homeData?._id);
      // section1
      setSection1Title(homeData?.section1_title);
      setSection1Image(homeData?.section1_image);
      setSection1Sub1Title(homeData?.section1_subTitle);
      setSection1Description(homeData?.section1_description);
      // section2
      setSection2Icon1(homeData?.section2_icon1);
      setSection2Title1(homeData?.section2_title1);
      setSection2Description1(homeData?.section2_description1);

      setSection2Icon2(homeData?.section2_icon2);
      setSection2Title2(homeData?.section2_title2);
      setSection2Description2(homeData?.section2_description2);
      // section 3
      setSection3Title(homeData?.section3_title);
      setSection3Description(homeData?.section3_description);
      setSection3Image(homeData?.section3_image);
      // section 5
      setSection5Title1(homeData?.section5_title1);
      setSection5Description1(homeData?.section5_description1);
      setSection5Title2(homeData?.section5_title2);
      setSection5Description2(homeData?.section5_description2);
    }
    setDataLoading(false);
  };
  useEffect(() => {
    getPageData();
  }, []);

  const submit = async () => {
    const url = BaseURL("cms/page/update");
    const params = {
      _id: pageId,
      pageName: "home",
      section1_title: section1Title,
      section1_subTitle: section1SubTitle,
      section1_description: section1Description,
      section1_image: section1Image,
      section2_icon1: section2Icon1,
      section2_title1: section2Title1,
      section2_description1: section2Description1,
      section2_icon2: section2Icon2,
      section2_title2: section2Title2,
      section2_description2: section2Description2,
      section3_title: section3Title,
      section3_description: section3Description,
      section3_image: section3Image,
      section5_title1: section5Title1,
      section5_description1: section5Description1,
      section5_title2: section5Title2,
      section5_description2: section5Description2,
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`Please fill all the fields!`);
      }
    }
    const formDataParams = CreateFormData(params);

    setLoading(true);
    const response = await Patch(url, formDataParams, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success("Successfully updated");
    }
    setLoading(false);
  };

  return (
    <SideBarSkeleton>
      <div className={classes.mainContainer}>
        <h4 className={classes.heading}>Home Page</h4>
        {dataLoading ? (
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
              <Input
                value={section1SubTitle}
                setter={setSection1Sub1Title}
                placeholder="Section 1 Sub Title"
                label="Section 1 Sub Title"
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <TextArea
                placeholder="Section 1 Description"
                label="Section 1 Description"
                value={section1Description}
                setter={setSection1Description}
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <UploadImageBox
                label="Section 1 Image"
                state={section1Image}
                setter={setSection1Image}
                hideDeleteIcon={false}
                imgClass={classes.boxImageClass}
              />
            </Col>
            {/* section 2 */}

            <Col md={6} className={classes.formCol}>
              <UploadImageBox
                state={section2Icon1}
                setter={setSection2Icon1}
                label="Section 2 Icon 1"
                hideDeleteIcon={false}
                imgClass={classes.boxImageClass}
              />
            </Col>

            <Col md={6} className={classes.formCol}>
              <Input
                value={section2Title1}
                setter={setSection2Title1}
                placeholder="Section 2 Title 1"
                label="Section 2 Title 1"
              />
            </Col>

            <Col md={12} className={classes.formCol}>
              <TextArea
                value={section2Description1}
                setter={setSection2Description1}
                placeholder="Section 2 Description 1"
                label="Section 2 Description 1"
              />
            </Col>

            <Col md={6} className={classes.formCol}>
              <UploadImageBox
                state={section2Icon2}
                setter={setSection2Icon2}
                label="Section 2 Icon 2"
                hideDeleteIcon={false}
                imgClass={classes.boxImageClass}
              />
            </Col>

            <Col md={6} className={classes.formCol}>
              <Input
                value={section2Title2}
                setter={setSection2Title2}
                placeholder="Section 2 Title 2"
                label="Section 2 Title 2"
              />
            </Col>

            <Col md={12} className={classes.formCol}>
              <TextArea
                value={section2Description2}
                setter={setSection2Description2}
                placeholder="Section 2 Description 2"
                label="Section 2 Description 2"
              />
            </Col>
            {/* section 3 */}
            <Col md={6} className={classes.formCol}>
              <Input
                value={section3Title}
                setter={setSection3Title}
                placeholder="Section 3 Title"
                label="Section 3 Title"
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
            <Col md={12} className={classes.formCol}>
              <TextArea
                placeholder="Section 3 Description"
                label="Section 3 Description"
                value={section3Description}
                setter={setSection3Description}
              />
            </Col>

            {/* section 5 */}
            <Col md={6} className={classes.formCol}>
              <Input
                value={section5Title1}
                setter={setSection5Title1}
                placeholder="Section 5 Title 1"
                label="Section 5 Title 1"
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <TextArea
                placeholder="Section 5 Description 1"
                label="Section 5 Description 1"
                value={section5Description1}
                setter={setSection5Description1}
              />
            </Col>

            <Col md={6} className={classes.formCol}>
              <Input
                value={section5Title2}
                setter={setSection5Title2}
                placeholder="Section 5 Title 2"
                label="Section 5 Title 2"
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <TextArea
                placeholder="Section 5 Description 2"
                label="Section 5 Description 2"
                value={section5Description2}
                setter={setSection5Description2}
              />
            </Col>

            <Col md={12}>
              <Button
                label={loading ? "Submitting..." : "Update"}
                onClick={submit}
                disabled={loading}
              />
            </Col>
          </Row>
        )}
      </div>
    </SideBarSkeleton>
  );
};

export default HomeCms;
