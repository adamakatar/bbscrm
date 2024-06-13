import React, { useEffect, useState } from "react";
import classes from "./SellYourBusinessCms.module.css";
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

const SellYourBusinessCms = () => {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [dataLoading, setDataLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pageId, setPageId] = useState("");
  // section 1
  const [section1Title, setSection1Title] = useState("");
  const [section1Image, setSection1Image] = useState(null);
  const [section1Description, setSection1Description] = useState("");
  // section 2
  const [section2Title, setSection2Title] = useState("");
  const [section2Image, setSection2Image] = useState(null);
  const [section2Description, setSection2Description] = useState("");
  // section 3
  const [section3Title, setSection3Title] = useState("");
  const [section3Image, setSection3Image] = useState(null);
  const [section3Description, setSection3Description] = useState("");
  // section 4
  const [section4Title, setSection4Title] = useState("");
  const [section4Image, setSection4Image] = useState(null);
  const [section4Description, setSection4Description] = useState("");

  const getPageData = async () => {
    const url = BaseURL("cms/page/sellYourBusiness");
    setDataLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      const pageData = response?.data?.page?.sellYourBusiness;
      setPageId(pageData?._id);
      setSection1Title(pageData?.section1_title);
      setSection1Image(pageData?.section1_image);
      setSection1Description(pageData?.section1_description);

      setSection2Title(pageData?.section2_title);
      setSection2Image(pageData?.section2_image);
      setSection2Description(pageData?.section2_description);

      setSection3Title(pageData?.section3_title);
      setSection3Image(pageData?.section3_image);
      setSection3Description(pageData?.section3_description);

      setSection4Title(pageData?.section4_title);
      setSection4Image(pageData?.section4_image);
      setSection4Description(pageData?.section4_description);
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
      pageName: "sellYourBusiness",
      section1_title: section1Title,
      section1_image: section1Image,
      section1_description: section1Description,
      section2_title: section2Title,
      section2_image: section2Image,
      section2_description: section2Description,
      section3_title: section3Title,
      section3_image: section3Image,
      section3_description: section3Description,
      section4_title: section4Title,
      section4_image: section4Image,
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
    if (response !== undefined) {
      toast.success("Successfully updated");
    }
    setLoading(false);
  };

  return (
    <SideBarSkeleton>
      <div className={classes.mainContainer}>
        <h4 className={classes.heading}>Sell Your Business Page</h4>
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
              <UploadImageBox
                state={section1Image}
                setter={setSection1Image}
                label="Section 1 Image"
                hideDeleteIcon={false}
                imgClass={classes.boxImageClass}
              />
            </Col>
            <Col md={12} className={classes.formCol}>
              <TextArea
                value={section1Description}
                setter={setSection1Description}
                placeholder="Section 1 Description"
                label="Section 1 Description"
              />
            </Col>
            {/* section 2 */}
            <Col md={6} className={classes.formCol}>
              <Input
                value={section2Title}
                setter={setSection2Title}
                placeholder="Section 2 Title"
                label="Section 2 Title"
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <UploadImageBox
                state={section2Image}
                setter={setSection2Image}
                label="Section 2 Image"
                hideDeleteIcon={false}
                imgClass={classes.boxImageClass}
              />
            </Col>
            <Col md={12} className={classes.formCol}>
              <TextArea
                value={section2Description}
                setter={setSection2Description}
                placeholder="Section 2 Description"
                label="Section 2 Description"
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
                value={section3Description}
                setter={setSection3Description}
                placeholder="Section 3 Description"
                label="Section 3 Description"
              />
            </Col>

            {/* section 4 */}
            <Col md={6} className={classes.formCol}>
              <Input
                value={section4Title}
                setter={setSection4Title}
                placeholder="Section 4 Title"
                label="Section 4 Title"
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
            <Col md={12} className={classes.formCol}>
              <TextArea
                value={section4Description}
                setter={setSection4Description}
                placeholder="Section 4 Description"
                label="Section 4 Description"
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

export default SellYourBusinessCms;
