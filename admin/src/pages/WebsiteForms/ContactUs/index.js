import React, { useEffect } from "react";
import classes from "./ContactUs.module.css";
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
import AllContactModal from "../../../Component/AllContactModal";
import useDebounce from "../../../CustomHooks/useDebounce";
import SearchInput from "../../../Component/SearchInput";

const ContactUs = () => {
  const accessToken = useSelector((state) => state?.authReducer?.access_token);

  const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);
  const [show, setShow] = useState(false);

  // For Search
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);

  const getAllContact = async (pg = page) => {
    const url = BaseURL(
      `newsletters/admin/all?type=contact-us&page=${pg}&limit=${recordsLimit}&search=${search}`
    );
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setContact(response?.data?.data);
      setTotalPages(Math.ceil(response?.data?.totalCount / recordsLimit));
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllContact();
  }, [page]);

  useEffect(() => {
    setPage(1);
    getAllContact(1);
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
        width:1250px;
      }
      .table100.ver1{
        overflow-x:scroll !important;
      }
    }

      `}</style>
      <SideBarSkeleton>
        <div className={[classes.mainContainer]}>
          <div className={classes.listing_head}>
            <h4>All Contact Us</h4>
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
                      style={{ width: "15%", textAlign: "left" }}>
                      Contact
                    </th>
                    <th
                      class="cell100 column3"
                      style={{ width: "15%", textAlign: "left" }}>
                      Email
                    </th>
                    <th
                      class="cell100 column4"
                      style={{ width: "15%", textAlign: "left" }}>
                      Recommend From
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "25%", textAlign: "left" }}>
                      Message
                    </th>

                    <th class="cell100 column5" style={{ width: "15%" }}>
                      Action
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            {loading ? (
              <TableSkeleton rowsCount={recordsLimit} colsCount={6} />
            ) : (
              <div class="table100-body js-pscroll ps ps--active-y">
                <table>
                  <tbody>
                    {contact?.length > 0 ? (
                      contact?.map((item, index) => (
                        <tr class="row100 body">
                          <td
                            class="cell100 column1"
                            style={{ width: "15%", textAlign: "left" }}>
                            {item?.firstName + " " + item?.lastName}
                          </td>
                          <td
                            class="cell100 column2"
                            style={{ width: "15%", textAlign: "left" }}>
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
                            style={{ width: "15%", textAlign: "left" }}>
                            {item?.recommendFrom?.split("(")[0]?.trim()}
                          </td>
                          <td
                            class="cell100 column5 "
                            style={{ width: "25%", textAlign: "left" }}>
                            <p className={classes.message}>{item?.message}</p>
                          </td>
                          <td class="cell100 column5" style={{ width: "15%" }}>
                            <div className={classes.actions_btn}>
                              <Button
                                className={classes.detail_btn}
                                label={"View Details"}
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShow(true);
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <NoData text={"No Contact Forms Found"} />
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className={[classes.paginationDiv]}>
            <PaginationComponent
              totalPages={totalPages}
              currentPage={page}
              setCurrentPage={setPage}
            />
          </div>
          {show && (
            <AllContactModal
              data={selectedItem}
              setShow={setShow}
              show={show}
              title={"Contact Details"}
            />
          )}
        </div>
      </SideBarSkeleton>
    </>
  );
};

export default ContactUs;
