import React, { useEffect } from "react";
import classes from "./AllBroker.module.css";
import {
  apiHeader,
  BaseURL,
  CreateFormData,
  formRegEx,
  formRegExReplacer,
  imageUrl,
  recordsLimit50,
  ReturnFormatedNumber,
  validateEmail,
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
import useDebounce from "../../../CustomHooks/useDebounce";
import SearchInput from "../../../Component/SearchInput";
import EditBrokerModal from "../../../modals/EditBrokerModal";

const AllBroker = () => {
  const navigate = useNavigate();
  const { access_token: accessToken, user } = useSelector(
    (state) => state?.authReducer
  );

  const isAdmin = !user?.role?.includes("broker");

  const [broker, setBroker] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [show, setShow] = useState(false);

  // For Search
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);

  const getAllBroker = async (pg = page) => {
    const url = BaseURL(
      `users/brokers/all?page=${pg}&limit=${recordsLimit50}&search=${search}`
    );
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setBroker(response?.data?.data?.data);
      setTotalPages(
        Math.ceil(response?.data?.data?.totalCount / recordsLimit50)
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllBroker();
  }, [page]);

  const handleAddBroker = async (params) => {
    const apiUrl = BaseURL("users/admin/create");
    setSubmitLoading(true);
    const response = await Post(apiUrl, params, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success(`Broker created successfully.`);
      if (page == 1) {
        const oldData = [...broker];
        oldData.unshift(response?.data?.data);
        setBroker(oldData);
      } else {
        setPage(1);
      }
      setShow(false);
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    setPage(1);
    getAllBroker(1);
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
            <h4>All Brokers</h4>

            <div className={classes.aCenter}>
              <SearchInput
                setter={setSearch}
                value={search}
                placeholder={"Search"}
              />
              {isAdmin && (
                <Button label="Add Broker" onClick={() => setShow(true)} />
              )}
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
                      Photo
                    </th>
                    <th
                      class="cell100 column2"
                      style={{ width: "20%", textAlign: "left" }}>
                      Name
                    </th>
                    <th
                      class="cell100 column3"
                      style={{
                        width: "20%",
                        textAlign: "left",
                      }}>
                      email
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "20%", textAlign: "left" }}>
                      Office Contact
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "20%", textAlign: "left" }}>
                      Designation
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
                    {broker?.length > 0 ? (
                      broker?.map((item, index) => (
                        <tr class="row100 body">
                          <td
                            class="cell100 column1"
                            style={{ width: "20%", textAlign: "left" }}>
                            <div className={classes.userImage}>
                              <img src={imageUrl(item?.photo)} />
                            </div>
                          </td>
                          <td
                            class="cell100 column2"
                            style={{
                              width: "20%",
                              textAlign: "left",
                              textDecoration: "underline",
                              cursor: isAdmin && "pointer",
                            }}
                            onClick={() => {
                              if (isAdmin) {
                                navigate(`/broker-detail/${item?._id}`);
                              }
                            }}>
                            {item?.firstName + " " + item?.lastName}
                          </td>
                          <td
                            class="cell100 column3"
                            style={{
                              width: "20%",
                              textAlign: "left",
                              textTransform: "lowercase",
                            }}>
                            <Link
                              className={"ellipsis1Line emailLink"}
                              title={item?.email}
                              to={"/email"}
                              state={{ email: item?.email }}>
                              {item?.email}
                            </Link>
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "20%", textAlign: "left" }}>
                            <a href={`tel:${item?.officeContact}`}>
                              <span className={classes.phoneNumber}>
                                {item?.officeContact
                                  ? ReturnFormatedNumber(item?.officeContact)
                                  : "--"}
                              </span>
                            </a>
                          </td>
                          <td
                            class="cell100 column5"
                            style={{ width: "20%", textAlign: "left" }}>
                            {item?.designation || "not added yet"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <NoData text={"No Broker Found"} />
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {broker?.length && (
            <div className={[classes.paginationDiv]}>
              <PaginationComponent
                totalPages={totalPages}
                currentPage={page}
                setCurrentPage={setPage}
              />
            </div>
          )}
          {show && (
            <AddBrokerModal
              handleSubmit={handleAddBroker}
              show={show}
              setShow={setShow}
              isLoading={submitloading}
            />
          )}
        </div>
      </SideBarSkeleton>
    </>
  );
};

export default AllBroker;
