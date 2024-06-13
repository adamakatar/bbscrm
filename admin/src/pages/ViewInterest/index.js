import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { FaFileDownload } from "react-icons/fa";
import { VscFilePdf } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineNoteAdd } from "react-icons/md";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import Loader from "../../Component/Loader";
import NoData from "../../Component/NoData/NoData";
import PaginationComponent from "../../Component/PaginationComponent";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import TableSkeleton from "../../Component/TableSkeleton";
import {
  apiHeader,
  BaseURL,
  imageUrl,
  mediaUrl,
  ReturnFormatedNumber,
} from "../../config/apiUrl";
import { downloadFileFromUrl } from "../../constant/downloadFile";
import AddOrUpdateOfferMemorandomModal from "../../modals/AddOrUpdateOfferMemorandomModal";
import AreYouSureModal from "../../modals/AreYouSureModal";
import UpdateNDAStatus from "../../modals/UpdateNDAStatus";
import classes from "./ViewInterest.module.css";
import AddOrEditNotesModal from "../../modals/AddorEditNotesModal";


function TitleWithValue({ title = "", value = "" }) {

  return (
    <div className={classes.titleWithValue}>
      <h6>{title}</h6>
      <p>{value ? value : "Not Added Yet"}</p>
    </div>
  );
}

