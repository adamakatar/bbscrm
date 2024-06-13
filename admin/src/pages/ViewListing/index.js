import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import {
  apiHeader,
  BaseURL,
  imageUrl,
  recordsLimit,
  ReturnFormatedNumber,
} from "../../config/apiUrl";
import classes from "./ViewListing.module.css";
import Carousel from "react-elastic-carousel";
import Loader from "../../Component/Loader";
import { IoLocationSharp } from "react-icons/io5";
import { BsFacebook } from "react-icons/bs";
import { FaYelp, FaInternetExplorer } from "react-icons/fa";
import { FiMap } from "react-icons/fi";
import UploadImageBox from "../../Component/UploadImageBox";
import { Button } from "../../Component/Button/Button";
import AddUserToVipListModal from "../../modals/AddUserToVipListModal";
import { toast } from "react-toastify";
import PaginationComponent from "../../Component/PaginationComponent";
import TableSkeleton from "../../Component/TableSkeleton";
import NoData from "../../Component/NoData/NoData";
import Maps from "../../Component/MapAndPlaces";
import { BsInstagram } from "react-icons/bs";
import { MdOutlineLiquor } from "react-icons/md";
import { SiMicrosoftbing } from "react-icons/si";
import SearchInput from "../../Component/SearchInput";
import { DropDown } from "../../Component/DropDown/DropDown";
import { listingStatusOptions } from "../../constant/commonData";
import useDebounce from "../../CustomHooks/useDebounce";

function CircleIconWithTitle({ data, link, className }) {
  return (
    <div
      className={[classes.circleIconWithTitle, className && className].join(
        " "
      )}>
      <div
        onClick={() => {
          if (link) window.open(link);
        }}>
        {data?.icon}
      </div>
      <p>{data?.name}</p>
      {data?.subTitle && <span>{data?.subTitle}</span>}
    </div>
  );
}

