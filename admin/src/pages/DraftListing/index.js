import React, { useEffect } from "react";
import classes from "./DraftListing.module.css";
import {
  apiHeader,
  BaseURL,
  imageUrl,
  recordsLimit,
} from "../../config/apiUrl";
import { Delete, Get } from "../../Axios/AxiosFunctions";
import { useState } from "react";
import { Button } from "../../Component/Button/Button";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import PaginationComponent from "../../Component/PaginationComponent";
import TableSkeleton from "../../Component/TableSkeleton";
import { useSelector } from "react-redux";
import NoData from "../../Component/NoData/NoData";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../CustomHooks/useDebounce";
import SearchInput from "../../Component/SearchInput";
import { toast } from "react-toastify";
import AreYouSureModal from "../../modals/AreYouSureModal";

const DraftListing = () => {
  const navigate = useNavigate();
  const { access_token: accessToken, user } = useSelector(
    (state) => state?.authReducer
  );
  const isAdmin = !user?.role?.includes("broker");
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const [selectedListing, setSelectedListing] = useState(null);

  // For Search
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);

  const [isModalOpen, setIsModalOpen] = useState("");
  const [isModalLoading, setIsModalLoading] = useState("");

  useEffect(() => {
    setPage(1);
    getAllListing(1);
  }, [debouncedSearchTerm]);

  const getAllListing = async (pg = page) => {
    const url = BaseURL(
      `business/admin/drafts?page=${pg}&limit=${recordsLimit}&search=${search}`
    );
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setListing(response?.data?.businessDrafts);
      setTotalPages(response?.data?.countDoc);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllListing();
  }, [page]);

  async function deleteDraft() {
    const url = BaseURL(`business/delete-draft/${selectedListing?._id}`);
    setIsModalLoading("delete");
    const response = await Delete(url, null, apiHeader(accessToken));
    if (response !== undefined) {
      const newData = [...listing];
      toast.success("Draft deleted successfully");
      newData.splice(
        newData?.findIndex((item) => item?._id == selectedListing?._id),
        1
      );
      setListing(newData);
      setIsModalOpen("");
    }
    setIsModalLoading("");
  }

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
            <h4>{"Draft Listing"} </h4>
            <div className={classes.aCenter}>
              <SearchInput
                setter={setSearch}
                value={search}
                placeholder={"Search"}
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
                      style={{ width: "20%", textAlign: "left" }}>
                      Name
                    </th>
                    <th
                      class="cell100 column2"
                      style={{ width: "15%", textAlign: "left" }}>
                      Company
                    </th>
                    <th
                      class="cell100 column4"
                      style={{ width: "10%", textAlign: "left" }}>
                      Broker
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
                <table>
                  <tbody>
                    {listing?.length == 0 ? (
                      <NoData text={"No Draft Listing Found"} />
                    ) : (
                      listing?.map((item, index) => (
                        <tr
                          class="row100 body"
                          style={{
                            backgroundColor:
                              selectedListing?._id == item?._id && "#E5F5FF",
                          }}>
                          <td
                            class={`cell100 column1 `}
                            style={{ width: "20%", textAlign: "left" }}>
                            {/* <Link
                              to={`/view-listing/${item?._id}`}
                              state={{ isShowDraft: true }}
                              className={classes.linkText}
                            > */}
                            {item?.title}
                            {/* </Link> */}
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
                            class="cell100 column4"
                            style={{ width: "12%", textAlign: "center" }}>
                            ${item?.cashFlow}
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "13%", textAlign: "center" }}>
                            ${item?.askingPrice}
                          </td>
                          <td class="cell100 column5" style={{ width: "10%" }}>
                            {item?.status}
                          </td>
                          <td class="cell100 column5" style={{ width: "20%" }}>
                            <div className={classes.actions_btn}>
                              {/* {isAdmin && ( */}
                              <Button
                                className={classes.edit_btn}
                                label={"Edit"}
                                onClick={() => {
                                  setSelectedListing(item);
                                  navigate(`/edit-listing/${item?._id}`, {
                                    state: { isShowDraft: true },
                                  });
                                }}
                              />
                              <Button
                                className={classes.edit_btn}
                                label={"Delete"}
                                onClick={() => {
                                  setSelectedListing(item);
                                  setIsModalOpen("delete");
                                }}
                              />
                              {/* )} */}
                            </div>
                          </td>
                        </tr>
                      ))
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
      </SideBarSkeleton>
      <AreYouSureModal
        show={isModalOpen == "delete"}
        setShow={() => setIsModalOpen("")}
        subTitle={`Are you sure you want delete this draft`}
        isApiCall={isModalLoading == "delete"}
        onClick={deleteDraft}
      />
    </>
  );
};

export default DraftListing;
