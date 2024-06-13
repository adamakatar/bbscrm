import React, { useEffect } from "react";
import classes from "./CoreValues.module.css";
import { apiHeader, BaseURL, recordsLimit } from "../../../config/apiUrl";
import { Delete, Get, Patch, Post } from "../../../Axios/AxiosFunctions";
import { useState } from "react";
import { Button } from "../../../Component/Button/Button";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import PaginationComponent from "../../../Component/PaginationComponent";
import TableSkeleton from "../../../Component/TableSkeleton";
import { useSelector } from "react-redux";
import NoData from "../../../Component/NoData/NoData";
import { toast } from "react-toastify";
import AreYouSureModal from "../../../modals/AreYouSureModal";
import AddorUpdateCoreValueModal from "../../../modals/AddorUpdateCoreValueModal";
import moment from "moment";
import parse from "html-react-parser";
import ViewCoreValueDetailModal from "../../../modals/ViewCoreValueDetailModal";

const CoreValues = () => {
  const accessToken = useSelector((state) => state?.authReducer?.access_token);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  // For ADD, UPDATE and DELETE
  const [isUpdating, setIsUpdating] = useState("");
  const [isOpenModal, setIsOpenModal] = useState("");
  // view detail modal
  const [isDetailModal, setIsDetailModal] = useState(false);

  const getAllMembers = async () => {
    const url = BaseURL(
      `core-values/admin/all?page=${page}&limit=${recordsLimit}`
    );
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setData(response?.data?.data);
      setTotalPages(response?.data?.totalCount);
    }
    setLoading(false);
  };
  const createMember = async (e) => {
    const url = BaseURL(`core-values/create`);
    setIsUpdating("add");
    const response = await Post(url, e, apiHeader(accessToken));
    if (response !== undefined) {
      setData([...data, response?.data]);
      toast.success("Cor Value created successfully");
      setIsUpdating("");
      setIsOpenModal("");
    } else {
      setIsUpdating("");
    }
  };
  const updateMember = async (e) => {
    const url = BaseURL(`core-values/update`);
    setIsUpdating("edit");
    let params = {
      id: selectedItem?._id,
      ...e,
    };
    const response = await Patch(url, params, apiHeader(accessToken));
    if (response !== undefined) {
      const newData = [...data];
      newData?.splice(
        newData?.findIndex((item) => item?._id == response?.data?._id),
        1,
        response?.data
      );
      setData(newData);
      toast.success("Core Value updated successfully");
      setIsUpdating("");
      setIsOpenModal("");
    } else {
      setIsUpdating("");
    }
  };

  const deleteMember = async (e) => {
    const url = BaseURL(`core-values/delete/${selectedItem?._id}`);
    setIsUpdating("delete");
    const response = await Delete(url, null, apiHeader(accessToken));
    if (response !== undefined) {
      const newData = [...data];
      newData?.splice(
        newData?.findIndex((item) => item?._id == response?.data?._id),
        1
      );
      setData(newData);
      toast.success("Core Value deleted successfully");
      setIsUpdating("");
      setIsOpenModal("");
    } else {
      setIsUpdating("");
    }
  };

  useEffect(() => {
    getAllMembers();
  }, [page]);

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
          <div className={classes.mainHeading}>
            <h4>Core Values</h4>
            <Button
              label="Add Core Value"
              onClick={() => setIsOpenModal("add")}
            />
          </div>
          <div class="table100 ver1 m-b-110">
            <div class="table100-head">
              <table>
                <thead>
                  <tr class="row100 head">
                    <th
                      class="cell100 column1"
                      style={{ width: "10%", textAlign: "left" }}>
                      S.No
                    </th>
                    <th
                      class="cell100 column2"
                      style={{ width: "20%", textAlign: "left" }}>
                      Title
                    </th>
                    <th
                      class="cell100 column4"
                      style={{ width: "25%", textAlign: "left" }}>
                      Description
                    </th>
                    <th
                      class="cell100 column4"
                      style={{ width: "10%", textAlign: "center" }}>
                      Order
                    </th>
                    <th
                      class="cell100 column3"
                      style={{ width: "15%", textAlign: "center" }}>
                      Created At
                    </th>

                    <th class="cell100 column5" style={{ width: "20%" }}>
                      Actions
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
                    {data?.length > 0 ? (
                      data?.map((item, index) => (
                        <tr
                          class="row100 body"
                          style={{
                            backgroundColor:
                              selectedItem?._id == item?._id && "#E5F5FF",
                          }}>
                          <td
                            class="cell100 column1"
                            style={{ width: "10%", textAlign: "left" }}>
                            {index + 1 + (page - 1) * recordsLimit}
                          </td>
                          <td
                            class="cell100 column2"
                            style={{
                              width: "20%",
                              textAlign: "left",
                            }}>
                            {item?.title}
                          </td>

                          <td
                            class="cell100 column4"
                            style={{ width: "25%", textAlign: "left" }}>
                            <p className={[classes.description]}>
                              {parse(`${item?.description}`)}
                            </p>
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "10%", textAlign: "center" }}>
                            {item?.order}
                          </td>
                          <td
                            class="cell100 column4"
                            style={{ width: "15%", textAlign: "center" }}>
                            {moment(item?.createdAt).format("L")}
                          </td>
                          <td class="cell100 column5" style={{ width: "20%" }}>
                            <div className={classes.actions_btn}>
                              <Button
                                className={classes.edit_btn}
                                label={"Edit"}
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsOpenModal("edit");
                                }}
                              />
                              <Button
                                className={classes.detail_btn}
                                label={"Delete"}
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsOpenModal("delete");
                                }}
                              />
                              <Button
                                label={"Detail"}
                                onClick={() => {
                                  setIsDetailModal(true);
                                  setSelectedItem(item);
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <NoData text={"No Core Values Found"} />
                    )}
                  </tbody>
                </table>
              </div>
            )}
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
        {isOpenModal == "add" && (
          <AddorUpdateCoreValueModal
            show={isOpenModal == "add"}
            setShow={() => setIsOpenModal("")}
            isLoading={isUpdating == "add"}
            handleSubmit={createMember}
          />
        )}
        {isOpenModal == "edit" && (
          <AddorUpdateCoreValueModal
            show={isOpenModal == "edit"}
            setShow={() => setIsOpenModal("")}
            isLoading={isUpdating == "edit"}
            data={selectedItem}
            handleSubmit={updateMember}
          />
        )}
        {isOpenModal == "delete" && (
          <AreYouSureModal
            subTitle={`Do you want to delete this faq?`}
            show={isOpenModal == "delete"}
            setShow={() => setIsOpenModal("")}
            onClick={deleteMember}
            isApiCall={isUpdating == "delete"}
          />
        )}
        <ViewCoreValueDetailModal
          show={isDetailModal}
          setShow={setIsDetailModal}
          data={selectedItem}
        />
      </SideBarSkeleton>
    </>
  );
};

export default CoreValues;
