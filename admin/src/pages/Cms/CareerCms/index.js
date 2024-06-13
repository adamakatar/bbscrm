import React, { useEffect, useState } from "react";
import classes from "./CareerCms.module.css";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import { Button } from "../../../Component/Button/Button";
import { Input } from "../../../Component/Input/Input";
import Loader from "../../../Component/Loader";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import { TextArea } from "../../../Component/TextArea";
import { apiHeader, BaseURL, CreateFormData } from "../../../config/apiUrl";

const CareerCms = () => {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [dataLoading, setDataLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pageId, setPageId] = useState("");
  // section 1
  const [section1Title, setSection1Title] = useState("");
  const [section1Description, setSection1Description] = useState("");
  // section 2
  const [section2Title, setSection2Title] = useState("");
  const [section2subTitle1, setSection2subTitle1] = useState("");
  const [section2Description1, setSection2Description1] = useState("");
  const [section2subTitle2, setSection2subTitle2] = useState("");
  const [section2Description2, setSection2Description2] = useState("");

  const getPageData = async () => {
    const url = BaseURL("cms/page/careerOpportunities");
    setDataLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      const pageData = response?.data?.page?.careerOpportunities;
      setPageId(pageData?._id);
      setSection1Title(pageData?.section1_title);
      setSection1Description(pageData?.section1_description);

      setSection2Title(pageData?.section2_title);
      setSection2subTitle1(pageData?.section2_subTitle1);
      setSection2Description1(pageData?.section2_description1);
      setSection2subTitle2(pageData?.section2_subTitle2);
      setSection2Description2(pageData?.section2_description2);
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
      pageName: "careerOpportunities",
      section1_title: section1Title,
      section1_description: section1Description,
      section2_title: section2Title,
      section2_subTitle1: section2subTitle1,
      section2_description1: section2Description1,
      section2_subTitle2: section2subTitle2,
      section2_description2: section2Description2,
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
        <h4 className={classes.heading}>Career Page</h4>
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
              <TextArea
                value={section1Description}
                setter={setSection1Description}
                placeholder="Section 1 Description"
                label="Section 1 Description"
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
            <Col md={6} className={classes.formCol}>
              <Input
                value={section2subTitle1}
                setter={setSection2subTitle1}
                placeholder="Section 2 sub Title 1"
                label="Section 2 sub Title 1"
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <TextArea
                value={section2Description1}
                setter={setSection2Description1}
                placeholder="Section 2 Description 1"
                label="Section 2 Description 1"
              />
            </Col>

            <Col md={6} className={classes.formCol}>
              <Input
                value={section2subTitle2}
                setter={setSection2subTitle2}
                placeholder="Section 2 sub Title 2"
                label="Section 2 sub Title 2"
              />
            </Col>
            <Col md={6} className={classes.formCol}>
              <TextArea
                value={section2Description2}
                setter={setSection2Description2}
                placeholder="Section 2 Description 2"
                label="Section 2 Description 2"
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

export default CareerCms;
