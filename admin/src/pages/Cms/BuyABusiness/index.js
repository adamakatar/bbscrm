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
import { apiHeader, BaseURL } from "../../../config/apiUrl";
import classes from "../HomeCms/HomeCms.module.css";

const BuyABusiness = () => {
  const [section1_title, setSection1_title] = useState("");
  const [section1_subTitle, setSection1_subTitle] = useState("");
  const [section1_description, setSection1_description] = useState("");
  const [section1_image, setSection1_image] = useState(null);
  const [section2_title, setSection2_title] = useState("");
  const [section2_description, setSection2_description] = useState("");

  const [pageId, setPageId] = useState("");
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    const response = await Get(BaseURL("cms/page/listing"), accessToken);
    if (response != undefined) {
      setSection1_title(response?.data?.page?.listing?.section1_title);
      setSection1_subTitle(response?.data?.page?.listing?.section1_subTitle);
      setSection1_description(
        response?.data?.page?.listing?.section1_description
      );
      setSection1_image(response?.data?.page?.listing?.section1_image);
      setPageId(response?.data?.page?.listing?._id);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const submit = async () => {
    const params = {
      section1_title,
      section1_subTitle,
      section1_description,
      section1_image,
      section2_title,
      section2_description,
      _id: pageId,
      pageName: "listing",
    };
    const formData = new FormData();
    for (var key in params) {
      formData.append(key, params[key]);
    }

    setLoading(true);
    const response = await Patch(
      BaseURL("cms/page/update"),
      formData,
      apiHeader(accessToken)
    );
    if (response !== undefined) {
      toast.success("Successfully Updated");
    }
    setLoading(false);
  };

  return (
    <SideBarSkeleton>
      <div className={classes.mainContainer}>
        <h4 className={classes.heading}>Buy A Business Page</h4>
        <Row className={classes.formRow}>
          {/* section 1 */}
          <Col md={6} className={classes.formCol}>
            <Input
              value={section1_title}
              setter={setSection1_title}
              placeholder="Section 1 Title"
              label="Section 1 Title"
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={section1_subTitle}
              setter={setSection1_subTitle}
              placeholder="Section 1 sub Title"
              label="Section 1 sub Title"
            />
          </Col>

          <Col md={12} className={classes.formCol}>
            <TextArea
              placeholder="Section 1 Description"
              label="Section 1 Description"
              value={section1_description}
              setter={setSection1_description}
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
          {/* section 2 */}
          <Col md={12}>
            <Row>
              <Col md={6} className={classes.formCol}>
                <Input
                  value={section2_title}
                  setter={setSection2_title}
                  placeholder="Section 2 Title"
                  label="Section 2 Title"
                />
              </Col>
              <Col md={6} className={classes.formCol}>
                <TextArea
                  placeholder="Section 2 Description"
                  label="Section 2 Description"
                  value={section2_description}
                  setter={setSection2_description}
                />
              </Col>
            </Row>
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

export default BuyABusiness;
