import React, { useEffect } from "react";
import classes from "./ServicesCrud.module.css";
import { apiHeader, BaseURL, recordsLimit } from "../../../config/apiUrl";
import { Delete, Get, Patch, Post } from "../../../Axios/AxiosFunctions";
import { useState } from "react";
import { Button } from "../../../Component/Button/Button";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import PaginationComponent from "../../../Component/PaginationComponent";
import TableSkeleton from "../../../Component/TableSkeleton";
import { useSelector } from "react-redux";
import NoData from "../../../Component/NoData/NoData";
import AddServiceModal from "../../../Component/AddServiceModal";
import { toast } from "react-toastify";
import AreYouSureModal from "../../../modals/AreYouSureModal";
import moment from "moment";
import { DropDown } from "../../../Component/DropDown/DropDown";

const ServicesCrud = () => {
  const accessToken = useSelector((state) => state?.authReducer?.access_token);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditIndex, setIsEditIndex] = useState(null);
  const [isDeletting, setIsDeleting] = useState(false);

  const [filterType, setFilterType] = useState({ label: "All", value: "all" });

  const getAllData = async (pg = page, filter = filterType?.value) => {
    const url = BaseURL(
      `services/?page=${pg}&limit=${recordsLimit}&type=${filter}`
    );
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setData(response?.data?.data?.data);
      setTotalPages(Math.ceil(response?.data?.data?.totalCount / recordsLimit));
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllData();
  }, [page]);

  const handleAddorEditService = async (params) => {
    const apiUrl = BaseURL(selectedItem ? "services/update" : "services");

    for (var key in params) {
      if (params[key] == "" || params[key] == null)
        return toast.warn(`Please fill ${key}`);
    }
    const formData = new FormData();
    for (var key in params) {
      formData.append(key, params[key]);
    }

    setSubmitLoading(true);
    const apiCall = selectedItem ? Patch : Post;
    const response = await apiCall(apiUrl, formData, apiHeader(accessToken));
    if (response !== undefined) {
      if (selectedItem) {
        data.splice(isEditIndex, 1, response?.data?.data);
      } else {
        setData((prev) => [response?.data?.data, ...prev]);
      }
      setShow(false);
      toast.success(
        `Service ${selectedItem ? "edited" : "added"} successfully.`
      );
    }
    setSubmitLoading(false);
  };

  async function deleteService() {
    const url = BaseURL(`services/delete/${selectedItem?._id}`);
    setSubmitLoading(true);
    const response = await Delete(url, null, apiHeader(accessToken));
    if (response !== undefined) {
      const newData = [...data];
      newData.splice(
        newData.findIndex((item) => item?._id == selectedItem._id),
        1
      );
      setData(newData);
      toast.success("Service delete successfully");
      setIsDeleting(false);
    }
    setSubmitLoading(false);
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
            <h4 className={classes.heading}>All Services</h4>
            <DropDown
              value={filterType}
              customStyle={{ minWidth: "150px" }}
              setter={(e) => {
                setPage(1);
                setFilterType(e);
                getAllData(1, e?.value);
              }}
              options={[
                { label: "All", value: "all" },
                { label: "Home", value: "home" },
                { label: "Services", value: "services" },
              ]}
            />
          </div>
          <div class="table100 ver1 m-b-110">
            <div class="table100-head">
              <table>
                <thead>
                  <tr class="row100 head">
                    <th
                      class="cell100 column1"
                      style={{ width: "5%", textAlign: "left" }}>
                      S.No
                    </th>
                    <th
                      class="cell100 column1"
                      style={{ width: "25%", textAlign: "left" }}>
                      Title
                    </th>

                    <th
                      class="cell100 column2"
                      style={{ width: "15%", textAlign: "left" }}>
                      Type
                    </th>
                    <th
                      class="cell100 column2"
                      style={{ width: "10%", textAlign: "left" }}>
                      Order
                    </th>
                    <th
                      class="cell100 column2"
                      style={{ width: "20%", textAlign: "left" }}>
                      Created At
                    </th>
                    <th
                      class="cell100 column2"
                      style={{ width: "25%", textAlign: "left" }}>
                      Action
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            {loading ? (
              <TableSkeleton rowsCount={recordsLimit} colsCount={5} />
            ) : (
              <div class="table100-body js-pscroll ps ps--active-y">
                <table>
                  <tbody>
                    {data?.length > 0 ? (
                      data?.map((item, index) => (
                        <tr class="row100 body">
                          <td
                            class="cell100 column1"
                            style={{ width: "5%", textAlign: "left" }}>
                            {index + 1 + (page - 1) * recordsLimit}
                          </td>
                          <td
                            class="cell100 column1"
                            style={{ width: "25%", textAlign: "left" }}>
                            {item?.title}
                          </td>

                          <td
                            class="cell100 column2"
                            style={{ width: "15%", textAlign: "left" }}>
                            {item?.type}
                          </td>
                          <td
                            class="cell100 column2"
                            style={{ width: "10%", textAlign: "center" }}>
                            {item?.order}
                          </td>
                          <td
                            class="cell100 column2"
                            style={{ width: "20%", textAlign: "left" }}>
                            {moment(item?.createdAt).format(
                              "DD MMM YYYY hh:mm"
                            )}
                          </td>

                          <td
                            class="cell100 column5"
                            style={{ width: "25%", textAlign: "left" }}>
                            <div className={classes.actions_btn}>
                              <Button
                                onClick={() => {
                                  setIsEditIndex(index);
                                  setSelectedItem(item);
                                  setShow(true);
                                }}
                                className={classes.edit_btn}
                                label={"Edit"}
                              />
                              <Button
                                onClick={() => {
                                  setIsEditIndex(index);
                                  setSelectedItem(item);
                                  setIsDeleting(true);
                                }}
                                className={classes.detail_btn}
                                label={"Delete"}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <NoData text={"No Services Found"} />
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

          <AddServiceModal
            isEdit={selectedItem}
            handleSubmit={handleAddorEditService}
            show={show}
            setShow={setShow}
            isLoading={submitloading}
          />
          <AreYouSureModal
            subTitle={`Do you want to delete this service?`}
            show={isDeletting}
            setShow={setIsDeleting}
            onClick={deleteService}
            isApiCall={submitloading}
          />
        </div>
      </SideBarSkeleton>
    </>
  );
};

export default ServicesCrud;
