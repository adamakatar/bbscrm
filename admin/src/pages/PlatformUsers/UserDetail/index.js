import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import Loader from "../../../Component/Loader";
import NoData from "../../../Component/NoData/NoData";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import {
  apiHeader,
  BaseURL,
  CreateFormData,
  imageUrl,
  mediaUrl,
  ReturnFormatedNumber,
  // recordsLimit,
} from "../../../config/apiUrl";
import classes from "./UserDetail.module.css";
import { toast } from "react-toastify";
import Switch from "../../../Component/Switch/Switch";
import PaginationComponent from "../../../Component/PaginationComponent";
import TableSkeleton from "../../../Component/TableSkeleton";
import AreYouSureModal from "../../../modals/AreYouSureModal";
import { DropDown } from "../../../Component/DropDown/DropDown";
import { VscFilePdf } from "react-icons/vsc";
import { FaFileDownload } from "react-icons/fa";
import { downloadFileFromUrl } from "../../../constant/downloadFile";
import { MdEdit, MdOutlineNoteAdd } from "react-icons/md";
import { Button } from "../../../Component/Button/Button";
import EditBrokerModal from "../../../modals/EditBrokerModal";
import AddOrEditNotesModal from "../../../modals/AddorEditNotesModal";

function TitleWithValue({ title = "", value = "" }) {
  return (
    <div className={classes.titleWithValue}>
      <h6>{title}</h6>
      <p>{value !== "" ? value : "Not Added Yet"}</p>
    </div>
  );
}
const recordsLimit = 5;
const UserDetail = () => {
  const navigate = useNavigate();
  const slug = useParams()?.slug;
  const token = useSelector((state) => state?.authReducer?.access_token);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  // nda type
  const [interestedNdaType, setInterestedNdaType] = useState(null);

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
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [activeUser, setActiveUser] = useState(false);
  const [subscribe, setSubcribe] = useState(false);
  const userDataApiUrl = BaseURL(`users/details/${slug}`);
  const ownedListingApiUrl = BaseURL(`users/owned-listings/${slug}`);
  const interestListingApiUrl = BaseURL(`users/interested-listings/${slug}`);
  // edit state
  const [isEditing, setIsEditing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  //selected
  const [selectedUser, setSelectedUser] = useState(null);
  // add interest notes
  const [notesInterestModal, setNotesInterestModal] = useState(false);
  const [notesInterestLoading, setNotesInterestLoading] = useState(false);
  //selected interest
  const [selectedInterest, setSelectedInterest] = useState(null);

  const getUserDetail = async () => {
    setLoading(true);
    const [userResponse, ownedBusinessResponse, interestedListing] =
      await Promise.all([
        Get(userDataApiUrl, token),
        Get(`${ownedListingApiUrl}?page=1&limit=${recordsLimit}`, token),
        Get(`${interestListingApiUrl}?page=1&limit=${recordsLimit}`, token),
      ]);
    if (userResponse !== undefined) {
      setActiveUser(userResponse?.data?.active == "active" ? false : true);
      setSubcribe(!userResponse?.data?.isCampaignAllowed);
      setUserData(userResponse?.data);
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
    setLoading(false);
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

  const HandleUserAccountStatusChange = async (e) => {
    const apiUrl = BaseURL(`users/active/${slug}`);
    const body = {
      active: !activeUser,
    };
    setActionLoading(true);
    const response = await Patch(apiUrl, body, apiHeader(token));
    setActionLoading(false);
    if (response !== undefined) {
      setActiveUser(response?.data?.data?.active == "active" ? false : true);
      setUserData(response?.data?.data);
      toast.success(
        `User ${activeUser == true ? "deactivated" : "activated"} Successfully`
      );
      setDeleteMessage(null);
    } else {
      setActiveUser(!activeUser);
    }
  };
  const HandleUserSubscription = async (e) => {
    const apiUrl = BaseURL(`users/admin/update-user`);
    const body = {
      userId: slug,
      isCampaignAllowed: !subscribe,
    };
    setActionLoading(true);

    const response = await Patch(apiUrl, body, apiHeader(token));
    setActionLoading(false);
    if (response !== undefined) {
      setUserData(response?.data);
      toast.success(
        `User email ${
          subscribe == true ? "unsubscribe" : "subscribe"
        } successfully`
      );
      setDeleteMessage(null);
    } else {
      setSubcribe(!subscribe);
    }
  };

  const ChangeUserStatus = (e) => {
    setActiveUser(e);
    setDeleteMessage({
      message: `Are You Sure you want to ${
        e == false ? "activate" : "dectivate"
      }  ${userData?.firstName} ${userData?.lastName} ?`,
      type: "active",
    });
    // HandleUserAccountStatusChange(!e);
  };
  const ChangeUserAccountType = (e) => {
    setSubcribe(e);
    setDeleteMessage({
      message: `Are You Sure you want to ${
        e == false ? "subscribe" : "unsubscribe"
      } ${userData?.firstName} ${userData?.lastName} email subscription ?`,
      type: "subscribe",
    });
    // HandleUserSubscription(!e);
  };
  // edit user
  async function handleEditUser(e) {
    const url = BaseURL("users/admin/update-user");
    const {designation} = e;
    const params = {
      userId: selectedUser?._id,
      role: designation,
      ...e,
    };
    const formDataParams = CreateFormData(params);

    setIsEditing(true);
    const response = await Patch(url, formDataParams, apiHeader(token));
    if (response !== undefined) {
      // const newData = [...user];
      // newData?.splice(
      //   newData?.findIndex((item) => item?._id == response?.data?._id),
      //   1,
      //   response?.data
      // );
      setUserData(response?.data);
      toast.success(`User updated successfully.`);
      setIsEditModalOpen(false);
    }
    setIsEditing(false);
  }

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
        padding-block: 10px;
      }
      .ant-switch.ant-switch-checked{
        background: var(--dashboard-main-color);
      }
      `}</style>
      <SideBarSkeleton>
        <div className={classes.main_container}>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Row>
                <div className={classes.mainHeading_row}>
                  <h4>User Details</h4>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div className={classes.toggleBtnMain}>
                      <p>Deactivate</p>
                      <Switch value={activeUser} setter={ChangeUserStatus} />
                    </div>
                    <div className={classes.toggleBtnMain}>
                      <p>Unsubscribe</p>
                      <Switch
                        value={subscribe}
                        setter={ChangeUserAccountType}
                      />
                    </div>
                  </div>
                </div>
              </Row>
              <Row className={`${classes.content_main} gy-2`}>
                <Col lg={4} xxl={3} md={5}>
                  <div className={classes.userDetail_sideBar}>
                    <div className={classes.top}>
                      <div className={classes.editProfileDiv}>
                        <h4>{`${userData?.firstName} ${userData?.lastName}`}</h4>
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
                            setSelectedUser(userData);
                            setIsEditModalOpen(true);
                          }}
                        />
                      </div>
                      <p>{userData?.designation}</p>
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
                          title="TelePhone"
                          value={ReturnFormatedNumber(userData?.mobilePhone)}
                        />
                      </Col>
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Email"
                          value={`${userData?.email}`}
                        />
                      </Col>
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Notes"
                          value={userData?.description}
                        />
                      </Col>

                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Home Phone"
                          value={ReturnFormatedNumber(userData?.homePhone)}
                        />
                      </Col>
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Address"
                          value={userData?.city}
                        />
                      </Col>
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4} />
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Work Phone"
                          value={ReturnFormatedNumber(userData?.workPhone)}
                        />
                      </Col>

                      <Col sm={6} md={6} lg={6} xl={4} xxl={3}>
                        <TitleWithValue
                          title="Account Status"
                          value={`${userData?.active}`}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
                {/* table one */}
                <Col md={12}>
                  <div
                    className={[
                      classes.mainContainer,
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
                                style={{ width: "10%", textAlign: "start" }}
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
                                style={{ width: "15%", textAlign: "center" }}
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
                        <TableSkeleton rowsCount={recordsLimit} colsCount={7} />
                      ) : (
                        <div class="table100-body js-pscroll ps ps--active-y">
                          <table>
                            <tbody>
                              {userInterestedListing?.length > 0 ? (
                                userInterestedListing?.map((item, index) => (
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
                                        width: "15%",
                                        textAlign: "start",
                                      }}
                                    >
                                      {item?.listingID?.companyName}
                                    </td>

                                    <td
                                      class="cell100 column4"
                                      style={{
                                        width: "10%",
                                        textAlign: "start",
                                      }}
                                    >
                                      <div className={classes?.btnContainer}>
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
                                        `${item?.broker?.length - 1} more`}
                                    </td>
                                    <td
                                      class="cell100 column4"
                                      style={{
                                        width: "10%",
                                        textAlign: "start",
                                      }}
                                    >
                                      ${item?.listingID?.cashFlow}
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
                                            : item?.status == "nda-submitted"
                                            ? classes.ndaSubmit
                                            : item?.status == "under-contract"
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
                                        width: "15%",
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
                                              item?.listingID?.owner?.lastName,
                                            seller_desgination:
                                              item?.listingID?.owner
                                                ?.designation,
                                            seller_phone:
                                              item?.listingID?.owner?.contact,
                                            seller_email:
                                              item?.listingID?.owner?.email,
                                            business_title:
                                              item?.listingID?.companyName,
                                            listingCategory:
                                              item?.listingID?.category?.name,
                                            business_address:
                                              item?.listingID?.businessAddress,
                                            buyer_name:
                                              item?.buyer?.firstName +
                                              " " +
                                              item?.buyer?.lastName,
                                            buyer_phone: item?.buyer?.contact,
                                            buyer_email: item?.buyer?.email,
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
                                        optionValue={"standard"}
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
                                          color={"var(--dashboard-main-color)"}
                                          className={classes.pdfDownloadIcon}
                                        />
                                      ) : (
                                        <span>----</span>
                                      )}
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
                {/* table two */}
                <Col md={12}>
                  <div
                    className={[
                      classes.mainContainer,
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
                                style={{ width: "15%", textAlign: "center" }}
                              >
                                Status
                              </th>
                              <th
                                class="cell100 column5"
                                style={{ width: "10%", textAlign: "center" }}
                              >
                                Listing Agreement
                              </th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                      {userOwnedListingLaoding ? (
                        <TableSkeleton rowsCount={recordsLimit} colsCount={7} />
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
                                      <p
                                        className={
                                          classes.interestedListingTitle
                                        }
                                        title={item?.title}
                                      >
                                        {item?.title}
                                      </p>
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
                                            : item?.status == "nda-submitted"
                                            ? classes.ndaSubmit
                                            : item?.status == "under-contract"
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
                                      <div className={classes?.btnContainer}>
                                        <VscFilePdf
                                          color={"var(--white-color)"}
                                          size={25}
                                          onClick={() => {
                                            const data = {
                                              templatePDF: item?.ownerTemplate,
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
                                              seller_email: item?.owner?.email,
                                              listingTitle: item?.companyName,
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
                            totalPages={Math.ceil(userOwnedListingTotalCount)}
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
              </Row>
            </>
          )}
        </div>
        <AreYouSureModal
          show={deleteMessage == null ? false : true}
          setShow={() => {
            deleteMessage?.type == "subscribe"
              ? setSubcribe(!subscribe)
              : setActiveUser(!activeUser);
            setDeleteMessage(null);
          }}
          subTitle={deleteMessage?.message}
          onClick={
            deleteMessage?.type == "subscribe"
              ? HandleUserSubscription
              : HandleUserAccountStatusChange
          }
          isApiCall={actionLoading}
        />

        {isEditModalOpen && (
          <EditBrokerModal
            handleSubmit={handleEditUser}
            show={isEditModalOpen}
            setShow={setIsEditModalOpen}
            isLoading={isEditing}
            data={selectedUser}
            userType={"buyer-seller"}
            heading={"Edit User"}
          />
        )}

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
      </SideBarSkeleton>
    </>
  );
};

export default UserDetail;
