import React, { useEffect } from "react";
import classes from "./AllUser.module.css";
import {
  apiHeader,
  BaseURL,
  recordsLimit50,
  ReturnFormatedNumber,
} from "../../../config/apiUrl";
import { Delete, Get, Post } from "../../../Axios/AxiosFunctions";
import { useState } from "react";
import { Button } from "../../../Component/Button/Button";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import PaginationComponent from "../../../Component/PaginationComponent";
import TableSkeleton from "../../../Component/TableSkeleton";
import { useSelector } from "react-redux";
import NoData from "../../../Component/NoData/NoData";
import { Link, useNavigate } from "react-router-dom";
import useDebounce from "../../../CustomHooks/useDebounce";
import SearchInput from "../../../Component/SearchInput";
import { toast } from "react-toastify";
import AddBulkUserModal from "../../../modals/AddBulkUserModal";
import AddBuyerSellerModal from "../../../modals/AddBuyerSellerModal";
import { DropDown } from "../../../Component/DropDown/DropDown";
import AreYouSureModal from "../../../modals/AreYouSureModal";

const AllUser = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state?.authReducer?.access_token);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  // add bulk user
  const [bulkUserModal, setBulkUserModal] = useState(false);
  const [bulkUserLoading, setBulkUserLoading] = useState(false);
  // add buyer seller
  const [addBuyerSellerModal, setAddBuyerSellerModal] = useState(false);
  // For Search
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);
  // for filter
  const [filter, setFilter] = useState({
    label: "All",
    value: "",
  });
  // del user
  const [delUserModal, setDelUserModal] = useState(false);
  const [delUserLoading, setDelUserLoading] = useState(false);
  // selected user
  const [selectedUser, setSelectedUser] = useState(null);

  const getAllUser = async (pg = page, desigFilter = filter?.value) => {
    const url = BaseURL(
      `users/buyers-sellers/all?page=${pg}&limit=${recordsLimit50}&search=${search}&designation=${desigFilter}`
    );
    setLoading(true);

    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setUser(response?.data?.data);
      setTotalPages(Math.ceil(response?.data?.totalCount / recordsLimit50));
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllUser();
  }, [page]);

  useEffect(() => {
    setPage(1);
    getAllUser(1);
  }, [debouncedSearchTerm]);

  const addBulkUser = async (e, isCsv = true) => {
    const url = BaseURL(`users/admin/user/bulk`);
    const params = {
      ...e,
    };
    setBulkUserLoading(true);
    const response = await Post(url, params, apiHeader(accessToken));
    if (response !== undefined) {
      await getAllUser(1);
      if (isCsv) {
        toast.success("Bulk User added successfully");
        setBulkUserModal(false);
      } else {
        toast.success("User added successfully");
        setAddBuyerSellerModal(false);
      }
    }
    setBulkUserLoading(false);
  };

  // del User
  const deleteUser = async (id) => {
    const url = BaseURL(`users/delete/${id}`);
    setDelUserLoading(true);
    const response = await Delete(url, null, apiHeader(accessToken));
    if (response !== undefined) {
      const tempData = [...user];
      setUser(tempData?.filter((it) => it?._id !== id));
      toast.success("Successfully Deleted");
      setDelUserModal(false);
    }
    setDelUserLoading(false);
  };

  return (
    <>
      <style>{`
      .table100-body{
        height:calc(100vh - 311px);
      }
      .table100-body table{
        height:100%;
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
      .DropdownOptionContainer__dropdown-indicator {
        padding:5px;
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
            <h4>All Buyer/Seller</h4>
            <div className={classes.bulkUserBtnDiv}>
              <Button
                label={"Add Buyer/Seller"}
                onClick={() => setAddBuyerSellerModal(true)}
              />
              <Button
                label={"Add Bulk Users"}
                onClick={() => setBulkUserModal(true)}
              />
              <SearchInput
                setter={setSearch}
                value={search}
                placeholder={"Search"}
              />
              <DropDown
                value={filter}
                isSearchable={false}
                setter={(e) => {
                  getAllUser(1, e?.value);
                  setFilter(e);
                }}
                options={[
                  {
                    label: "All",
                    value: "",
                  },
                  {
                    label: "Buyer",
                    value: "Buyer",
                  },
                  {
                    label: "Seller",
                    value: "Seller",
                  },
                ]}
                placeholder={"Role"}
                customStyle={{
                  border: "1px solid #000",
                  borderRadius: "0",
                  padding: "0",
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
                      style={{ width: "25%", textAlign: "left" }}
                    >
                      Name
                    </th>
                    <th
                      class="cell100 column4"
                      style={{ width: "25%", textAlign: "left" }}
                    >
                      Contact
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "25%", textAlign: "left" }}
                    >
                      Email
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "15%", textAlign: "left" }}
                    >
                      Role
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "10%", textAlign: "left" }}
                    >
                      Delete
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            {loading ? (
              <TableSkeleton rowsCount={recordsLimit50} colsCount={7} />
            ) : (
              <div class="table100-body js-pscroll ps ps--active-y">
                <table>
                  <tbody>
                    {user?.length > 0 ? (
                      user?.map((item, index) => (
                        <tr class="row100 body">
                          <td
                            class="cell100 column1"
                            style={{
                              width: "25%",
                              textAlign: "left",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              navigate(`/user-detail/${item?._id}`, {
                                state: item,
                              });
                            }}
                          >
                            {item?.firstName} {item?.lastName}
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "25%", textAlign: "left" }}
                          >
                            <a href={`tel:${item?.mobilePhone}`}>
                              <span className={classes.phoneNumber}>
                                {item?.mobilePhone
                                  ? ReturnFormatedNumber(item?.mobilePhone)
                                  : "--"}
                              </span>
                            </a>
                          </td>
                          <td
                            class="cell100 column5"
                            style={{ width: "25%", textAlign: "left" }}
                          >
                            <Link
                              className={"ellipsis1Line emailLink"}
                              title={item?.email}
                              to={"/email"}
                              state={{ email: item?.email }}
                            >
                              {item?.email}
                            </Link>
                          </td>
                          <td
                            class="cell100 column5"
                            style={{ width: "15%", textAlign: "left" }}
                          >
                            {item?.designation ? item?.designation : "--"}
                          </td>
                          <td
                            class="cell100 column5"
                            style={{ width: "10%", textAlign: "left" }}
                          >
                            {item?.leadInterested?.length == 0 &&
                            item?.ndaSubmitted?.length == 0 &&
                            item?.ownedBusiness?.length == 0 &&
                            item?.ndaSigned?.length == 0 ? (
                              <Button
                                label={"Delete"}
                                onClick={() => {
                                  setSelectedUser(item);
                                  setDelUserModal(true);
                                }}
                                className={classes.delUser}
                              />
                            ) : (
                              "--"
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <NoData text={"No Buyer Or Seller Found"} />
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {user?.length > 0 && (
            <div className={[classes.paginationDiv]}>
              <PaginationComponent
                totalPages={totalPages}
                currentPage={page}
                setCurrentPage={setPage}
              />
            </div>
          )}
        </div>
      </SideBarSkeleton>

      {bulkUserModal && (
        <AddBulkUserModal
          show={bulkUserModal}
          setShow={setBulkUserModal}
          handleSubmit={addBulkUser}
          isLoading={bulkUserLoading}
        />
      )}

      {addBuyerSellerModal && (
        <AddBuyerSellerModal
          show={addBuyerSellerModal}
          setShow={setAddBuyerSellerModal}
          handleSubmit={addBulkUser}
          isLoading={bulkUserLoading}
        />
      )}
      {delUserModal && (
        <AreYouSureModal
          show={delUserModal}
          setShow={setDelUserModal}
          isApiCall={delUserLoading}
          onClick={() => deleteUser(selectedUser?._id)}
          subTitle={`Are you sure you want delete this User`}
        />
      )}
    </>
  );
};

export default AllUser;
