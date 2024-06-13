import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Reports.module.css";
import {
  apiHeader,
  BaseURL,
  imageUrl,
  recordsLimit,
  ReturnFormatedNumber,
} from "../../config/apiUrl";
import { Get, Post } from "../../Axios/AxiosFunctions";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import TableSkeleton from "../../Component/TableSkeleton";
import NoData from "../../Component/NoData/NoData";
import PoperComponent from "../../Component/PopperComponent";
import ReportsFilterModal from "../../modals/ReportsFilterModal";
import SelectEmailTemplateForReportsModal from "../../modals/SelectEmailTemplateForReportsModal";
import { Button } from "../../Component/Button/Button";

const Interests = () => {
  const navigate = useNavigate();
  const { access_token: accessToken, user } = useSelector(
    (state) => state?.authReducer
  );
  const isAdmin = user?.role?.includes("admin");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");

  // Get cities
  const [allCities, setAllCities] = useState([]);

  // For Options
  const anchorRef = useRef(null);
  const [indexMap, setIndexMap] = useState(null);
  const [getCurrentUser, setGetCurrentUser] = useState(null);
  const [openPopper, setOpenPopper] = useState(false);

  // For Search
  const [search, setSearch] = useState("");

  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };
  // Get Users
  const getAllData = async (e, pg = page) => {
    const url = BaseURL(`users/admin/get-users-acc-to-param`);
    const body = {
      ...e,
    };
    setLoading(true);
    const response = await Post(url, body, apiHeader(accessToken));
    if (response !== undefined) {
      setData(response?.data?.data?.users);
      setTotalPages(response?.data?.data?.countDoc);
    }
    setLoading(false);
  };
  // Get Users Cities
  const getAllCities = async () => {
    const url = BaseURL("users/cities");
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      const arr = response?.data?.data;
      arr?.unshift("no city selected");
      setAllCities(arr);
    }
  };
  const handleSendMail = async (e) => {
    const url = BaseURL("templates/send-mails-to-filtered-users");
    const params = {
      templateId: e,
      userIds: data?.map((item) => item?._id),
    };
    setIsSubmitting("sending");
    const response = await Post(url, params, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success("Email has been sent to all the selected Users");
      setIsModalOpen("");
    }
    setIsSubmitting("");
  };

  useEffect(() => {
    getAllCities();
  }, []);

  useEffect(() => {
    getAllData();
  }, [page]);
  // useEffect(() => {
  //     setPage(1);
  //     getAllData(1);
  // }, []);

  // useEffect(() => {
  //     if (!openPopper) setGetCurrentUser(null);
  // }, [openPopper]);
  const handleClick = (flag) => {
    if (flag == "View") {
      navigate(`/view-interest/${getCurrentUser?._id}`);
      setOpenPopper(false);
    }
  };

  return (
    <>
      <style>{`
       
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
            <h4>Reports</h4>
            <div className={classes.aCenter}>
              <Button
                label={"Send Mail"}
                onClick={() => setIsModalOpen("send")}
              />
              <Button
                label={"Filter"}
                onClick={() => setIsModalOpen("filter")}
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
                      style={{ width: "10%", textAlign: "left" }}>
                      Photo
                    </th>

                    <th
                      class="cell100 column2"
                      style={{ width: "15%", textAlign: "left" }}>
                      Name
                    </th>

                    <th
                      class="cell100 column3"
                      style={{ width: "15%", textAlign: "left" }}>
                      Email
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "15%", textAlign: "left" }}>
                      Contact
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "15%", textAlign: "left" }}>
                      Role
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "15%", textAlign: "left" }}>
                      City
                    </th>
                    <th class="cell100 column5" style={{ width: "10%" }}>
                      Total Interests
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
                              getCurrentUser?._id == item?._id && "#E5F5FF",
                          }}>
                          <td
                            class="cell100 column1"
                            style={{ width: "5%", textAlign: "left" }}>
                            {index + 1}
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "10%", textAlign: "left" }}>
                            <div className={classes.imgDiv}>
                              <img src={imageUrl(item?.photo)} />
                            </div>
                          </td>
                          <td
                            class="cell100 column2"
                            style={{
                              width: "15%",
                              textAlign: "left",
                            }}>
                            <Link
                              className={"ellipsis1Line emailLink"}
                              to={
                                item?.role?.some(
                                  (e) => !["buyer", "seller"].includes(e)
                                )
                                  ? `/outside-user-detail/${item?._id}`
                                  : `/user-detail/${item?._id}`
                              }>
                              {`${item?.firstName} ${item?.lastName}`}
                            </Link>
                          </td>

                          <td
                            class="cell100 column4"
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
                            {item?.contact
                              ? ReturnFormatedNumber(item?.contact)
                              : "----"}
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "15%", textAlign: "left" }}>
                            {item?.role?.join(", ")}
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "15%", textAlign: "left" }}>
                            {item?.city ? item?.city : "----"}
                          </td>

                          <td class="cell100 column5" style={{ width: "10%" }}>
                            {item?.leadInterested?.length}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <NoData text={"No Reports Found"} />
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
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
      <ReportsFilterModal
        show={isModalOpen == "filter"}
        setShow={() => setIsModalOpen("")}
        cities={allCities}
        onClick={async (e) => {
          setPage(1);
          await getAllData(e);
          setIsModalOpen("");
        }}
        isApiCall={loading}
      />
      {isModalOpen == "send" && (
        <SelectEmailTemplateForReportsModal
          show={isModalOpen == "send"}
          setShow={() => setIsModalOpen("")}
          handleSubmit={handleSendMail}
          isLoading={isSubmitting == "sending"}
        />
      )}
    </>
  );
};

export default Interests;
