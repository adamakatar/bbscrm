import React, { useEffect } from "react";
import classes from "./outsideUsers.module.css";
import {
  apiHeader,
  BaseURL,
  CreateFormData,
  imageUrl,
  recordsLimit50,
  ReturnFormatedNumber,
} from "../../../config/apiUrl";
import { Get, Patch, Post } from "../../../Axios/AxiosFunctions";
import { useState } from "react";
import { Button } from "../../../Component/Button/Button";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import PaginationComponent from "../../../Component/PaginationComponent";
import TableSkeleton from "../../../Component/TableSkeleton";
import { useSelector } from "react-redux";
import NoData from "../../../Component/NoData/NoData";
import { Link, useNavigate } from "react-router-dom";
import AddBrokerModal from "../../../modals/AddBrokerModal";
import { toast } from "react-toastify";
import { outSideUsersOptionsForFilter } from "../../../constant/commonData";
import { DropDown } from "../../../Component/DropDown/DropDown";
import useDebounce from "../../../CustomHooks/useDebounce";
import SearchInput from "../../../Component/SearchInput";
import EditBrokerModal from "../../../modals/EditBrokerModal";

const OutsideUsers = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state?.authReducer?.access_token);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [userType, setUserType] = useState(outSideUsersOptionsForFilter[0]);
  const [totalPages, setTotalPages] = useState(1);
  const [show, setShow] = useState(false);

  // For Search
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);

  const getOutsideUsers = async (sts = userType?.value, pg = page) => {
    const url = BaseURL(
      `users/admin/outside-users?userType=${sts}&page=${pg}&limit=${recordsLimit50}&search=${search}`
    );
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setData(response?.data?.data);
      setTotalPages(response?.data?.totalCount);
    }
    setLoading(false);
  };

  useEffect(() => {
    getOutsideUsers(userType?.value, page);
  }, [page]);

  const handleAddOutsideUser = async (params) => {
    const apiUrl = BaseURL("users/admin/create");
    setSubmitLoading(true);
    const response = await Post(apiUrl, params, apiHeader(accessToken));
    if (response !== undefined) {
      const newData = [...data];
      const resData = response?.data?.data;
      if (
        userType?.value == "outside-roles" ||
        resData?.role?.includes(userType?.value)
      ) {
        newData.unshift(resData);
        setData(newData);
      }
      toast.success(`Outside user created successfully.`);
      setShow(false);
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    setPage(1);
    getOutsideUsers(userType?.value, 1);
  }, [debouncedSearchTerm]);

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
            <h4>Outside Users</h4>
            <div className={classes.rightSide}>
              <DropDown
                setter={(e) => {
                  setData([]);
                  setUserType(e);
                  setPage(1);
                  getOutsideUsers(e?.value, 1);
                }}
                value={userType}
                placeholder={"Select user type"}
                customStyle={{ padding: "0px", minWidth: "170px" }}
                options={outSideUsersOptionsForFilter}
              />
              <SearchInput
                setter={setSearch}
                value={search}
                placeholder={"Search"}
              />
              <Button label="Add Outside User" onClick={() => setShow(true)} />
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
                      class="cell100 column5"
                      style={{ width: "25%", textAlign: "left" }}
                    >
                      Office Contact
                    </th>
                    <th
                      class="cell100 column3"
                      style={{
                        width: "25%",
                        textAlign: "left",
                      }}
                    >
                      Email
                    </th>
                    <th
                      class="cell100 column3"
                      style={{
                        width: "25%",
                        textAlign: "left",
                      }}
                    >
                      Role
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
                    {data?.length > 0 ? (
                      data?.map((item, index) => (
                        <tr class="row100 body">
                          <td
                            class="cell100 column1"
                            style={{
                              width: "25%",
                              textAlign: "left",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              navigate(`/outside-user-detail/${item?._id}`);
                            }}
                          >
                            {item?.firstName + " " + item?.lastName}
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "25%", textAlign: "left" }}
                          >
                            <a href={`tel:${item?.officeContact}`}>
                              <span className={classes.phoneNumber}>
                                {item?.officeContact
                                  ? ReturnFormatedNumber(item?.officeContact)
                                  : "--"}
                              </span>
                            </a>
                          </td>
                          <td
                            class="cell100 column3"
                            style={{
                              width: "25%",
                              textAlign: "left",
                              textTransform: "lowercase",
                            }}
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
                            class={`cell100 column3 ${classes.text1Line}`}
                            style={{
                              width: "25%",
                              textAlign: "left",
                            }}
                          >
                            {item?.role?.join(", ")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <NoData text={"No Outside Users Found"} />
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {data?.length > 0 && (
            <div className={[classes.paginationDiv]}>
              <PaginationComponent
                totalPages={Math.ceil(totalPages / recordsLimit50)}
                currentPage={page}
                setCurrentPage={setPage}
              />
            </div>
          )}
          {show && (
            <AddBrokerModal
              handleSubmit={handleAddOutsideUser}
              show={show}
              setShow={setShow}
              isLoading={submitloading}
              isOutSideUser
              roleOptions={outSideUsersOptionsForFilter?.filter(
                (item) => item?.label !== "All"
              )}
              heading={"Add Outside User"}
            />
          )}
        </div>
      </SideBarSkeleton>
    </>
  );
};

export default OutsideUsers;