const ViewListing = () => {
  const navigate = useNavigate();
  const isShowDraft = useLocation()?.state?.isShowDraft;
  const slug = useParams()?.slug;
  const { access_token: accessToken, user } = useSelector(
    (state) => state.authReducer
  );
  const isAdmin = user?.role?.some((e) => ["admin", "executive"]?.includes(e));
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [vipUsers, setVipUsers] = useState(null);
  // search
  const [searchListing, setSearchListing] = useState("");
  const debouncedSearchTerm = useDebounce(searchListing, 500);
  const [status, setStatus] = useState({ label: "All", value: "all" });

  // For Interested Listing
  const [isGettingInterestedListing, setIsGettingInterestedListing] =
    useState(false);
  const [interestedListing, setInterestedListing] = useState([]);
  const [interestedListingTotalCount, setInterestedListingTotalCount] =
    useState(0);
  const [interestedListingPage, setInterestedListingPage] = useState(1);

  async function getData() {
    const url = BaseURL(
      isShowDraft ? `business/draft/${slug}` : `business/with-slug/${slug}`
    );

    setIsLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setData(response?.data?.data?.business);
      setVipUsers(response?.data?.data?.vipUsers);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  // Add Users to vip list
  async function addUsersToVipList(e) {
    setIsAdding(true);
    const url = BaseURL(`users/admin/add-to-vip`);
    const body = {
      businessId: data?._id,
      ...e,
    };
    const response = await Patch(url, body, apiHeader(accessToken));
    if (response !== undefined) {
      setIsAdding(false);
      setVipUsers(response?.data?.data);
      toast.success("Vip users updated successfully");
      setIsOpenModal("");
    } else {
      setIsAdding(false);
    }
  }

  const getInterestedListing = async (pageNo, filterStatus = status?.value) => {
    const url = BaseURL(
      `business/interested-listings/${slug}?page=${pageNo}&limit=${recordsLimit}&search=${searchListing}&status=${filterStatus}`
    );
    setIsGettingInterestedListing(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setInterestedListing(response?.data?.data);
      setInterestedListingTotalCount(response?.data?.totalCount);
    }
    setIsGettingInterestedListing(false);
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getInterestedListing(interestedListingPage);
  }, [interestedListingPage]);

  useEffect(() => {
    setInterestedListingPage(1);
    getInterestedListing(1);
  }, [debouncedSearchTerm]);

  const brokers = data?.broker?.map(
    (item) => `${item?.firstName} ${item?.lastName}`
  );
  const onlinePresence = [
    { name: "Google Map", key: "google-map", icon: <IoLocationSharp /> },
    { name: "Facebook", key: "facebook", icon: <BsFacebook /> },
    { name: "Yelp", key: "yelp", icon: <FaYelp /> },
    { name: "MapQuest", key: "map-quest", icon: <FiMap /> },
    { name: "Website", key: "website", icon: <FaInternetExplorer /> },

    { name: "Instagram", key: "instagram", icon: <BsInstagram /> },
    { name: "Drizzly", key: "drizzly", icon: <MdOutlineLiquor /> },
    {
      name: "Bing-Location",
      key: "bing-location",
      icon: <SiMicrosoftbing />,
    },
  ];
  return (
    <>
      <style>
        {`
      .rec.rec-arrow.rec.rec-arrow-left{
        background-color:#242342;
        color:white;
        border-color:#242342;
        font-size:20px;
         width:40px;
        height:40px;
        line-height:40px;
        min-width:40px;
      }
      .rec.rec-arrow.rec.rec-arrow-right{
        background-color:#242342;
        color:white;
        border-color:#242342;
        font-size:20px;
        width:40px;
        height:40px;
        line-height:40px;
        min-width:40px;



      }
      @media screen and (max-width:1440px){
      .table100-head, .table100-body{
        width:1200px;
      }
      .table100.ver1{
        overflow-x:scroll !important;
      }
      }
      @media screen and (max-width:767px){
      .table100-head, .table100-body{
        width:1100px;
      }
      }
      `}
      </style>
      <SideBarSkeleton>
        <div className={classes.ViewListing}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <Row>
                <Col lg={6}>
                  <div className={classes.demoPicture_main}>
                    <h4>Demo Pictures</h4>
                    <div className={classes.demoImage_main}>
                      <img src={imageUrl(data?.dummyImage)} />
                    </div>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className={classes.demoPicture_main}>
                    <h4>Real Pictures</h4>
                    <div className={classes.realImage_main}>
                      <img src={imageUrl(data?.images[0])} />
                    </div>
                    <div className={classes.mini_image_main}>
                      <Carousel
                        breakPoints={[
                          { width: 1, itemsToShow: 1, pagination: true },
                          {
                            width: 400,
                            itemsToShow: 2,
                            itemPadding: [0, 8, 0, 8],
                          },
                          {
                            width: 450,
                            itemsToShow: 3,
                            itemPadding: [0, 8, 0, 8],
                          },
                          {
                            width: 500,
                            itemsToShow: 4,
                            itemPadding: [0, 8, 0, 8],
                          },
                        ]}
                        showArrows={false}>
                        {data?.images?.slice(1)?.map((item) => {
                          return (
                            <div className={classes.realMiniImage_main}>
                              <img src={imageUrl(item)} />
                            </div>
                          );
                        })}
                      </Carousel>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className={classes.description_row}>
                <h4>{data?.title}</h4>
                <div className={classes.btns}>
                  {data?.room !== null && (
                    <Button
                      onClick={() => {
                        navigate("/messages", { state: data?.room });
                      }}
                      label={"Chat"}
                    />
                  )}
                  {isAdmin && (
                    <Button
                      onClick={() => {
                        setIsOpenModal(true);
                      }}
                      label={"Add Users To Vip List"}
                      customStyle={{
                        padding: "13px 2px",
                        width: "140px",
                      }}
                    />
                  )}
                </div>
              </div>
              <Row className={classes.viewDetail_main}>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Status</p>
                  <p
                    className={`${classes.description_text} ${classes.textUpperCase}`}>
                    {data?.status}
                  </p>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>
                    Business Opportunity
                  </p>
                  <p
                    className={`${classes.description_text} ${classes.textUpperCase}`}>
                    ${data?.businessOpportunity}
                  </p>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Industry</p>
                  <p className={classes.description_text}>
                    {data?.industry == ""
                      ? "Not added yet"
                      : `${data?.industry}`}
                  </p>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Cash Flow</p>
                  <p className={classes.description_text}>${data?.cashFlow}</p>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Inventory</p>
                  <p className={classes.description_text}>{data?.inventory}</p>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Sales Revenue</p>
                  <p className={classes.description_text}>
                    ${data?.grossSales}
                  </p>
                </Col>

                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Category</p>
                  <p
                    className={`${classes.description_text} ${classes.textUpperCase}`}>
                    {data?.category?.name}
                  </p>
                </Col>

                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Company Name</p>
                  <p className={classes.description_text}>
                    {data?.companyName == ""
                      ? "Not added yet"
                      : `${data?.companyName}`}
                  </p>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Building SF</p>
                  <p className={classes.description_text}>
                    {data?.buildingSF == ""
                      ? "Not added yet"
                      : `${data?.buildingSF}`}
                  </p>
                </Col>

                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>
                    {data?.amountType == "rent"
                      ? "Monthly Rent"
                      : "Real Estate"}
                  </p>
                  <p className={classes.description_text}>
                    {data?.amountType == "rent"
                      ? data?.monthlyRent == ""
                        ? "Not added yet"
                        : `$${data?.monthlyRent}`
                      : data?.realEstate == ""
                      ? "Not added yet"
                      : `$${data?.realEstate}`}
                  </p>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Employees</p>
                  <p
                    className={
                      classes.description_text
                    }>{`${data?.fullTimeEmployees} FT / ${data?.partTimeEmployees} PT`}</p>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Listing Id</p>
                  <span className={classes.description_text}>
                    {data?.refId}
                  </span>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Assign Broker</p>
                  <span className={classes.description_text}>
                    {brokers?.join(", ")}
                  </span>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>
                    Financing Options
                  </p>
                  <span className={classes.description_text}>
                    {data?.financingOptions?.length == 0
                      ? "Not added yet"
                      : data?.financingOptions?.join(", ")}
                  </span>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>
                    Business Address
                  </p>
                  <p className={classes.description_text}>
                    {data?.businessAddress == ""
                      ? "Not added yet"
                      : data?.businessAddress}
                  </p>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Owner</p>
                  <p className={classes.description_text}>
                    {`${data?.owner?.firstName} ${data?.owner?.lastName}`}
                  </p>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>
                    Auto NDA Approve
                  </p>
                  <p className={classes.description_text}>
                    {`${data?.autoNdaApprove ? "Yes" : "No"}`}
                  </p>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Order</p>
                  <p className={classes.description_text}>{`${data?.order}`}</p>
                </Col>
                <Col xxl={2} lg={3} md={4} sm={6}>
                  <p className={classes.description_heading}>Featured</p>
                  <p className={classes.description_text}>
                    {`${data?.isFeatured ? "Yes" : "No"}`}
                  </p>
                </Col>
                <Col md={12}>
                  <p className={classes.description_heading}>Online Presence</p>
                  <p className={classes.description_text}>
                    <div className={classes.socialIcons}>
                      {data?.thirdPartyPresence?.map((item, i) => {
                        let data = onlinePresence?.find(
                          (innerItem) => innerItem?.key === item?.key
                        );
                        return (
                          <div className={classes.jCenter} key={i}>
                            <CircleIconWithTitle
                              data={data}
                              link={item?.link}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </p>
                </Col>
                <Col md={12}>
                  <p className={classes.description_heading}>
                    Property Information
                  </p>
                  <Row>
                    <Col md={4}>
                      <p className={classes.mediumHeading}>Title</p>
                      <p className={classes.description_text}>
                        {data?.propertyInformation?.title}
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className={classes.mediumHeading}>Description</p>
                      <p className={classes.description_text}>
                        {data?.propertyInformation?.description == ""
                          ? "Not added yet"
                          : `${data?.propertyInformation?.description}`}
                      </p>
                    </Col>
                    <Col md={4} className={classes.mt20}>
                      <p className={classes.mediumHeading}>Lease Rate</p>
                      <p className={classes.description_text}>
                        {data?.propertyInformation?.leaseRate == ""
                          ? "Not added yet"
                          : `$${data?.propertyInformation?.leaseRate}`}
                      </p>
                    </Col>
                    <Col md={8} className={classes.mt20}>
                      <p className={classes.mediumHeading}>Lease Information</p>
                      <p className={classes.description_text}>
                        {data?.propertyInformation?.leaseInformation == ""
                          ? "Not added yet"
                          : data?.propertyInformation?.leaseInformation}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col md={6}>
                  <p className={classes.description_heading}>
                    Owner's Involvement
                  </p>
                  <p className={classes.description_text}>
                    {data?.ownerInvolvment == ""
                      ? "Not added yet"
                      : data?.ownerInvolvment}
                  </p>
                </Col>
                <Col md={6}>
                  <p className={classes.description_heading}>
                    Reason For Selling
                  </p>
                  <p className={classes.description_text}>
                    {data?.reason == "" ? "Not added yet" : data?.reason}
                  </p>
                </Col>
                <Col lg={6}>
                  <div className={classes.description_main}>
                    <p className={classes.description_heading}>
                      Dummy Description
                    </p>
                    <p className={classes.description_text}>
                      {data?.dummyDescription == ""
                        ? "Not added yet"
                        : data?.dummyDescription}
                    </p>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className={classes.description_main}>
                    <p className={classes.description_heading}>Description</p>
                    <p className={classes.description_text}>
                      {data?.description == ""
                        ? "Not added yet"
                        : data?.description}
                    </p>
                  </div>
                </Col>

                <Col md={6}>
                  <p className={classes.description_heading}>Pros</p>
                  <ul className={classes.list}>
                    {data?.pros?.length == 0
                      ? "Not added yet"
                      : data?.pros?.map((item, i) => (
                          <li className={classes.description_text}>{`${
                            i + 1
                          }) ${item}`}</li>
                        ))}
                  </ul>
                </Col>
                <Col md={6}>
                  <p className={classes.description_heading}>Cons</p>
                  <ul className={classes.list}>
                    {data?.cons?.length == 0
                      ? "Not added yet"
                      : data?.cons?.map((item, i) => (
                          <li className={classes.description_text}>{`${
                            i + 1
                          }) ${item}`}</li>
                        ))}
                  </ul>
                </Col>

                <Col md={6}>
                  <p className={classes.description_heading}>
                    Hours Of Operation
                  </p>
                  <p className={classes.description_text}>
                    {data?.hoursOfOperation?.length == 0
                      ? "Not added yet"
                      : data?.hoursOfOperation?.map((item) => {
                          return (
                            <div>
                              {item?.days}: {item?.hours}
                            </div>
                          );
                        })}
                  </p>
                </Col>
                <Col md={6}>
                  <p className={classes.description_heading}>
                    Hours Of Operation Opportunity
                  </p>
                  <p className={classes.description_text}>
                    {data?.hoursOfOperationOpportunity == 0
                      ? "Not added yet"
                      : data?.hoursOfOperationOpportunity}
                  </p>
                </Col>
                <Col md={12}>
                  <p className={classes.description_heading}>
                    Recent Improvements
                  </p>
                  {data?.recentImprovements?.length == 0 ? (
                    "Not added yet"
                  ) : (
                    <Row>
                      {data?.recentImprovements?.map((item) => (
                        <Col lg={4} md={3} sm={6}>
                          <p className={`${classes.mediumHeading}`}>
                            {item?.year}
                          </p>
                          <ul className={classes.list}>
                            {item?.features?.map((e) => (
                              <li className={classes.description_text}>{e}</li>
                            ))}
                          </ul>
                        </Col>
                      ))}
                    </Row>
                  )}
                  <p className={classes.description_text}>
                    {/* {data?.recentImprovements} */}
                  </p>
                </Col>

                <Col md={6}>
                  <p className={classes.description_heading}>
                    Business Highlights
                  </p>
                  <p className={classes.description_text}>
                    {data?.businessHighlights?.length == 0 ? (
                      "Not added yet"
                    ) : (
                      <ul className={classes.list}>
                        {data?.businessHighlights?.map((item, i) => (
                          <li className={classes.description_text}>{`${
                            i + 1
                          }) ${item}`}</li>
                        ))}
                      </ul>
                    )}
                  </p>
                </Col>
                <Col md={12}>
                  <p className={classes.description_heading}>
                    Business Location
                  </p>
                  <Maps
                    className={classes.map}
                    location={{
                      lng: data?.location?.coordinates[0],
                      lat: data?.location?.coordinates[1],
                    }}
                  />
                </Col>
                <Col md={12}>
                  <p className={classes.description_heading}>
                    Financials Analysis
                  </p>
                  <div className={classes.imagesDiv}>
                    {data?.financialsAnalysis?.map((item, i) => {
                      return (
                        <a
                          className={classes.imageBox}
                          href={imageUrl(item)}
                          target={"_blank"}>
                          {" "}
                          <UploadImageBox state={item} edit={false} />
                        </a>
                      );
                    })}
                  </div>
                </Col>
                <Col md={12}>
                  <p className={classes.description_heading}>Demographics</p>
                  <div className={classes.imagesDiv}>
                    {data?.demographics?.map((item, i) => {
                      return (
                        <a
                          className={classes.imageBox}
                          href={imageUrl(item)}
                          target={"_blank"}>
                          <UploadImageBox state={item} edit={false} />
                        </a>
                      );
                    })}
                  </div>
                </Col>
                <Col md={12}>
                  <p className={classes.description_heading}>Financials:</p>
                  <Row>
                    {data?.financialsCSVImages?.length > 0 ? (
                      <Col md={12}>
                        <div className={classes.imagesDiv}>
                          {data?.financialsCSVImages?.map((item, i) => (
                            <a
                              className={classes.imageBox}
                              href={imageUrl(item)}
                              target={"_blank"}>
                              <UploadImageBox state={item} edit={false} />
                            </a>
                          ))}
                        </div>
                      </Col>
                    ) : (
                      <Col md={12}>
                        <p className={classes.mediumHeading}>CSVs</p>
                        <div className={classes.csvContainer}>
                          {/* CSV 1 */}
                          <div className={classes.csvTable}>
                            <table>
                              <thead>
                                <tr>
                                  <th className={classes.column1}>
                                    {data?.financialsCSV1[0]?.column1}
                                  </th>
                                  <th className={classes.column2}>
                                    {data?.financialsCSV1[0]?.column2}
                                  </th>
                                  <th className={classes.column3}>
                                    {data?.financialsCSV1[0]?.column3}
                                  </th>
                                  <th className={classes.column4}>
                                    {data?.financialsCSV1[0]?.column4}
                                  </th>
                                  <th className={classes.column5}>
                                    {data?.financialsCSV1[0]?.column5}
                                  </th>
                                  <th className={classes.column6}>
                                    {data?.financialsCSV1[0]?.column6}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {data?.financialsCSV1?.slice(1)?.map((item) => {
                                  return (
                                    <tr>
                                      <td className={classes.column1}>
                                        {item?.column1}
                                      </td>
                                      <td className={classes.column2}>
                                        {item?.column2}
                                      </td>
                                      <td className={classes.column3}>
                                        {item?.column3}
                                      </td>
                                      <td className={classes.column4}>
                                        {item?.column4}
                                      </td>
                                      <td className={classes.column5}>
                                        {item?.column5}
                                      </td>
                                      <td className={classes.column6}>
                                        {item?.column6}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* CSV 2 */}
                          <div
                            className={[classes.csvTable, classes.mt20].join(
                              " "
                            )}>
                            <table>
                              <thead>
                                <tr>
                                  <th className={classes.column1}>
                                    {data?.financialsCSV2[0]?.column1}
                                  </th>
                                  <th className={classes.column2}>
                                    {data?.financialsCSV2[0]?.column2}
                                  </th>
                                  <th className={classes.column3}>
                                    {data?.financialsCSV2[0]?.column3}
                                  </th>
                                  <th className={classes.column4}>
                                    {data?.financialsCSV2[0]?.column4}
                                  </th>
                                  <th className={classes.column5}>
                                    {data?.financialsCSV2[0]?.column5}
                                  </th>
                                  <th className={classes.column6}>
                                    {data?.financialsCSV2[0]?.column6}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {data?.financialsCSV2?.slice(1)?.map((item) => {
                                  return (
                                    <tr>
                                      <td className={classes.column1}>
                                        {item?.column1}
                                      </td>
                                      <td className={classes.column2}>
                                        {item?.column2}
                                      </td>
                                      <td className={classes.column3}>
                                        {item?.column3}
                                      </td>
                                      <td className={classes.column4}>
                                        {item?.column4}
                                      </td>
                                      <td className={classes.column5}>
                                        {item?.column5}
                                      </td>
                                      <td className={classes.column6}>
                                        {item?.column6}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Col>
                    )}
                    <Col md={12} className={classes.mt20}>
                      <label className={classes.label}>Description</label>
                      <p className={classes.financialDesc}>
                        {data?.financialsDescription}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                {/* table_two */}
                <div className={[classes.mainContainer]}>
                  <div className={[classes.headerContainer]}>
                    <h4>Listings of Interest</h4>
                    <div className={classes.searchListDiv}>
                      <SearchInput
                        placeholder="Search"
                        setter={setSearchListing}
                        value={searchListing}
                      />
                      <DropDown
                        options={[
                          { label: "All", value: "all" },
                          ...listingStatusOptions,
                        ]}
                        customeClassName={classes.filterDropDown}
                        placeholder={"Status"}
                        customStyle={{
                          minWidth: "150px",
                          paddingBlock: "0px",
                          color: "#000",
                        }}
                        value={status}
                        setter={(e) => {
                          setInterestedListingPage(1);
                          setStatus(e);
                          getInterestedListing(1, e?.value);
                        }}
                        optionLabel={"label"}
                        optionValue={"value"}
                      />
                    </div>
                  </div>

                  <div class="table100 ver1 m-b-110">
                    <div class="table100-head">
                      <table>
                        <thead>
                          <tr
                            class="row100 head"
                            style={{ marginLeft: "0px", marginRight: "0px" }}>
                            <th
                              class="cell100 column1"
                              style={{ width: "10%", textAlign: "start" }}>
                              S.No
                            </th>
                            <th
                              class="cell100 column1"
                              style={{ width: "20%", textAlign: "start" }}>
                              Buyer Name
                            </th>
                            <th
                              class="cell100 column2"
                              style={{ width: "15%", textAlign: "start" }}>
                              Email
                            </th>
                            <th
                              class="cell100 column3"
                              style={{ width: "15%", textAlign: "start" }}>
                              Phone
                            </th>
                            <th
                              class="cell100 column4"
                              style={{ width: "15%", textAlign: "start" }}>
                              Assigned Broker
                            </th>

                            <th
                              class="cell100 column5"
                              style={{ width: "10%", textAlign: "start" }}>
                              Status
                            </th>
                            <th
                              class="cell100 column6"
                              style={{ width: "15%", textAlign: "center" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                    <div class={`table100-body js-pscroll ps ps--active-y `}>
                      <table>
                        <tbody>
                          {isGettingInterestedListing ? (
                            <TableSkeleton rowsCount={5} colsCount={6} />
                          ) : interestedListing?.length == 0 ? (
                            <NoData text="No Listings Found" />
                          ) : (
                            interestedListing?.map((item, index) => (
                              <>
                                <tr
                                  class="row100 body"
                                  style={{
                                    marginLeft: "0px",
                                    marginRight: "0px",
                                    borderRadius: "18px",
                                  }}>
                                  <td
                                    class="cell100 column1"
                                    style={{
                                      width: "10%",
                                      textAlign: "start",
                                    }}>
                                    {index + 1}
                                  </td>
                                  <td
                                    class="cell100 column1"
                                    style={{
                                      width: "20%",
                                      textAlign: "start",
                                    }}>
                                    {`${item?.buyer?.firstName} ${item?.buyer?.lastName}`}
                                  </td>
                                  <td
                                    class="cell100 column2"
                                    style={{
                                      width: "15%",
                                      textAlign: "start",
                                    }}>
                                    <Link
                                      className={"ellipsis1Line emailLink"}
                                      title={item?.buyer?.email}
                                      to={"/email"}
                                      state={{ email: item?.buyer?.email }}>
                                      {item?.buyer?.email}
                                    </Link>
                                  </td>
                                  <td
                                    class="cell100 column4"
                                    style={{
                                      width: "15%",
                                      textAlign: "start",
                                    }}>
                                    {item?.buyer?.contact
                                      ? ReturnFormatedNumber(
                                          item?.buyer?.contact
                                        )
                                      : "—"}
                                  </td>
                                  <td
                                    class="cell100 column4"
                                    style={{
                                      width: "15%",
                                      textAlign: "start",
                                    }}>
                                    {item?.broker[0]?.firstName
                                      ? item?.broker[0]?.firstName +
                                        " " +
                                        item?.broker[0]?.lastName
                                      : "—"}
                                  </td>
                                  <td
                                    class="cell100 column4"
                                    style={{
                                      width: "10%",
                                      textAlign: "start",
                                    }}>
                                    <div
                                      className={`${classes.statusText} ${[
                                        item?.status == "nda-signed"
                                          ? classes.ndaSignedColor
                                          : item?.status == "under-negotiation"
                                          ? classes.underNegotiation
                                          : [
                                              "not-interested",
                                              "not-qualified",
                                            ]?.includes(item?.status)
                                          ? classes.notInterested
                                          : item?.status == "sold"
                                          ? classes.sold
                                          : item?.status == "nda-submitted"
                                          ? classes.ndaSubmit
                                          : item?.status == "under-contract"
                                          ? classes.underContract
                                          : item?.status == "inquired"
                                          ? classes.inquired
                                          : classes.closed,
                                        classes.colorDiv,
                                      ].join(" ")}`}>
                                      {item?.status}
                                    </div>
                                  </td>
                                  <td
                                    class="cell100 column4"
                                    style={{
                                      width: "15%",
                                      textAlign: "start",
                                    }}>
                                    <Button
                                      label={"View Details"}
                                      onClick={() =>
                                        navigate(`/view-interest/${item?._id}`)
                                      }
                                    />
                                  </td>
                                </tr>
                              </>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {interestedListing?.length > 0 && (
                    <div className={[classes.paginationDiv]}>
                      <PaginationComponent
                        totalPages={Math.ceil(
                          interestedListingTotalCount / recordsLimit
                        )}
                        currentPage={interestedListingPage}
                        setCurrentPage={setInterestedListingPage}
                      />
                    </div>
                  )}
                </div>
              </Row>
            </>
          )}
        </div>
        {isOpenModal && (
          <AddUserToVipListModal
            show={isOpenModal}
            setShow={setIsOpenModal}
            onClick={addUsersToVipList}
            data={vipUsers}
            isLoading={isAdding}
          />
        )}
      </SideBarSkeleton>
    </>
  );
};

export default ViewListing;
