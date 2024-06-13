import React, { useEffect, useRef } from "react";
import classes from "./Interests.module.css";
import {
  apiHeader,
  BaseURL,
  recordsLimit,
  ReturnFormatedNumber,
} from "../../config/apiUrl";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { useState } from "react";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import PaginationComponent from "../../Component/PaginationComponent";
import TableSkeleton from "../../Component/TableSkeleton";
import { useSelector } from "react-redux";
import NoData from "../../Component/NoData/NoData";
import { Link, useNavigate } from "react-router-dom";
import PoperComponent from "../../Component/PopperComponent";
import { DropDown } from "../../Component/DropDown/DropDown";
import { toast } from "react-toastify";
import {
  leadProgressOptions,
  listingStatusOptions,
} from "../../constant/commonData";
import { VscFilePdf } from "react-icons/vsc";
import { BsEye, BsChatDots } from "react-icons/bs";
import useDebounce from "../../CustomHooks/useDebounce";
import SearchInput from "../../Component/SearchInput";
import { MdChat } from "react-icons/md";
import AddOrEditNotesModal from "../../modals/AddorEditNotesModal";
import moment from "moment";
import Switch from "../../Component/Switch/Switch";

const Interests = () => {
  const navigate = useNavigate();
  const { access_token: accessToken, user } = useSelector(
    (state) => state?.authReducer
  );
  // const isAdmin = !user?.role?.includes("broker");
  const isAdmin = (user?.role || []).some(role => ["broker", "admin", "financial-analyst", "buyer-concierge", "seller-concierge", "executive"].includes(role));
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Lead Status
  const [leadStatus, setLeadStatus] = useState();

  // For Options
  const anchorRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openPopper, setOpenPopper] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState("");
  const [isModalLoading, setIsModalLoading] = useState("");

  // For Search
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);

  const [status, setStatus] = useState({ label: "All", value: "all" });

  const [outsideLead, setOutsideLead] = useState(false);

  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };

  const getAllInterests = async (
    pg = page,
    filterStatus = status?.value,
    outside = outsideLead
  ) => {
    const url = BaseURL(
      isAdmin
        ? `leads/admin?page=${pg}&limit=${recordsLimit}&status=${filterStatus}&outsideLead=${outside}&search=${search}`
        : `leads?page=${pg}&limit=${recordsLimit}&status=${filterStatus}&search=${search}`
    );
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setListing(response?.data?.lead);
      setLeadStatus(
        response?.data?.lead?.map((item) => ({
          leadId: item?._id,
          status: leadProgressOptions?.find(
            (e) => e?.value == item?.leadProgress
          ),
        }))
      );
      setTotalPages(response?.data?.countDoc);
    }
    setLoading(false);
  };

  const updateLeadProgress = async (e) => {
    const url = BaseURL(`leads/update-lead-status`);
    const body = {
      leadId: e?.leadId,
      leadProgress: e?.status?.value,
    };
    const response = await Patch(url, body, apiHeader(accessToken));
    if (response !== undefined) {
      const newData = [...listing];
      newData?.splice(
        newData.findIndex((item) => item?._id == response?.data?._id),
        1,
        response?.data
      );
      setListing(newData);
      toast.success("Lead progress updated successfully");
    }
  };
  async function handleAddNotes(body) {
    setIsModalLoading("add-notes");
    const url = BaseURL("leads/notes");
    const response = await Patch(
      url,
      { leadId: selectedItem?._id, notes: body },
      apiHeader(accessToken)
    );
    if (response !== undefined) {
      const index = listing?.findIndex(
        (item) => item?._id == selectedItem?._id
      );
      const newData = [...listing];
      newData?.splice(index, 1, response?.data);
      setListing(newData);
      toast.success("Notes added successfully");
    }
    setIsModalLoading("");
    setIsModalOpen("");
  }
  useEffect(() => {
    getAllInterests();
  }, [page]);
  useEffect(() => {
    setPage(1);
    getAllInterests(1);
  }, [debouncedSearchTerm]);

  // useEffect(() => {
  //     if (!openPopper) setSelectedItem(null);
  // }, [openPopper]);
  const handleClick = (flag) => {
    if (flag == "View") {
      navigate(`/view-interest/${selectedItem?._id}`);
      setOpenPopper(false);
    }
  };

  const handleChatClick = () => {
    navigate('/conversation');
  };
  return (
    <>
      <style>{`
        // .DropdownOptionContainer__single-value {
        //   color:var(--white-color) !important;
        // }
      .table100-body{
          height:calc(100vh - 330px);
      }
      .table100-body td {
        padding-block: 10px;
      }
      .column1{
        padding-left: 16px;
      }
      .table100.ver1 .table100-body tr{
        margin:15px;
      }
      .table100 .table100-head tr {
        margin: 0 15px;
      }
      @media screen and (max-width:1440px){
      .table100-head, .table100-body{
        width:1300px;
      }
      .table100.ver1{
        overflow-x:scroll !important;
      }
    }

      `}</style>
      <SideBarSkeleton>
        <div className={[classes.mainContainer]}>
          <div className={classes.interests_head}>
            <h4>Interests</h4>
            <div className={classes.inputDiv}>
              {isAdmin && (
                <div className={classes.toggleBtnMain}>
                  <p>Outside Lead</p>
                  <Switch
                    value={outsideLead}
                    setter={(e) => {
                      setOutsideLead(e);
                      setPage(1);
                      getAllInterests(1, status?.value, e);
                    }}
                  />
                </div>
              )}
              <SearchInput
                setter={setSearch}
                value={search}
                placeholder={"Search"}
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
                  setPage(1);
                  setStatus(e);
                  getAllInterests(1, e?.value);
                }}
              />
            </div>
          </div>
          <div class="table100 ver1 m-b-110">
            <div class="table100-head">
              <table>
                <thead>
                  <tr class="row100 head">
                    <th
                      class="cell100 column1"
                      style={{
                        width: outsideLead ? "15%" : "15%",
                        textAlign: "left",
                      }}
                    >
                      Name
                    </th>
                    <th
                      class="cell100 column4"
                      style={{
                        width: outsideLead ? "25%" : "15%",
                        textAlign: "left",
                      }}
                    >
                      Listing
                    </th>
                    {/* <th
                      class="cell100 column4"
                      style={{ width: "10%", textAlign: "left" }}
                    >
                      Company Name
                    </th> */}
                    {!outsideLead && (
                      <th
                        class="cell100 column3"
                        style={{ width: "15%", textAlign: "center" }}
                      >
                        Email
                      </th>
                    )}
                    <th
                      class="cell100 column5"
                      style={{ width: "15%", textAlign: "center" }}
                    >
                      Phone
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "11%", textAlign: "center" }}
                    >
                      Lead Progress
                    </th>
                    <th class="cell100 column5" style={{ width: "10%" }}>
                      Status
                    </th>
                    {/* <th class="cell100 column5" style={{ width: "10%" }}>
                      Assigned Broker
                    </th> */}
                    <th
                      class="cell100 column5"
                      style={{ width: "10%", textAlign: "center" }}
                    >
                      Updated
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: outsideLead ? "17%" : "10%" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="table100-body js-pscroll ps ps--active-y">
              {loading ? (
                <TableSkeleton rowsCount={recordsLimit} colsCount={7} />
              ) : (
                <table>
                  <tbody>
                    {listing?.length > 0 ? (
                      listing?.map((item, index) => (
                        <tr class="row100 body">
                          <td
                            class="cell100 column1"
                            style={{
                              width: item?.outsideLead ? "15%" : "15%",
                              textAlign: "left",
                            }}
                          >
                            {item?.outsideLead ? (
                              item?.contactName
                            ) : (
                              <Link
                                className={"ellipsis1Line emailLink"}
                                to={`/view-interest/${item?._id}`}
                              >
                                {`${item?.buyer?.firstName} ${item?.buyer?.lastName}`}
                              </Link>
                            )}
                          </td>
                          <td
                            class="cell100 column4"
                            style={{
                              width: outsideLead ? "25%" : "15%",
                              textAlign: "left",
                            }}
                          >
                            <Link
                              className={"ellipsis1Line emailLink"}
                              to={`/view-listing/${item?.listingID?.slug}`}
                            >
                              {`${item?.listingID?.title}`}
                            </Link>
                          </td>
                          {!item?.outsideLead && (
                            <td
                              class="cell100 column4"
                              style={{ width: "17%", textAlign: "center" }}
                            >
                              <Link
                                className={"ellipsis1Line emailLink"}
                                title={item?.buyer?.email}
                                to={"/email"}
                                state={{ email: item?.buyer?.email }}
                              >
                                {item?.buyer?.email}
                              </Link>
                            </td>
                          )}
                          <td
                            class="cell100 column4"
                            style={{ width: "15%", textAlign: "center" }}
                          >
                            <a href={`tel:${item?.contactPhone}`}>
                              <span className={classes.phoneNumber}>
                                {!outsideLead
                                  ? ReturnFormatedNumber(item?.contactPhone)
                                  : item?.contactPhone}
                              </span>
                            </a>
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "11%", textAlign: "center" }}
                          >
                            {/* {item?.contactPhone} */}
                            <DropDown
                              customStyle={{
                                backgroundColor: "var(--dashboard-main-color)",
                                color: "#fff",
                                borderRadius: "0px",
                                padding: "0px 5px 0px 1px",
                                fontSize: "14px",
                              }}
                              singleValueColor={"var(--white-color)"}
                              options={leadProgressOptions}
                              placeholder={"Select"}
                              value={leadStatus[index]?.status}
                              setter={(e) => {
                                const newLeadStatus = [...leadStatus];
                                newLeadStatus[index].status = e;
                                setLeadStatus(newLeadStatus);
                                updateLeadProgress(newLeadStatus[index]);
                              }}
                              optionLabel={"label"}
                              optionValue={"value"}
                            />
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "10%", textAlign: "center" }}
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
                            class="cell100 column5"
                            style={{ width: "10%", textAlign: "center" }}
                          >
                            {moment(item?.updatedAt).format("DD MMM")}
                          </td>
                          <td
                            class="cell100 column5"
                            style={{
                              width: item?.outsideLead ? "17%" : "10%",
                              textAlign: "",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div className={classes?.btnContainer}>
                                <MdChat
                                  size={20}
                                  color={"#fff"}
                                  onClick={() => {
                                    navigate(`/conversation/${item.contactPhone}`)
                                  }}
                                />
                              </div>
                              {item?.outsideLead ? (
                                item?.contactName
                              ) : (
                                <div className={classes?.btnContainer}>
                                  <BsEye
                                    color={"var(--white-color)"}
                                    size={25}
                                    onClick={() => {
                                      if (
                                        item?.buyer?.role?.some(
                                          (e) =>
                                            !["buyer", "seller"].includes(e)
                                        )
                                      ) {
                                        navigate(
                                          `/outside-user-detail/${item?.buyer?._id}`
                                        );
                                      } else {
                                        navigate(
                                          `/user-detail/${item?.buyer?._id}`
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              )}

                              {!isAdmin && (
                                <div className={classes.btnContainer}>
                                  <BsChatDots
                                    color={"var(--white-color)"}
                                    size={25}
                                    onClick={() => {
                                      navigate(`/messages`, {
                                        state: item?.room,
                                      });
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </td>

                          {/*  */}
                        </tr>
                      ))
                    ) : (
                      <NoData text={"No Interests Found"} />
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {listing?.length > 0 && (
            <div className={[classes.paginationDiv]}>
              <PaginationComponent
                totalPages={Math.ceil(totalPages / recordsLimit)}
                currentPage={page}
                setCurrentPage={setPage}
              />
            </div>
          )}
        </div>

        <PoperComponent
          handleClick={handleClick}
          open={openPopper}
          setOpen={setOpenPopper}
          anchorRef={anchorRef}
          data={["View"]}
          isCloseOnClick={false}
        />
      </SideBarSkeleton>
      {isModalOpen == "add-notes" && (
        <AddOrEditNotesModal
          setShow={() => setIsModalOpen("")}
          show={isModalOpen == "add-notes"}
          selectedUser={selectedItem}
          loading={isModalLoading == "add-notes"}
          onClick={handleAddNotes}
        />
      )}
    </>
  );
};

export default Interests;
