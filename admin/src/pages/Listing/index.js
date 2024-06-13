import React, { useEffect } from "react";
import classes from "./Listing.module.css";
import {
  apiHeader,
  BaseURL,
  imageUrl,
  recordsLimit,
} from "../../config/apiUrl";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { useState } from "react";
import { Button } from "../../Component/Button/Button";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import PaginationComponent from "../../Component/PaginationComponent";
import TableSkeleton from "../../Component/TableSkeleton";
import { useSelector, useDispatch } from "react-redux";
import NoData from "../../Component/NoData/NoData";
import { Link, useNavigate } from "react-router-dom";
import useDebounce from "../../CustomHooks/useDebounce";
import SearchInput from "../../Component/SearchInput";
import { FaFolderOpen } from "react-icons/fa";
import AddOrEditNotesModal from "../../modals/AddorEditNotesModal";
import { toast } from "react-toastify";
import { MdNoteAdd } from "react-icons/md";
import { DropDown } from "../../Component/DropDown/DropDown";
import {
  createListingstatusOptions,
  listingStatusOptions,
} from "../../constant/commonData";
import { setAllCommon} from "../../store/common/commonSlice";
import { MSG_ERROR } from "../../utils/contants";
import { commaStyle } from "../../utils/functions";

const Listing = () => {
  const navigate = useNavigate();
  const { access_token: accessToken, user } = useSelector(
    (state) => state?.authReducer
  );
  // const isAdmin = !user?.role?.includes("broker");
  const isAdmin = (user?.role || []).some(role => ["broker", "admin", "financial-analyst", "buyer-concierge", "seller-concierge", "executive"].includes(role));
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [getCurrentUser, setGetCurrentUser] = useState(null);

  const [selectedListing, setSelectedListing] = useState(null);
  const [notesModal, setNotesModal] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);

  const [status, setStatus] = useState({ label: "All", value: "all" });

  // For Search
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
    getAllListing(1);
  }, [debouncedSearchTerm]);

  const getAllListing = async (pg = page, sts = status?.value) => {
    const url = BaseURL(
      isAdmin
        ? `business/admin/all?page=${pg}&limit=${recordsLimit}&search=${search}&status=${sts}`
        : `business/broker?page=${pg}&limit=${recordsLimit}&search=${search}&status=${sts}`
    );
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setListing(response?.data?.business);
      setTotalPages(response?.data?.countDoc);
    }
    setLoading(false);
  };

  const setAllData = () => {
    Promise.all([
      Get(BaseURL("categories/admin/all"), accessToken, false),
      Get(BaseURL("users/brokers/all"), accessToken, false),
      Get(
        BaseURL("users/admin/owner-broker?userType=seller"),
        accessToken,
        false
      ),
      Get(BaseURL("users/admin/owner-broker"), accessToken, false),
      isAdmin
        ? Get(BaseURL("business/admin/all"), accessToken, false)
        : Get(BaseURL("business/broker"), accessToken, false),
      Get(BaseURL("project-templates"), accessToken, false),
      Get(BaseURL("templates/admin/all"), accessToken, false),
    ]).then(([
      allCategories,
      allBrokers,
      allOwners,
      allUsers,
      allListing,
      allTaskManagerTemplate,
      allEmailTemplates,
    ]) => {
      dispatch(
        setAllCommon({
          allUsers: [
            ...allUsers?.data?.sellers,
            ...allUsers?.data?.brokers,
          ].filter((item) => item?._id !== user?._id),
          // allBrokers: allBrokers?.data?.data?.data.filter(
          //   (item) => item?._id !== user?._id
          // ),
          allBrokers: allBrokers?.data?.data?.data,
          allCategories: allCategories?.data?.data,
          allOwners: allOwners?.data?.sellers,
          allListing: allListing?.data?.business,
          allTaskManagerTemplate: allTaskManagerTemplate?.data?.templates,
          allEmailTemplates: allEmailTemplates?.data?.data,
        })
      );
    }).catch((error) => {
      console.log('>>>>>>>> error => ', error)
      toast.error(MSG_ERROR)
    })
  }
  useEffect(() => {
    setAllData();
  },[]);
  useEffect(() => {
    getAllListing();
  }, [page]);

  const dispatch = useDispatch();

  const addNotes = async (notes) => {
    const url = BaseURL(`business/notes`);
    const params = {
      slug: selectedListing?.slug,
      notes,
    };
    setNotesLoading(true);
    const response = await Patch(url, params, apiHeader(accessToken));
    if (response !== undefined) {
      const findListingIndex = listing?.findIndex(
        (item) => item?._id == selectedListing?._id
      );
      let tempListing = [...listing];
      tempListing.splice(findListingIndex, 1, response?.data);
      setListing(tempListing);
      setNotesModal(false);
      toast.success("Note added successfully");
    }
    setNotesLoading(false);
  };

  return (
    <>
      <style>{`
      .table100-body{
      height:calc(100vh - 311px);
      }
      .table100-body td {
        padding-block: 18px;
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
        width:1200px;
      }
      .table100.ver1{
        overflow-x:scroll !important;
      }
    }
      `}</style>
      <SideBarSkeleton>
        <div className={[classes.mainContainer]}>
          <div className={classes.listing_head}>
            <h4>{isAdmin ? "Listings" : "Assigned Listings"}</h4>
            <div className={classes.aCenter}>
              <DropDown
                options={[
                  { label: "All", value: "all" },
                  ...createListingstatusOptions,
                ]}
                placeholder={"Status"}
                customStyle={{ minWidth: "150px", paddingBlock: "0px" }}
                value={status}
                setter={(e) => {
                  setPage(1);
                  setStatus(e);
                  getAllListing(1, e?.value);
                }}
                optionLabel={"label"}
                optionValue={"value"}
              />
              <SearchInput
                setter={setSearch}
                value={search}
                placeholder={"Search"}
              />
              {/* {isAdmin && ( */}
              <Button
                label="Add Listing"
                onClick={() => navigate("/add-listing")}
              />
              {/* )} */}
            </div>
          </div>
          <div class="table100 ver1 m-b-110">
            <div class="table100-head">
              <table>
                <thead>
                  <tr class="row100 head">
                    <th
                      class="cell100 column1"
                      style={{ width: "10%", textAlign: "left" }}>
                      Broker
                    </th>
                    <th
                      class="cell100 column2"
                      style={{ width: "20%", textAlign: "left" }}>
                      Name
                    </th>
                    <th
                      class="cell100 column2"
                      style={{ width: "15%", textAlign: "left" }}>
                      Company
                    </th>

                    <th
                      class="cell100 column3"
                      style={{ width: "12%", textAlign: "center" }}>
                      Cash Flow
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "13%", textAlign: "center" }}>
                      Price
                    </th>
                    <th class="cell100 column5" style={{ width: "10%" }}>
                      Status
                    </th>
                    <th class="cell100 column5" style={{ width: "20%" }}>
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
                listing?.length == 0 ? 
                  <NoData text={"No Listing Found"} /> : 
                <table>
                  <tbody>
                    { listing?.map((item, index) => (
                        <tr class={`row100 body`}>
                          <td
                            class="cell100 column1"
                            style={{ width: "10%", textAlign: "left" }}>
                            <div style={{ position: "relative" }}>
                              {item?.broker?.slice(0, 2)?.map((item, i) => {
                                return (
                                  <div
                                    className={[classes.teamMemberImgDiv]}
                                    style={{
                                      left: i == 1 ? "35px" : "0px",
                                    }}>
                                    <img
                                      src={imageUrl(item?.photo)}
                                      alt="..."
                                    />
                                  </div>
                                );
                              })}
                              {item?.broker?.length > 2 && (
                                <span className={[classes.countMember]}>
                                  +{item?.broker?.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td
                            class={`cell100 column2 `}
                            style={{ width: "20%", textAlign: "left" }}>
                            <Link
                              to={`/view-listing/${item?.slug}`}
                              className={classes.linkText}>
                              {item?.title}
                            </Link>
                          </td>
                          <td
                            class="cell100 column2"
                            style={{
                              width: "15%",
                              textAlign: "left",
                            }}>
                            {item?.companyName}
                          </td>

                          <td
                            class="cell100 column4"
                            style={{ width: "12%", textAlign: "center" }}>
                            ${commaStyle(item?.cashFlow)}
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "13%", textAlign: "center" }}>
                            ${commaStyle(item?.businessOpportunity)}
                          </td>
                          <td class="cell100 column5" style={{ width: "10%" }}>
                            <p
                              className={`${classes.status} ${
                                classes[
                                  `color-${
                                    (item?.status == "active" && "green") ||
                                    (item?.status == "sold" && "blue") ||
                                    (item?.status == "under-contract" &&
                                      "orange") ||
                                    (item?.status == "pre-listing" && "gray") ||
                                    (item?.status == "off-market" && "yellow")
                                  }`
                                ]
                              }`}>
                              {item?.status}
                            </p>
                          </td>
                          <td class="cell100 column5" style={{ width: "20%" }}>
                            <div className={classes.actions_btn}>
                              <Button
                                title={"Add Notes"}
                                className={classes.detail_btn}
                                label={<MdNoteAdd size={20} color={"#fff"} />}
                                onClick={() => {
                                  setSelectedListing(item);
                                  setNotesModal(true);
                                }}
                              />
                              <div className={classes?.btnContainer}>
                                <FaFolderOpen
                                  color={"var(--white-color)"}
                                  size={25}
                                  onClick={() =>
                                    navigate(
                                      `/team-folder/listing/${item?.projectFolder}`
                                    )
                                  }
                                />
                              </div>
                              {isAdmin && (
                                <Button
                                  className={classes.edit_btn}
                                  label={"Edit"}
                                  onClick={() => {
                                    setGetCurrentUser(item);
                                    navigate(`/edit-listing/${item?.slug}`);
                                  }}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    }
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
      </SideBarSkeleton>

      {notesModal && (
        <AddOrEditNotesModal
          show={notesModal}
          setShow={setNotesModal}
          onClick={addNotes}
          loading={notesLoading}
          selectedUser={selectedListing}
        />
      )}
    </>
  );
};

export default Listing;
