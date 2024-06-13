import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import Loader from "../../../Component/Loader";
import NoData from "../../../Component/NoData/NoData";
import PaginationComponent from "../../../Component/PaginationComponent";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import Switch from "../../../Component/Switch/Switch";
import {
  apiHeader,
  BaseURL,
  CreateFormData,
  imageUrl,
  recordsLimit,
  ReturnFormatedNumber,
} from "../../../config/apiUrl";
// import { userdetail } from "../../../config/DummyData";
import classes from "./BrokerDetail.module.css";
import EditBrokerModal from "../../../modals/EditBrokerModal";
import { Button } from "../../../Component/Button/Button";
import { MdEdit } from "react-icons/md";

function TitleWithValue({ title = "", value = "" }) {
  return (
    <div className={classes.titleWithValue}>
      <h6>{title}</h6>
      <p>{value !== "" ? value : "Not Added Yet"}</p>
    </div>
  );
}
const BrokerDetail = () => {
  const token = useSelector((state) => state?.authReducer?.access_token);
  const [brokerData, setBrokerData] = useState([]);
  const [totalListingAssigned, setTotalListingAssigned] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeUser, setActiveUser] = useState(false);
  const [page, setPage] = useState(1);

  const [ListingAssigned, setListingAssigned] = useState([]);
  const [listingAssignedTotalCount, setListingAssignedTotalCount] = useState(1);
  // for edit broker
  const [editBrokerModal, setEditBrokerModal] = useState(false);
  const [editBrokerLoading, setEditBrokerLoading] = useState(false);

  const slug = useParams()?.slug;
  const getBrokerDetail = async () => {
    const apiUrl = BaseURL(`users/broker/details/${slug}`);
    setIsLoading(true);
    const response = await Get(apiUrl, token);
    if (response !== undefined) {
      setBrokerData(response?.data?.data?.user);
      setTotalListingAssigned(response?.data?.data?.listings);
      setActiveUser(
        response?.data?.data?.user?.active == "active" ? false : true
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };
  const getListingAssigned = async () => {
    const apiUrl = BaseURL(
      `users/broker-listings/${slug}?page=${page}&limit=${recordsLimit}`
    );
    setIsLoading(true);
    const response = await Get(apiUrl, token);
    if (response !== undefined) {
      setListingAssigned(response?.data?.ownedBusiness);
      setListingAssignedTotalCount(
        Math.ceil(response?.data?.totalCount / recordsLimit)
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getBrokerDetail();
    getListingAssigned();
  }, [page]);

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
  // edit broker
  const handleEditBroker = async (e) => {
    const url = BaseURL("users/admin/update-user");
    const params = {
      userId: brokerData?._id,
      ...e,
    };
    const formDataParams = CreateFormData(params);

    setEditBrokerLoading(true);
    const response = await Patch(url, formDataParams, apiHeader(token));
    if (response !== undefined) {
      setBrokerData(response?.data);
      toast.success(`Broker edited successfully.`);
      setEditBrokerModal(false);
    }
    setEditBrokerLoading(false);
  };

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
      `}</style>
      <SideBarSkeleton>
        <div className={classes.mainContainer}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <Row>
                <div className={classes.mainHeading_row}>
                  <h4>Broker Details</h4>
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
                      <div className={classes.img_main}>
                        <img src={imageUrl(brokerData?.photo)} alt="profile" />
                      </div>
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
                            setEditBrokerModal(true);
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
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Meeting Link"
                          value={`${brokerData?.meetingLink}`}
                        />
                      </Col>
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
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Description"
                          value={`${brokerData?.description}`}
                        />
                      </Col>
                      <Col sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Cell Phone"
                          value={ReturnFormatedNumber(brokerData?.cell)}
                        />
                      </Col>
                      <Col sm={6} md={12} xl={4} xxl={4}>
                        <TitleWithValue
                          title="Total Listing Assigned"
                          value={totalListingAssigned?.length}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>

                <Col md={12}>
                  <div
                    className={[
                      // classes.mainContainer,
                      classes.mt20,
                      classes.boxWithShadow,
                    ].join(" ")}
                  >
                    <div className={[classes.headerContainer]}>
                      <h3>Listings Assigned</h3>
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
                                class="cell100 column5"
                                style={{ width: "10%", textAlign: "start" }}
                              >
                                Category
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
                                Price
                              </th>
                              <th
                                class="cell100 column5"
                                style={{ width: "10%", textAlign: "start" }}
                              >
                                Sales
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
                            </tr>
                          </thead>
                        </table>
                      </div>
                      <div class="table100-body js-pscroll ps ps--active-y">
                        <table>
                          <tbody>
                            {ListingAssigned?.length > 0 ? (
                              ListingAssigned?.map((item, index) => (
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
                                      width: "10%",
                                      textAlign: "start",
                                    }}
                                  >
                                    {item?.category?.name}
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
                                    {item?.businessOpportunity}
                                  </td>
                                  <td
                                    class="cell100 column4"
                                    style={{
                                      width: "10%",
                                      textAlign: "start",
                                    }}
                                  >
                                    {item?.grossSales}
                                  </td>
                                  <td
                                    class="cell100 column4"
                                    style={{
                                      width: "10%",
                                      textAlign: "start",
                                    }}
                                  >
                                    {item?.cashFlow}
                                  </td>

                                  <td
                                    class="cell100 column4"
                                    style={{
                                      width: "10%",
                                      textAlign: "start",
                                    }}
                                  >
                                    {item?.status}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <NoData text="No Listing Added Yet" />
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {ListingAssigned?.length > 0 && (
                      <div className={[classes.paginationDiv]}>
                        <PaginationComponent
                          totalPages={listingAssignedTotalCount}
                          currentPage={page}
                          setCurrentPage={setPage}
                        />
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </>
          )}
        </div>
        {editBrokerModal && (
          <EditBrokerModal
            handleSubmit={handleEditBroker}
            show={editBrokerModal}
            setShow={setEditBrokerModal}
            isLoading={editBrokerLoading}
            data={brokerData}
            userType={"broker"}
            heading={"Edit Broker"}
          />
        )}
      </SideBarSkeleton>
    </>
  );
};

export default BrokerDetail;
