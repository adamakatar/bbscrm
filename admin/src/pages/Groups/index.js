import React, { useEffect, useRef } from "react";
import classes from "./groups.module.css";
import {
  apiHeader,
  BaseURL,
  imageUrl,
  recordsLimit,
} from "../../config/apiUrl";
import { Delete, Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { useState } from "react";
import { Button } from "../../Component/Button/Button";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import PaginationComponent from "../../Component/PaginationComponent";
import TableSkeleton from "../../Component/TableSkeleton";
import { useSelector } from "react-redux";
import NoData from "../../Component/NoData/NoData";
import { BsThreeDots } from "react-icons/bs";
import PoperComponent from "../../Component/PopperComponent";
import { toast } from "react-toastify";
import AddOrUpdateGroupModal from "../../modals/AddOrUpdateGroupModal";
import AreYouSureModal from "../../modals/AreYouSureModal";
import ViewGroupModal from "../../modals/ViewGroupDetails";
import useDebounce from "../../CustomHooks/useDebounce";
import SearchInput from "../../Component/SearchInput";

const Groups = () => {
  const accessToken = useSelector((state) => state?.authReducer?.access_token);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // For Crud Api
  const [isApiLoading, setIsApiLoading] = useState("");
  const [isOpenModal, setIsOpenModal] = useState("");

  // For Options
  const anchorRef = useRef(null);
  const [indexMap, setIndexMap] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openPopper, setOpenPopper] = useState(false);
  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };

  // For Search
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);

  const getAllGroups = async (pg = page) => {
    const url = BaseURL(
      `groups?page=${pg}&limit=${recordsLimit}&search=${search}`
    );
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setData(response?.data?.data);
      setTotalPages(response?.data?.results);
    }
    setLoading(false);
  };
  const addGroup = async (e) => {
    const url = BaseURL(`groups/create`);
    setIsApiLoading("add");
    const response = await Post(url, e, apiHeader(accessToken));
    if (response !== undefined) {
      const newData = [...data];
      newData.unshift(response?.data?.data);
      setData(newData?.slice(0, 10));
      setIsOpenModal("");
      toast.success("Group created successfully");
    }
    setIsApiLoading("");
  };
  const updateGroup = async (e) => {
    const url = BaseURL(`groups/update`);
    setIsApiLoading("edit");
    const response = await Patch(url, { ...e }, apiHeader(accessToken));
    if (response !== undefined) {
      const newData = [...data];
      newData?.splice(
        newData?.findIndex((item) => item?._id == response?.data?.data?._id),
        1,
        response?.data?.data
      );
      setData(newData);
      setIsOpenModal("");
      toast.success("Group updated successfully");
    }
    setIsApiLoading("");
  };
  const deleteGroup = async (e) => {
    const url = BaseURL(`groups/delete/${selectedGroup?._id}`);
    setIsApiLoading("delete");
    const response = await Delete(url, null, apiHeader(accessToken));
    if (response !== undefined) {
      const newData = [...data];
      newData?.splice(
        newData?.findIndex((item) => item?._id == selectedGroup?._id),
        1
      );
      setData(newData);
      setIsOpenModal("");
      toast.success("Group deleted successfully");
    }
    setIsApiLoading("");
  };

  useEffect(() => {
    getAllGroups();
  }, [page]);

  useEffect(() => {
    setPage(1);
    getAllGroups(1);
  }, [debouncedSearchTerm]);

  const handleClick = (flag) => {
    if (flag == "View") {
      setIsOpenModal("view");
      setOpenPopper(false);
    } else if (flag == "Edit") {
      setIsOpenModal("edit");
    } else {
      setIsOpenModal("delete");
    }
  };

  return (
    <>
      <style>{`
        .DropdownOptionContainer__single-value {
          color:var(--white-color) !important;
        }
      .table100-body{
    height:calc(100vh - 330px);
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
            <h4>Groups</h4>
            <div className={classes.aCenter}>
              <SearchInput
                setter={setSearch}
                value={search}
                placeholder={"Search"}
              />
              <Button
                label={"Add Group"}
                onClick={() => setIsOpenModal("add")}
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
                      style={{ width: "5%", textAlign: "left" }}>
                      SNo
                    </th>
                    <th
                      class="cell100 column2"
                      style={{ width: "20%", textAlign: "left" }}>
                      Name
                    </th>
                    <th
                      class="cell100 column4"
                      style={{ width: "15%", textAlign: "left" }}>
                      No Of Users
                    </th>

                    <th
                      class="cell100 column5"
                      style={{ width: "10%", textAlign: "left" }}>
                      Type
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "40%", textAlign: "left" }}>
                      Users
                    </th>
                    <th class="cell100 column5" style={{ width: "10%" }}>
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
                    {data?.length > 0 ? (
                      data?.map((item, index) => (
                        <tr
                          class="row100 body"
                          style={{
                            backgroundColor:
                              selectedGroup?._id == item?._id && "#E5F5FF",
                          }}>
                          <td
                            class="cell100 column1"
                            style={{ width: "5%", textAlign: "left" }}>
                            {index + 1}
                          </td>
                          <td
                            class="cell100 column2"
                            style={{
                              width: "20%",
                              textAlign: "left",
                            }}>
                            {item?.name}
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "15%", textAlign: "left" }}>
                            {item?.users?.length}
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "10%", textAlign: "left" }}>
                            {item?.type == "listing"
                              ? "Listing"
                              : item?.type == "user"
                              ? "Buyer/Seller"
                              : "Broker"}
                          </td>

                          <td
                            class="cell100 column4"
                            style={{ width: "40%", textAlign: "left" }}>
                            <div className={classes.imgsDiv}>
                              {item?.users?.slice(0, 6)?.map((item, i) => {
                                return (
                                  <div
                                    className={[classes.teamMemberImgDiv]}
                                    style={{
                                      marginLeft: i >= 1 ? "-15px" : "0px",
                                    }}>
                                    <img
                                      src={imageUrl(item?.photo)}
                                      alt="..."
                                    />
                                  </div>
                                );
                              })}
                              {item?.users?.length > 6 && (
                                <span className={[classes.countMember]}>
                                  +{item?.users?.length - 6} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td
                            class="cell100 column5"
                            style={{ width: "10%", textAlign: "" }}>
                            <div
                              ref={index == indexMap ? anchorRef : null}
                              id="composition-button"
                              aria-controls={
                                openPopper ? "composition-menu" : undefined
                              }
                              aria-expanded={openPopper ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={() => {
                                setSelectedGroup(item);
                                setIndexMap(index);
                                setTimeout(() => {
                                  handleToggle();
                                }, 100);
                              }}>
                              <BsThreeDots
                                size={30}
                                className={[classes.threeDots]}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <NoData text={"No Groups Found"} />
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {data?.length > 0 && (
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
          data={["View", "Edit", "Delete"]}
          isCloseOnClick={false}
        />
      </SideBarSkeleton>
      {isOpenModal == "add" && (
        <AddOrUpdateGroupModal
          setShow={() => setIsOpenModal("")}
          show={isOpenModal == "add"}
          onClick={addGroup}
          isLoading={isApiLoading == "add"}
        />
      )}
      {isOpenModal == "edit" && (
        <AddOrUpdateGroupModal
          setShow={() => setIsOpenModal("")}
          show={isOpenModal == "edit"}
          onClick={updateGroup}
          isLoading={isApiLoading == "edit"}
          data={selectedGroup}
        />
      )}
      {isOpenModal == "view" && (
        <ViewGroupModal
          setShow={() => setIsOpenModal("")}
          show={isOpenModal == "view"}
          data={selectedGroup}
        />
      )}
      {isOpenModal == "delete" && (
        <AreYouSureModal
          setShow={() => setIsOpenModal("")}
          show={isOpenModal == "delete"}
          onClick={deleteGroup}
          isApiCall={isApiLoading == "delete"}
          subTitle={"Do you want to delete this group?"}
        />
      )}
    </>
  );
};

export default Groups;
