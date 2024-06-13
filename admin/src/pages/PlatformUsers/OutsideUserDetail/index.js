import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { FaFileDownload } from "react-icons/fa";
import { VscFilePdf } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import { DropDown } from "../../../Component/DropDown/DropDown";
import Loader from "../../../Component/Loader";
import NoData from "../../../Component/NoData/NoData";
import PaginationComponent from "../../../Component/PaginationComponent";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import Switch from "../../../Component/Switch/Switch";
import TableSkeleton from "../../../Component/TableSkeleton";
import {
  apiHeader,
  BaseURL,
  CreateFormData,
  imageUrl,
  mediaUrl,
  recordsLimit,
  ReturnFormatedNumber,
} from "../../../config/apiUrl";
import { downloadFileFromUrl } from "../../../constant/downloadFile";
import classes from "./OutsideUserDetail.module.css";
import EditBrokerModal from "../../../modals/EditBrokerModal";
import AddOrEditNotesModal from "../../../modals/AddorEditNotesModal";
import { MdEdit, MdOutlineNoteAdd } from "react-icons/md";
import { Button } from "../../../Component/Button/Button";

function TitleWithValue({ title = "", value = "" }) {
  return (
    <div className={classes.titleWithValue}>
      <h6>{title}</h6>
      <p>{value !== "" ? value : "Not Added Yet"}</p>
    </div>
  );
}
const OutsideUserDetail = ({ title }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const filteredPath = pathname?.split("/")[1];

  const token = useSelector((state) => state?.authReducer?.access_token);
  const slug = useParams()?.slug;
  const [brokerData, setBrokerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeUser, setActiveUser] = useState(false);

  // nda type
  const [interestedNdaType, setInterestedNdaType] = useState(null);
  // for edit outside user
  const [outsideUserData, setOutsideUserData] = useState(null);
  const [editOutsideUserModal, setEditOutsideUserModal] = useState(false);
  const [editOutsideUserLoading, setEditOutsideUserLoading] = useState(false);

  const [userOwnedListing, setUserOwnedListing] = useState([]);
  const [userOwnedListingCurrentPage, setUserOwnedListingCurrentPage] =
    useState(1);
  const [userOwnedListingTotalCount, setUserOwnedListingTotalCount] =
    useState(1);
  const [userOwnedListingLaoding, setUserOwnedListingLaoding] = useState(false);

  const [userInterestedListing, setUserInterestedListing] = useState([]);
  const [
    userInterestedListingCurrentPage,
    setUserInterestedListingCurrentPage,
  ] = useState(1);
  const [userInterestedListingTotalCount, setUserInterestedListingTotalCount] =
    useState(1);
  const [userInterestedListingLaoding, setUserInterestedListingLaoding] =
    useState(false);
  // add interest notes
  const [notesInterestModal, setNotesInterestModal] = useState(false);
  const [notesInterestLoading, setNotesInterestLoading] = useState(false);
  //selected interest
  const [selectedInterest, setSelectedInterest] = useState(null);

  const ownedListingApiUrl = BaseURL(`users/owned-listings/${slug}`);
  const interestListingApiUrl = BaseURL(`users/interested-listings/${slug}`);

  const getUserDetail = async () => {
    setIsLoading(true);
    const [userResponse, ownedBusinessResponse, interestedListing] =
      await Promise.all([
        Get(BaseURL(`users/details/${slug}`), token),
        Get(`${ownedListingApiUrl}?page=1&limit=${recordsLimit}`, token),
        Get(`${interestListingApiUrl}?page=1&limit=${recordsLimit}`, token),
      ]);
    if (userResponse !== undefined) {
      setActiveUser(userResponse?.data?.active == "active" ? false : true);
      setBrokerData(userResponse?.data);
    }
    if (ownedBusinessResponse !== undefined) {
      setUserOwnedListing(ownedBusinessResponse?.data?.ownedBusiness);
      setUserOwnedListingTotalCount(
        ownedBusinessResponse?.data?.totalCount / recordsLimit
      );
    }
    if (interestedListing !== undefined) {
      setUserInterestedListing(interestedListing?.data?.leads);
      setUserInterestedListingTotalCount(
        interestedListing?.data?.totalCount / recordsLimit
      );
    }
    setIsLoading(false);
  };

  const getUserOwnedListing = async (pageNo) => {
    setUserOwnedListingLaoding(true);
    const response = await Get(
      `${ownedListingApiUrl}?page=${pageNo}&limit=${recordsLimit}`,
      token
    );
    if (response !== undefined) {
      setUserOwnedListing(response?.data?.ownedBusiness);
      setUserOwnedListingTotalCount(response?.data?.totalCount / recordsLimit);
    }
    setUserOwnedListingLaoding(false);
  };

  const getUserInterestedListing = async (pageNo) => {
    setUserInterestedListingLaoding(true);
    const response = await Get(
      `${interestListingApiUrl}?page=${pageNo}&limit=${recordsLimit}`,
      token
    );
    if (response !== undefined) {
      setUserInterestedListing(response?.data?.leads);
      setUserInterestedListingTotalCount(
        response?.data?.totalCount / recordsLimit
      );
    }
    setUserInterestedListingLaoding(false);
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  const toggler = async (e) => {
    const apiUrl = BaseURL(`users/active/${slug}`);
    const body = {
      active: e,
    };
    const response = await Patch(apiUrl, body, apiHeader(token));
    if (response !== undefined) {
      setActiveUser(response?.data?.data?.active == "active" ? false : true);
      setBrokerData(response?.data?.data);
      toast.success(
        `User ${e == true ? "Activated" : "Deactivated"} Successfully`
      );
    }
  };

  const ChangeUserStatus = (e) => {
    setActiveUser(e);
    toggler(!e);
  };
  // handle edit
  const handleEditOutsideUser = async (e) => {
    const url = BaseURL("users/admin/update-user");
    const params = {
      userId: outsideUserData?._id,
      ...e,
    };
    const formDataParams = CreateFormData(params);

    setEditOutsideUserLoading(true);
    const response = await Patch(url, formDataParams, apiHeader(token));
    if (response !== undefined) {
      setBrokerData(response?.data);
      toast.success(
        filteredPath == "admin-user-detail"
          ? "Admin User edited successfully."
          : `Outside User edited successfully.`
      );
      setEditOutsideUserModal(false);
    }
    setEditOutsideUserLoading(false);
  };

  // add interest notes
  async function handleInterestNotes(body) {
    const url = BaseURL("leads/notes");
    setNotesInterestLoading(true);
    const response = await Patch(
      url,
      { leadId: selectedInterest?._id, notes: body },
      apiHeader(token)
    );
    if (response !== undefined) {
      const index = userInterestedListing?.findIndex(
        (item) => item?._id == selectedInterest?._id
      );
      const newData = [...userInterestedListing];
      newData?.splice(index, 1, response?.data);
      setUserInterestedListing(newData);
      toast.success("Notes added successfully");
      setNotesInterestModal(false);
    }
    setNotesInterestLoading(false);
  }

  return (
    <>
      <style>{`
      .table100-body{
      height:400px;
      }
      .table100-body table{
      height:100%;
      }
      .table100-body td {
        padding-block: 18px;
      }
      .ant-switch.ant-switch-checked{
        background: var(--dashboard-main-color);
      }
      `}</style>
      <SideBarSkeleton>
        <div className={classes.mainContainer}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <Row>
                <div className={classes.mainHeading_row}>
                  <h4>{title ? title : `Outside User Details`}</h4>
                  <div className={classes.toggleBtnMain}>
                    <p>Inactive</p>
                    <Switch value={activeUser} setter={ChangeUserStatus} />
                  </div>
                </div>
              </Row>
              <Row className={`${classes.content_main} gy-2`}>
                <Col lg={4} xxl={3} md={5}>
                  <div className={classes.userDetail_sideBar}>
                    <div className={classes.top}>
                      {title == "Admin User Detail" && (
                        <div className={classes.img_main}>
                          <img
                            src={imageUrl(brokerData?.photo)}
                            alt="profile"
                          />
                        </div>
                      )}
                      <div className={classes.editProfileDiv}>
                        <h4>{`${brokerData?.firstName} ${brokerData?.lastName}`}</h4>
                        <Button
                          title={"Edit"}
                          label={
                            <MdEdit
                              color={"var(--dashboard-main-color)"}
                              size={20}
                            />
                          }
                          className={classes.editProfileBtn}
                          onClick={() => {
                            setOutsideUserData(brokerData);
                            setEditOutsideUserModal(true);
                          }}
                        />
                      </div>
                      <p>{brokerData?.designation}</p>
                    </div>
                  </div>
                </Col>
                <Col lg={8} xxl={9} md={7}>
                  <div
                    className={[classes.boxWithShadow, classes.detailsBox].join(
                      " "
                    )}
                  >
                    <Row>
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Telephone"
                          value={ReturnFormatedNumber(brokerData?.contact)}
                        />
                      </Col>
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Desk Phone"
                          value={`${ReturnFormatedNumber(
                            brokerData?.deskContact
                          )}`}
                        />
                      </Col>
                      {title !== "Admin User Detail" ? (
                        <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                          <TitleWithValue
                            title="Address"
                            value={`${brokerData?.city}`}
                          />
                        </Col>
                      ) : (
                        <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                          <TitleWithValue
                            title="Description"
                            value={`${brokerData?.description}`}
                          />
                        </Col>
                      )}
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Office Contact"
                          value={`${ReturnFormatedNumber(
                            brokerData?.officeContact
                          )}`}
                        />
                      </Col>
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Email"
                          value={`${brokerData?.email}`}
                        />
                      </Col>
                      {title !== "Admin User Detail" ? (
                        <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                          <TitleWithValue
                            title="Description"
                            value={`${brokerData?.description}`}
                          />
                        </Col>
                      ) : (
                        <Col sm={6} md={6} lg={6} xl={4} xxl={4} />
                      )}
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Cell Phone"
                          value={ReturnFormatedNumber(brokerData?.cell)}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
                {title !== "Admin User Detail" && (
                  <>
                    {/* table one */}
                    <Col md={12}>
                      <div
                        className={[
                          classes.tableContainer,
                          classes.mt20,
                          classes.boxWithShadow,
                        ].join(" ")}
                      >
                        <div className={[classes.headerContainer]}>
                          <h3>Listings of Interest</h3>
                          <div className={[classes.inputDiv]}></div>
                        </div>

                        <div class="table100 ver1 m-b-110">
                          <div class="table100-head">
                            <table>
                              <thead>
                                <tr class="row100 head">
                                  <th
                                    class="cell100 column1"
                                    style={{ width: "20%", textAlign: "start" }}
                                  >
                                    Name
                                  </th>
                                  <th
                                    class="cell100 column2"
                                    style={{ width: "15%", textAlign: "start" }}
                                  >
                                    Company
                                  </th>
                                  <th
                                    class="cell100 column3"
                                    style={{ width: "15%", textAlign: "start" }}
                                  >
                                    Notes
                                  </th>
                                  <th
                                    class="cell100 column4"
                                    style={{ width: "15%", textAlign: "start" }}
                                  >
                                    Broker
                                  </th>
                                  <th
                                    class="cell100 column5"
                                    style={{ width: "10%", textAlign: "start" }}
                                  >
                                    Cash Flow
                                  </th>

                                  <th
                                    class="cell100 column5"
                                    style={{ width: "10%", textAlign: "start" }}
                                  >
                                    Status
                                  </th>
                                  <th
                                    class="cell100 column5"
                                    style={{
                                      width: "15%",
                                      textAlign: "center",
                                    }}
                                  >
                                    APA
                                  </th>
                                  <th
                                    class="cell100 column5"
                                    style={{ width: "5%", textAlign: "center" }}
                                  >
                                    NDA
                                  </th>
                                </tr>
                              </thead>
                            </table>
                          </div>
                          {userInterestedListingLaoding ? (
                            <TableSkeleton
                              rowsCount={recordsLimit}
                              colsCount={7}
                            />
                          ) : (
                            <div class="table100-body js-pscroll ps ps--active-y">
                              <table>
                                <tbody>
                                  {userInterestedListing?.length > 0 ? (
                                    userInterestedListing?.map(
                                      (item, index) => (
                                        <tr class="row100 body">
                                          <td
                                            class="cell100 column1"
                                            style={{
                                              width: "20%",
                                              textAlign: "start",
                                            }}
                                          >
                                            <p
                                              className={
                                                classes.interestedListingTitle
                                              }
                                              title={item?.listingID?.title}
                                            >
                                              {item?.listingID?.title}
                                            </p>
                                          </td>
                                          <td
                                            class="cell100 column2"
                                            style={{
                                              width: "10%",
                                              textAlign: "start",
                                            }}
                                          >
                                            {item?.listingID?.companyName}
                                          </td>
                                          <td
                                            class="cell100 column4"
                                            style={{
                                              width: "15%",
                                              textAlign: "start",
                                            }}
                                          >
                                            <div
                                              className={classes?.btnContainer}
                                            >
                                              <MdOutlineNoteAdd
                                                size={20}
                                                color={"#fff"}
                                                onClick={() => {
                                                  setSelectedInterest(item);
                                                  setNotesInterestModal(true);
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td
                                            class="cell100 column4"
                                            style={{
                                              width: "15%",
                                              textAlign: "start",
                                            }}
                                          >
                                            {item?.broker?.length > 0 &&
                                              `${item?.broker[0]?.firstName} ${item?.broker[0]?.lastName} `}
                                            {item?.broker?.length > 1 &&
                                              `${
                                                item?.broker?.length - 1
                                              } more`}
                                          </td>
                                          <td
                                            class="cell100 column4"
                                            style={{
                                              width: "10%",
                                              textAlign: "start",
                                            }}
                                          >
                                            {item?.listingID?.cashFlow}
                                          </td>

                                          <td
                                            class="cell100 column4"
                                            style={{
                                              width: "10%",
                                              textAlign: "start",
                                            }}
                                          >
                                            <div
                                              className={[
                                                item?.status == "nda-signed"
                                                  ? classes.ndaSignedColor
                                                  : item?.status ==
                                                    "under-negotiation"
                                                  ? classes.underNegotiation
                                                  : [
                                                      "not-interested",
                                                      "not-qualified",
                                                    ]?.includes(item?.status)
                                                  ? classes.notInterested
                                                  : item?.status == "sold"
                                                  ? classes.sold
                                                  : item?.status ==
                                                    "nda-submitted"
                                                  ? classes.ndaSubmit
                                                  : item?.status ==
                                                    "under-contract"
                                                  ? classes.underContract
                                                  : item?.status == "inquired"
                                                  ? classes.inquired
                                                  : classes.closed,
                                                classes.colorDiv,
                                              ].join(" ")}
                                            >
                                              {item?.status}
                                            </div>
                                          </td>
                                          <td
                                            class="cell100 column4"
                                            style={{
                                              width: "20%",
                                              textAlign: "start",
                                            }}
                                          >
                                            <DropDown
                                              placeholder={"Select APA"}
                                              value={interestedNdaType}
                                              setter={(e) => {
                                                setInterestedNdaType(e);
                                                const data = {
                                                  templatePDF: item?.template,
                                                  leadId: item?._id,
                                                  boker_name:
                                                    item?.broker[0]?.firstName +
                                                    " " +
                                                    item?.broker[0]?.lastName,
                                                  boker_phone:
                                                    item?.broker[0]?.contact,
                                                  broker_email:
                                                    item?.broker[0]?.email,
                                                  seller_name:
                                                    item?.listingID?.owner
                                                      ?.firstName +
                                                    " " +
                                                    item?.listingID?.owner
                                                      ?.lastName,
                                                  seller_desgination:
                                                    item?.listingID?.owner
                                                      ?.designation,
                                                  seller_phone:
                                                    item?.listingID?.owner
                                                      ?.contact,
                                                  seller_email:
                                                    item?.listingID?.owner
                                                      ?.email,
                                                  business_title:
                                                    item?.listingID
                                                      ?.companyName,
                                                  listingCategory:
                                                    item?.listingID?.category
                                                      ?.name,
                                                  business_address:
                                                    item?.listingID
                                                      ?.businessAddress,
                                                  buyer_name:
                                                    item?.buyer?.firstName +
                                                    " " +
                                                    item?.buyer?.lastName,
                                                  buyer_phone:
                                                    item?.buyer?.contact,
                                                  buyer_email:
                                                    item?.buyer?.email,
                                                };
                                                navigate(
                                                  e?.value == "liquor"
                                                    ? `/agreement-templates/liquorAPA`
                                                    : `/agreement-templates/standardAPA`,
                                                  {
                                                    state: data,
                                                  }
                                                );
                                              }}
                                              options={[
                                                {
                                                  label: "liquor",
                                                  value: "liquor",
                                                },
                                                {
                                                  label: "standard",
                                                  value: "standard",
                                                },
                                              ]}
                                              optionLabel={"label"}
                                              optionValue={"value"}
                                            />
                                          </td>

                                          <td
                                            class="cell100 column4"
                                            style={{
                                              width: "5%",
                                              textAlign: "center",
                                            }}
                                          >
                                            {item?.ndaTemplate ? (
                                              <FaFileDownload
                                                onClick={() => {
                                                  downloadFileFromUrl(
                                                    mediaUrl(item?.ndaTemplate),
                                                    `${item?.buyer?.firstName} ${item?.buyer?.lastName}-${item?.listingID?.title}-NDA.pdf`
                                                  );
                                                }}
                                                size={24}
                                                color={
                                                  "var(--dashboard-main-color)"
                                                }
                                                className={
                                                  classes.pdfDownloadIcon
                                                }
                                              />
                                            ) : (
                                              <span>----</span>
                                            )}
                                          </td>
                                        </tr>
                                      )
                                    )
                                  ) : (
                                    <NoData text="No Listing Added Yet" />
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                        {userInterestedListing?.length > 0 && (
                          <div className={[classes.paginationDiv]}>
                            <PaginationComponent
                              totalPages={Math.ceil(
                                userInterestedListingTotalCount
                              )}
                              currentPage={userInterestedListingCurrentPage}
                              setCurrentPage={(e) => {
                                setUserInterestedListingCurrentPage(e);
                                getUserInterestedListing(e);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </Col>
                    {/* table_two */}

                    <Col md={12}>
                      <div
                        className={[
                          classes.tableContainer,
                          classes.mt20,
                          classes.boxWithShadow,
                        ].join(" ")}
                      >
                        <div className={[classes.headerContainer]}>
                          <h3>Listing Owned</h3>
                          <div className={[classes.inputDiv]}></div>
                        </div>

                        <div class="table100 ver1 m-b-110">
                          <div class="table100-head">
                            <table>
                              <thead>
                                <tr class="row100 head">
                                  <th
                                    class="cell100 column1"
                                    style={{ width: "20%", textAlign: "start" }}
                                  >
                                    Name
                                  </th>

                                  <th
                                    class="cell100 column5"
                                    style={{ width: "15%", textAlign: "start" }}
                                  >
                                    Company
                                  </th>

                                  <th
                                    class="cell100 column3"
                                    style={{ width: "15%", textAlign: "start" }}
                                  >
                                    Seller
                                  </th>
                                  <th
                                    class="cell100 column4"
                                    style={{ width: "15%", textAlign: "start" }}
                                  >
                                    Broker
                                  </th>
                                  <th
                                    class="cell100 column5"
                                    style={{ width: "10%", textAlign: "start" }}
                                  >
                                    Cash Flow
                                  </th>

                                  <th
                                    class="cell100 column5"
                                    style={{
                                      width: "15%",
                                      textAlign: "center",
                                    }}
                                  >
                                    Status
                                  </th>
                                  <th
                                    class="cell100 column5"
                                    style={{
                                      width: "10%",
                                      textAlign: "center",
                                    }}
                                  >
                                    Listing Agreement
                                  </th>
                                </tr>
                              </thead>
                            </table>
                          </div>
                          {userOwnedListingLaoding ? (
                            <TableSkeleton
                              rowsCount={recordsLimit}
                              colsCount={7}
                            />
                          ) : (
                            <div class="table100-body js-pscroll ps ps--active-y">
                              <table>
                                <tbody>
                                  {userOwnedListing?.length > 0 ? (
                                    userOwnedListing?.map((item, index) => (
                                      <tr class="row100 body">
                                        <td
                                          class="cell100 column1"
                                          style={{
                                            width: "20%",
                                            textAlign: "start",
                                          }}
                                        >
                                          {item?.title}
                                        </td>
                                        <td
                                          class="cell100 column2"
                                          style={{
                                            width: "15%",
                                            textAlign: "start",
                                          }}
                                        >
                                          {item?.companyName}
                                        </td>

                                        <td
                                          class="cell100 column4"
                                          style={{
                                            width: "15%",
                                            textAlign: "start",
                                          }}
                                        >
                                          {`${item?.owner?.firstName} ${item?.owner?.lastName}`}
                                        </td>
                                        <td
                                          class="cell100 column4"
                                          style={{
                                            width: "15%",
                                            textAlign: "start",
                                          }}
                                        >
                                          {item?.broker?.length > 0 &&
                                            `${item?.broker[0]?.firstName} ${item?.broker[0]?.lastName} `}
                                          {item?.broker?.length > 1 &&
                                            `${item?.broker?.length - 1} more`}
                                        </td>

                                        <td
                                          class="cell100 column4"
                                          style={{
                                            width: "10%",
                                            textAlign: "start",
                                          }}
                                        >
                                          ${item?.cashFlow}
                                        </td>

                                        <td
                                          class="cell100 column4"
                                          style={{
                                            width: "15%",
                                            textAlign: "center",
                                          }}
                                        >
                                          <div
                                            className={[
                                              item?.status == "nda-signed"
                                                ? classes.ndaSignedColor
                                                : item?.status ==
                                                  "under-negotiation"
                                                ? classes.underNegotiation
                                                : [
                                                    "not-interested",
                                                    "not-qualified",
                                                  ]?.includes(item?.status)
                                                ? classes.notInterested
                                                : item?.status == "sold"
                                                ? classes.sold
                                                : item?.status ==
                                                  "nda-submitted"
                                                ? classes.ndaSubmit
                                                : item?.status ==
                                                  "under-contract"
                                                ? classes.underContract
                                                : item?.status == "inquired"
                                                ? classes.inquired
                                                : classes.closed,
                                              classes.colorDiv,
                                            ].join(" ")}
                                          >
                                            {item?.status}
                                          </div>
                                        </td>
                                        <td
                                          class="cell100 column4"
                                          style={{
                                            width: "10%",
                                            textAlign: "start",
                                          }}
                                        >
                                          <div
                                            className={classes?.btnContainer}
                                          >
                                            <VscFilePdf
                                              color={"var(--white-color)"}
                                              size={25}
                                              onClick={() => {
                                                const data = {
                                                  templatePDF:
                                                    item?.ownerTemplate,
                                                  businessId: item?._id,
                                                  broker_name:
                                                    item?.broker[0]?.firstName +
                                                    " " +
                                                    item?.broker[0]?.lastName,
                                                  broker_phone:
                                                    item?.broker[0]?.contact,
                                                  broker_email:
                                                    item?.broker[0]?.email,
                                                  seller_title:
                                                    item?.owner?.firstName +
                                                    " " +
                                                    item?.owner?.lastName,
                                                  seller_phone:
                                                    item?.owner?.contact,
                                                  seller_email:
                                                    item?.owner?.email,
                                                  listingTitle:
                                                    item?.companyName,
                                                  business_address:
                                                    item?.googleMapAddress,
                                                  askng_business_price:
                                                    item?.businessOpportunity,
                                                  asking_plus_inventory_price:
                                                    item?.inventory,
                                                };
                                                navigate(
                                                  `/agreement-templates/listingAPA`,
                                                  {
                                                    state: data,
                                                  }
                                                );
                                              }}
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <NoData text="No Listing Added Yet" />
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                          {userOwnedListing?.length > 0 && (
                            <div className={[classes.paginationDiv]}>
                              <PaginationComponent
                                totalPages={Math.ceil(
                                  userOwnedListingTotalCount
                                )}
                                currentPage={userOwnedListingCurrentPage}
                                setCurrentPage={(e) => {
                                  setUserOwnedListingCurrentPage(e);
                                  getUserOwnedListing(e);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>
                  </>
                )}
              </Row>
            </>
          )}
        </div>
        {editOutsideUserModal && (
          <EditBrokerModal
            handleSubmit={handleEditOutsideUser}
            show={editOutsideUserModal}
            setShow={setEditOutsideUserModal}
            isLoading={editOutsideUserLoading}
            data={outsideUserData}
            userType={"outside-user"}
            heading={
              filteredPath == "admin-user-detail"
                ? "Edit Admin User"
                : "Edit OutSide User"
            }
          />
        )}
      </SideBarSkeleton>

      {/* interest notes */}

      {notesInterestModal && (
        <AddOrEditNotesModal
          setShow={setNotesInterestModal}
          show={notesInterestModal}
          selectedUser={selectedInterest}
          loading={notesInterestLoading}
          onClick={handleInterestNotes}
        />
      )}
    </>
  );
};

export default OutsideUserDetail;