const ViewInterest = () => {
  const recordsLimit = 5;
  const navigate = useNavigate();
  const id = useParams()?.id;
  const token = useSelector((state) => state?.authReducer?.access_token);
  const user = useSelector((state) => state?.authReducer?.user);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState("");

  // nda type
  const [interestedNdaType, setInterestedNdaType] = useState(null);

  // Listing States
  const [isGettingOwnedListing, setIsGettingOwnedListing] = useState(false);
  const [ownedListing, setOwnedListing] = useState([]);
  const [ownedListingTotalCount, setOwnedListingTotalCount] = useState(0);
  const [ownedListingPage, setOwnedListingPage] = useState(1);

  const [isGettingInterestedListing, setIsGettingInterestedListing] =
    useState(false);
  const [interestedListing, setInterestedListing] = useState([]);
  const [interestedListingTotalCount, setInterestedListingTotalCount] =
    useState(0);
  const [interestedListingPage, setInterestedListingPage] = useState(1);

  // Modal Open and Api Loading
  const [isOpenModal, setIsOpenModal] = useState("");
  const [isModalLoading, setIsModalLoading] = useState("");

  // access data room modal
  const [accessRoomModal, setAccessRoomModal] = useState(false);
  const [accessRoomLoader, setAccessRoomLoader] = useState(false);
  const [isAssignDataRoom, setIsAssignDataRoom] = useState("");

  // add interest notes
  const [notesInterestModal, setNotesInterestModal] = useState(false);
  const [notesInterestLoading, setNotesInterestLoading] = useState(false);
  //selected interest
  const [selectedInterest, setSelectedInterest] = useState(null);

  // Get API
  const getInterestDetail = async () => {
    const apiUrl = BaseURL(`leads/admin/details/${id}`);
    setIsLoading(true);
    const response = await Get(apiUrl, token);
    if (response !== undefined) {
      setData(response?.data);
      // setUserData(response?.data?.lead?.buyer?.nda);
      setUserData(response?.data?.lead?.nda);
      const temp =
        response?.data?.lead?.listingID?.buyerAssignedToDataRoom.includes(
          response?.data?.lead?.buyer?._id
        );
      setIsAssignDataRoom(temp);
    }
    setIsLoading(false);
  };

  // Accept or Reject NDA
  const acceptReject = async (val, type) => {
    const apiUrl = BaseURL(`leads/update-nda-status`);
    const body = {
      leadId: id,
      status: val,
    };
    setIsSubmitting(
      type !== undefined ? (type ? "accept" : "reject") : "update-status"
    );
    const response = await Patch(apiUrl, body, apiHeader(token));
    if (response !== undefined) {
      await getInterestDetail();
      setIsSubmitting("");
    } else {
      setIsSubmitting("");
    }
  };

  // Update Lead Status
  const updateLeadStatus = async (val, text) => {
    const apiUrl = BaseURL(`leads/update-lead-status`);
    const body = {
      leadId: id,
      status: val,
      ...(text && { memorandum: text }),
    };
    setIsSubmitting("update-status");
    const response = await Patch(apiUrl, body, apiHeader(token));
    if (response !== undefined) {
      !text && toast.success("Lead status updated successfully");
      await getInterestDetail();
    }
    setIsSubmitting("");
    setIsOpenModal(false);
  };

  // Listing GET API

  const getUserOwnedListing = async (pageNo) => {
    setIsGettingOwnedListing(true);
    const url = BaseURL(
      `users/owned-listings/${data?.lead?.buyer?._id}?page=${pageNo}&limit=${recordsLimit}`
    );
    const response = await Get(url, token);
    if (response !== undefined) {
      setOwnedListing(response?.data?.ownedBusiness);
      setOwnedListingTotalCount(response?.data?.totalCount);
    }
    setIsGettingOwnedListing(false);
  };

  const getUserInterestedListing = async (pageNo) => {
    const url = BaseURL(
      `users/interested-listings/${data?.lead?.buyer?._id}?page=${pageNo}&limit=${recordsLimit}`
    );
    setIsGettingInterestedListing(true);
    const response = await Get(url, token);
    if (response !== undefined) {
      setInterestedListing(response?.data?.leads);
      setInterestedListingTotalCount(response?.data?.totalCount);
    }
    setIsGettingInterestedListing(false);
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
      const index = interestedListing?.findIndex(
        (item) => item?._id == selectedInterest?._id
      );
      const newData = [...interestedListing];
      newData?.splice(index, 1, response?.data);
      setInterestedListing(newData);
      toast.success("Notes added successfully");
      setNotesInterestModal(false);
    }
    setNotesInterestLoading(false);
  }

  useEffect(() => {
    getInterestDetail();
  }, []);

  useEffect(() => {
    if (data !== null) {
      getUserOwnedListing(ownedListingPage);
    }
  }, [data, ownedListingPage]);
  useEffect(() => {
    if (data !== null) {
      getUserInterestedListing(interestedListingPage);
    }
  }, [data, interestedListingPage]);

  const accessDataRoom = async (isAssignDataRoom) => {
    const url = BaseURL(
      isAssignDataRoom
        ? `business/unassign-buyer-from-dataroom`
        : `business/assign-buyer-to-dataroom`
    );
    const params = {
      businessId: data?.lead?.listingID?._id,
      ...(isAssignDataRoom
        ? { userId: data?.lead?.buyer?._id }
        : { userIds: [data?.lead?.buyer?._id] }),
    };
    setAccessRoomLoader(true);
    const response = await Patch(url, params, apiHeader(token));
    if (response !== undefined) {
      if (isAssignDataRoom) {
        setIsAssignDataRoom(false);
      } else {
        setIsAssignDataRoom(true);
      }
      setAccessRoomModal(false);
      toast.success(
        `Successfully ${isAssignDataRoom ? "UnAssigned" : "Assigned"}`
      );
    }
    setAccessRoomLoader(false);
  };

  const status = data?.lead?.status;

  async function updateMemorandom(text) {
    setIsModalLoading("memorandom");
    await updateLeadStatus(data?.lead?.status, text);
    setIsModalLoading("");
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
        padding-block: 12px;
      }
      @media screen and (max-width:1440px){
      .table100-head, .table100-body{
        width:1200px;
      }
      .table100.ver1{
        overflow-x:scroll !important;

      }
    }
      @media screen and (max-width:992px){
      .table100-head, .table100-body{
        width:1100px;
      }
    }

      `}</style>
      <SideBarSkeleton>
        <div className={classes.main_container}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <Row>
                <div className={classes.mainHeading_row}>
                  <h4>Interest Details</h4>
                  <div>
                    {data?.lead?.ndaTemplate && (
                      <Button
                        label={"Download"}
                        onClick={() => {
                          downloadFileFromUrl(
                            mediaUrl(data?.lead?.ndaTemplate),
                            `${data?.lead?.nda?.firstName} ${data?.lead?.nda?.lastName}-${data?.lead?.listingID?.title}-NDA.pdf`
                          );
                        }}
                      />
                    )}
                    {/* 
                      <Button
                        label={"Offer Memo"}
                        onClick={() => setIsOpenModal("memorandom")}
                      />                      
                    */}
                    <Button
                      label={`${isAssignDataRoom
                          ? "UnAssign Dataroom"
                          : "Assign DataRoom"
                        }`}
                      onClick={() => setAccessRoomModal(true)}
                    />
                    <Button
                      label={"Update Status"}
                      onClick={() => setIsOpenModal("update-status")}
                    />
                    <Button
                      label={"Update Profile"}
                      onClick={() => navigate(`/update-profile/${id}`)}
                    />
                  </div>
                </div>
              </Row>
              <Row className={`${classes.content_main} gy-2`}>
                <Col lg={4} xxl={3} md={5}>
                  <div className={classes.userDetail_sideBar}>
                    <div className={classes.top}>
                      <div className={classes.img_main}>
                        <img src={imageUrl(data?.lead?.buyer?.photo)} />
                      </div>
                      <h4>{`${data?.lead?.buyer?.firstName} ${data?.lead?.buyer?.lastName}`}</h4>
                    </div>
                    <div className={classes.hr_line}></div>
                    <div className={classes.bottom}>
                      <div className={classes.bottom_content}>
                        <h6>Email</h6>
                        <p>{data?.lead?.buyer?.email}</p>
                      </div>
                      <div className={classes.bottom_content}>
                        <h6>Phone</h6>
                        <p>
                          {ReturnFormatedNumber(data?.lead?.buyer?.contact)}
                        </p>
                      </div>
                      <div className={classes.bottom_content}>
                        <h6>Address </h6>
                        <p>{data?.lead?.buyer?.city}</p>
                      </div>
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
                      {userData !== undefined && (
                        <>
                          {" "}
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="User Name"
                              value={`${userData?.firstName} ${userData?.firstName}`}
                            />
                          </Col>
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="Email"
                              value={`${userData?.email}`}
                            />
                          </Col>
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="Contact"
                              value={ReturnFormatedNumber(userData?.contact)}
                            />
                          </Col>
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="Street Address"
                              value={`${userData?.streetAddress}`}
                            />
                          </Col>
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="Zipcode"
                              value={`${userData?.zipCode}`}
                            />
                          </Col>
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="State"
                              value={`${userData?.state}`}
                            />
                          </Col>
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="City"
                              value={`${userData?.city}`}
                            />
                          </Col>
                          {userData?.licensedBroker && (
                            <>
                              <Col md={6} xl={4}>
                                <TitleWithValue
                                  title="Broker Name"
                                  value={`${userData?.brokerName}`}
                                />
                              </Col>
                              <Col md={6} xl={4}>
                                <TitleWithValue
                                  title="Broker Company"
                                  value={`${userData?.brokerCompanyName}`}
                                />
                              </Col>
                            </>
                          )}
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="Minimum Annual Income Needs"
                              value={`${userData?.minAnnualIncomeNeeds}`}
                            />
                          </Col>
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="Time Allocated For Business"
                              value={`${userData?.timeAllocatedForBusiness}`}
                            />
                          </Col>
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="Business Interested In"
                              value={`${userData?.businessInterested}`}
                            />
                          </Col>
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="Capital Available For Purchase"
                              value={`${userData?.capitalAvailable[0]}`}
                            />
                          </Col>
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="Location Preference"
                              value={`${userData?.preferredLocation[0]}`}
                            />
                          </Col>
                          <Col md={6} xl={4}>
                            <TitleWithValue
                              title="Current Occupation"
                              value={`${userData?.currentOccupation}`}
                            />
                          </Col>
                          {status == "nda-submitted" && (
                            <Col md={12} className={classes.btnsBox}>
                              <Button
                                onClick={() => acceptReject("nda-signed", true)}
                                disabled={isSubmitting == "accept"}
                              >
                                {isSubmitting == "accept"
                                  ? "Wait..."
                                  : "Accept"}
                              </Button>
                              <Button
                                onClick={() =>
                                  acceptReject("not-qualified", false)
                                }
                                disabled={isSubmitting == "reject"}
                              >
                                {isSubmitting == "reject"
                                  ? "wait..."
                                  : "Reject"}
                              </Button>
                            </Col>
                          )}
                        </>
                      )}
                      {userData == undefined && (
                        <Col md={12}>
                          <NoData text={`NDA not submitted yet`} />
                        </Col>
                      )}
                    </Row>
                  </div>
                </Col>
                {/* table_one */}
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
                                Company Name
                              </th>

                              <th
                                class="cell100 column3"
                                style={{ width: "13%", textAlign: "start" }}
                              >
                                Buyer
                              </th>
                              <th
                                class="cell100 column4"
                                style={{ width: "13%", textAlign: "start" }}
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
                                style={{ width: "5%", textAlign: "start" }}
                              >
                                Notes
                              </th>
                              <th
                                class="cell100 column5"
                                style={{ width: "6%", textAlign: "center" }}
                              >
                                NDA
                              </th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                      <div class="table100-body js-pscroll ps ps--active-y">
                        <table>
                          <tbody>
                            {isGettingInterestedListing ? (
                              <TableSkeleton rowsCount={5} colsCount={9} />
                            ) : interestedListing?.length > 0 ? (
                              interestedListing?.map((item, index) => (
                                <tr class="row100 body">
                                  <td
                                    class="cell100 column1"
                                    style={{
                                      width: "20%",
                                      textAlign: "start",
                                    }}
                                  >
                                    {item?.listingID?.title}
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
                                      width: "13%",
                                      textAlign: "start",
                                    }}
                                  >
                                    {`${item?.buyer?.firstName} ${item?.buyer?.lastName}`}
                                  </td>
                                  <td
                                    class="cell100 column4"
                                    style={{
                                      width: "13%",
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
                                          boker_phone: item?.broker[0]?.contact,
                                          broker_email: item?.broker[0]?.email,
                                          seller_name:
                                            item?.listingID?.owner?.firstName +
                                            " " +
                                            item?.listingID?.owner?.lastName,
                                          seller_desgination:
                                            item?.listingID?.owner?.designation,
                                          seller_phone:
                                            item?.listingID?.owner?.contact,
                                          seller_email:
                                            item?.listingID?.owner?.email,
                                          // seller_companyName:
                                          //   item?.listingID?.companyName,
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
                                      optionValue={"value"}
                                    />
                                  </td>
                                  <td
                                    class="cell100 column4"
                                    style={{
                                      width: "5%",
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
                                      width: "6%",
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
                              <NoData text="No Listings Found" />
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {interestedListing?.length > 0 && (
                      <div className={classes.paginationDiv}>
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
                </Col>
                {/* table_two */}
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
                                class="cell100 column2"
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
                      <div class="table100-body js-pscroll ps ps--active-y">
                        <table>
                          <tbody>
                            {isGettingOwnedListing ? (
                              <TableSkeleton rowsCount={5} colsCount={9} />
                            ) : ownedListing?.length > 0 ? (
                              ownedListing?.map((item, index) => (
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
                                            seller_phone: item?.owner?.contact,
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
                              <NoData text="No Listings Found" />
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {ownedListing?.length > 0 && (
                      <div className={classes.paginationDiv}>
                        <PaginationComponent
                          totalPages={Math.ceil(
                            ownedListingTotalCount / recordsLimit
                          )}
                          currentPage={ownedListingPage}
                          setCurrentPage={setOwnedListingPage}
                        />
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </>
          )}
        </div>
        {/* Modals */}
        <AddOrUpdateOfferMemorandomModal
          show={isOpenModal == "memorandom"}
          isLoading={isModalLoading == "memorandom"}
          setShow={() => setIsOpenModal("")}
          handleSubmit={updateMemorandom}
          data={data?.lead?.memorandum}
        />
        <UpdateNDAStatus
          show={isOpenModal == "update-status"}
          setShow={() => setIsOpenModal("")}
          isLoading={isSubmitting == "update-status"}
          leadStatus={data?.lead?.status}
          handleSubmit={updateLeadStatus}
        />
        {accessRoomModal && (
          <AreYouSureModal
            show={accessRoomModal}
            setShow={setAccessRoomModal}
            subTitle={`${isAssignDataRoom ? "Unassign" : "Assign"
              } data room?`}
            isApiCall={accessRoomLoader}
            onClick={() => accessDataRoom(isAssignDataRoom)}
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

export default ViewInterest;
