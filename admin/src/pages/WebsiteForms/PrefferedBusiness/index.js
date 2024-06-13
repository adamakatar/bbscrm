import React, { useEffect } from "react";
import classes from "./PrefferedBusiness.module.css";
import {
  BaseURL,
  recordsLimit,
  ReturnFormatedNumber,
} from "../../../config/apiUrl";
import { Get } from "../../../Axios/AxiosFunctions";
import { useState } from "react";
import { Button } from "../../../Component/Button/Button";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import PaginationComponent from "../../../Component/PaginationComponent";
import TableSkeleton from "../../../Component/TableSkeleton";
import { useSelector } from "react-redux";
import NoData from "../../../Component/NoData/NoData";
import { useNavigate } from "react-router-dom";
import SearchInput from "../../../Component/SearchInput";
import useDebounce from "../../../CustomHooks/useDebounce";

const PrefferedBusiness = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state?.authReducer?.access_token);

  const [prefferedBusiness, setPrefferedBusiness] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  // For Search
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);

  const getAllPrefferedBusiness = async (pg = page) => {
    const url = BaseURL(
      `valuation?page=${pg}&limit=${recordsLimit}&search=${search}`
    );
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setPrefferedBusiness(response?.data?.data);
      setTotalPages(Math.ceil(response?.data?.totalCount / recordsLimit));
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllPrefferedBusiness();
  }, [page]);

  useEffect(() => {
    setPage(1);
    getAllPrefferedBusiness(1);
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
        width:1300px;
      }
      .table100.ver1{
        overflow-x:scroll !important;
      }
    }
      `}</style>
      <SideBarSkeleton>
        <div className={[classes.mainContainer]}>
          <div className={classes.listing_head}>
            <h4>Preffered Business</h4>
            <SearchInput
              setter={setSearch}
              value={search}
              placeholder={"Search"}
            />
          </div>
          <div class="table100 ver1 m-b-110">
            <div class="table100-head">
              <table>
                <thead>
                  <tr class="row100 head">
                    <th
                      class="cell100 column1"
                      style={{ width: "15%", textAlign: "left" }}>
                      Name
                    </th>
                    <th
                      class="cell100 column2"
                      style={{ width: "10%", textAlign: "left" }}>
                      Contact
                    </th>
                    <th
                      class="cell100 column3"
                      style={{ width: "15%", textAlign: "left" }}>
                      Email
                    </th>
                    <th
                      class="cell100 column4"
                      style={{ width: "10%", textAlign: "left" }}>
                      City
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "10%", textAlign: "left" }}>
                      State
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "20%", textAlign: "left" }}>
                      Street Address
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "10%", textAlign: "left" }}>
                      Current Occupation
                    </th>

                    <th class="cell100 column5" style={{ width: "10%" }}>
                      Action
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            {loading ? (
              <TableSkeleton rowsCount={recordsLimit} colsCount={7} />
            ) : (
              <div class="table100-body js-pscroll ps ps--active-y">
                <table>
                  <tbody>
                    {prefferedBusiness?.length > 0 ? (
                      prefferedBusiness?.map((item, index) => (
                        <tr class="row100 body">
                          <td
                            class="cell100 column1"
                            style={{ width: "15%", textAlign: "left" }}>
                            {item?.firstName + " " + item?.lastName}
                          </td>

                          <td
                            class="cell100 column2"
                            style={{ width: "10%", textAlign: "left" }}>
                            {ReturnFormatedNumber(item?.contact)}
                          </td>
                          <td
                            class="cell100 column3"
                            style={{ width: "15%", textAlign: "left" }}>
                            <p
                              className={"ellipsis1Line emailLink"}
                              title={item?.email}>
                              {item?.email}
                            </p>
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "10%", textAlign: "left" }}>
                            {item?.city}
                          </td>
                          <td
                            class="cell100 column5"
                            style={{ width: "10%", textAlign: "left" }}>
                            {item?.state}
                          </td>
                          <td
                            class="cell100 column5"
                            style={{ width: "20%", textAlign: "left" }}>
                            {item?.streetAddress}
                          </td>
                          <td
                            class="cell100 column5"
                            style={{ width: "10%", textAlign: "left" }}>
                            {item?.currentBusiness}
                          </td>
                          <td class="cell100 column5" style={{ width: "10%" }}>
                            <div className={classes.actions_btn}>
                              <Button
                                className={classes.detail_btn}
                                label={"View Details"}
                                onClick={() => {
                                  navigate(`/preferred-business/${item?._id}`, {
                                    state: item,
                                  });
                                  // navigate(`/all-preferred-business-detail`, {
                                  //   state: item,
                                  // });
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <NoData text={"No Preffered Busniess Found"} />
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {prefferedBusiness?.length > 0 && (
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
    </>
  );
};

export default PrefferedBusiness;
