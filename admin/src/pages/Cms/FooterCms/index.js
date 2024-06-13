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
import { MdOutlineAddCircle, MdCancel } from "react-icons/md";
import classes from "./FooterCms.module.css";
import Loader from "../../../Component/Loader";
import { DropDown } from "../../../Component/DropDown/DropDown";

const FooterCms = () => {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [footerDescription, setFooterDescription] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [icons, setIcons] = useState([{ icon_type: "", link: "" }]);
  const [footerImage, setFooterImage] = useState(null);

  const getPageData = async () => {
    const url = BaseURL("cms/page/footer");
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      const footerData = response?.data?.page?.footer;
      setData(footerData);
      setFooterDescription(footerData?.footer_description);
      setEmail(footerData?.email);
      setIcons(footerData?.footer_icons);
      setContactNo(footerData?.contactNo);
      setFooterImage(footerData?.footer_image);
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
      pageName: data?.pageName,
      footer_description: footerDescription,
      contactNo,
      email,
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(`Please fill all the fields!`);
      }
    }
    if (icons.length == 0) {
      return toast.error("Please fill social icons field");
    }
    for (let key in icons) {
      if (icons[key]?.icon_type == "") {
        return toast.error("Please fill social icon type field");
      }
      if (icons[key]?.link == "") {
        return toast.error("Please fill social link field");
      }
    }
    if (
      typeof footerImage == "object" ? !footerImage?.name : footerImage == null
    ) {
      return toast.error("Please upload footer image");
    }
    const formDataParams = CreateFormData(params);
    icons?.map((item) =>
      formDataParams.append("footer_icons[]", JSON.stringify(item))
    );
    formDataParams.append("footer_image", footerImage);
    setIsUpdating(true);
    const response = await Patch(
      url,
      formDataParams,
      apiHeader(accessToken, true)
    );
    if (response !== undefined) {
      toast.success("Footer updated successfully");
      setIsUpdating(false);
    } else {
      setIsUpdating(false);
    }
  };
  const socialOptions = [
    { label: "Facebook", value: "facebook" },
    { label: "Twitter", value: "twitter" },
    { label: "Instagram", value: "instagram" },
    { label: "LinkedIn", value: "linkedIn" },
  ];
  return (
    <SideBarSkeleton>
      <div className={classes.mainContainer}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h4 className={classes.heading}>Footer</h4>
            <Row className={classes.formRow}>
              <Col md={6} className={classes.formCol}>
                <UploadImageBox
                  state={footerImage}
                  setter={setFooterImage}
                  label="Footer Image"
                  hideDeleteIcon={false}
                  imgClass={classes.img}
                  containerClass={classes.imgBox}
                />
              </Col>
              <Col md={6} />

              <Col md={6} className={classes.formCol}>
                <Input
                  value={email}
                  setter={setEmail}
                  placeholder="Email"
                  label="Email"
                />
              </Col>
              <Col md={6} className={classes.formCol}>
                <Input
                  value={contactNo}
                  setter={setContactNo}
                  placeholder="Contact no"
                  label="Contact No"
                />
              </Col>
              <Col md={12} className={classes.formCol}>
                <TextArea
                  placeholder="Footer description"
                  label="Footer Description"
                  value={footerDescription}
                  setter={setFooterDescription}
                />
              </Col>

              {/* Hours of Operation */}
              {icons?.length < 4 && (
                <Col md={12} className={classes.addMoreBtnContainer}>
                  <Button
                    label={"Add More"}
                    onClick={() => {
                      setIcons((prev) => [
                        ...prev,
                        { icon_type: "", link: "" },
                      ]);
                    }}
                    leftIcon={<MdOutlineAddCircle />}
                  />
                </Col>
              )}
              {icons?.map((item, i) => (
                <>
                  <Col md={6} className={classes.formCol}>
                    <DropDown
                      value={socialOptions?.find(
                        (e) => e?.value == item?.icon_type
                      )}
                      setter={(e) => {
                        const newData = [...icons];
                        newData[i].icon_type = e?.value;
                        setIcons(newData);
                      }}
                      options={socialOptions?.filter((e) => {
                        const exx = icons?.find((d) => d.icon_type == e.value);
                        if (!exx) {
                          return item;
                        }
                      })}
                      placeholder="Socail icon type"
                      label="Socail Icon Type"
                    />
                  </Col>
                  <Col md={6} className={`${classes.formCol} `}>
                    <Input
                      value={item?.link}
                      setter={(e) => {
                        const newData = [...icons];
                        newData[i].link = e;
                        setIcons(newData);
                      }}
                      placeholder="Socail icon link"
                      label="Socail Icon Link"
                      rightIcon={
                        <MdCancel
                          className={classes.cancelIcon}
                          onClick={() => {
                            const newData = [...icons];
                            newData.splice(i, 1);
                            setIcons(newData);
                          }}
                        />
                      }
                    />
                  </Col>
                </>
              ))}

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

export default FooterCms;
