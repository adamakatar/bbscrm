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
import UploadImageBox from "../../../Component/UploadImageBox";
import { apiHeader, BaseURL, CreateFormData } from "../../../config/apiUrl";
import classes from "../../Cms/HomeCms/HomeCms.module.css";

const HomeCms = () => {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [loading, setLoading] = useState(false);
  const [pageId, setPageId] = useState("");
  // section 1
  const [section1Title, setSection1Title] = useState("");
  const [section1Description, setSection1Description] = useState("");
  const [section1_image, setSection1_image] = useState(null);
  // section 2
  const [section2Icon1, setSection2Icon1] = useState(null);
  const [section2Title1, setSection2Title1] = useState("");
  const [section2Description1, setSection2Description1] = useState("");

  // section 3
  const [section3Image, setSection3Image] = useState(null);
  const [section3Title, setSection3Title] = useState("");
  const [section3Description, setSection3Description] = useState("");

  // Our Services
  const [section4Title, setSection4Title] = useState("");
  const [section4Description, setSection4Description] = useState("");

  const getPageData = async () => {
    const url = BaseURL("cms/page/services");
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      const homeData = response?.data?.page?.services;
      setPageId(homeData?._id);
      // section1
      setSection1Title(homeData?.section1_title);
      setSection1Description(homeData?.section1_description);
      setSection1_image(homeData?.section1_image);
      // section2
      setSection2Icon1(homeData?.section2_image);
      setSection2Title1(homeData?.section2_title);
      setSection2Description1(homeData?.section2_description);

      // section 3
      setSection3Title(homeData?.section3_title);
      setSection3Description(homeData?.section3_description);
      setSection3Image(homeData?.section3_image);
      // section 4
      setSection4Title(homeData?.section4_title);
      setSection4Description(homeData?.section4_description);
    }
  };
  useEffect(() => {
    getPageData();
  }, []);

  const submit = async () => {
    const url = BaseURL("cms/page/update");
    const params = {
      _id: pageId,
      pageName: "services",

      section1_title: section1Title,
      section1_description: section1Description,
      section1_image: section1_image,

      section2_title: section2Title1,
      section2_description: section2Description1,
      section2_image: section2Icon1,

      section3_title: section3Title,
      section3_image: section3Image,
      section3_description: section3Description,

      section4_title: section4Title,
      section4_description: section4Description,
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`Please fill all the fields!`);
      }
    }
    const formDataParams = CreateFormData(params);
    setLoading(true);
    const response = await Patch(url, formDataParams, apiHeader(accessToken));
    setLoading(false);
    if (response !== undefined) {
      toast.success("Successfully updated");
    }
  };

  return (
    <SideBarSkeleton>
      <div className={classes.mainContainer}>
        <h4 className={classes.heading}>Services Page</h4>
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
              state={section1_image}
              setter={setSection1_image}
              label="Section 1 Image"
              hideDeleteIcon={false}
            />
          </Col>

          <Col md={12} className={classes.formCol}>
            <TextArea
              placeholder="Section 1 Description"
              label="Section 1 Description"
              value={section1Description}
              setter={setSection1Description}
            />
          </Col>

          {/* section 2 */}

          <Col md={6} className={classes.formCol}>
            <Input
              value={section2Title1}
              setter={setSection2Title1}
              placeholder="Section 2 Title 1"
              label="Section 2 Title 1"
            />
          </Col>

          <Col md={6} className={classes.formCol}>
            <UploadImageBox
              state={section2Icon1}
              setter={setSection2Icon1}
              label="Section 2 Image"
              hideDeleteIcon={false}
            />
          </Col>
          <Col md={12} className={classes.formCol}>
            <TextArea
              value={section2Description1}
              setter={setSection2Description1}
              placeholder="Section 2 Description"
              label="Section 2 Description"
            />
          </Col>

          {/* section 4 */}
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
          {/* Our Services */}
          <Col md={6} className={classes.formCol}>
            <Input
              value={section4Title}
              setter={setSection4Title}
              label="Section 4 Title"
              placeholder="Section 4 Title"
            />
          </Col>
          <Col md={12} className={classes.formCol}>
            <TextArea
              placeholder="Section 4 Description"
              label="Section 4 Description"
              value={section4Description}
              setter={setSection4Description}
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
      </div>
    </SideBarSkeleton>
  );
};

export default HomeCms;
