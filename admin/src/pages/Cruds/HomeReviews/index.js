import React, { useEffect } from "react";
import classes from "./HomeReviews.module.css";
import {
    apiHeader,
    BaseURL,
    recordsLimit,
} from "../../../config/apiUrl";
import { Delete, Get, Patch, Post } from "../../../Axios/AxiosFunctions";
import { useState } from "react";
import { Button } from "../../../Component/Button/Button";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import PaginationComponent from "../../../Component/PaginationComponent";
import TableSkeleton from "../../../Component/TableSkeleton";
import { useSelector } from "react-redux";
import NoData from "../../../Component/NoData/NoData";
import moment from "moment";
import AddOrUpdateReviewModal from "../../../modals/AddOrUpdateReviewModal";
import { toast } from "react-toastify";
import AreYouSureModal from "../../../modals/AreYouSureModal";;

const HomeReviews = () => {

    const accessToken = useSelector((state) => state?.authReducer?.access_token);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [selectedItem, setSelectedItem] = useState(null);
    // For ADD, UPDATE and DELETE
    const [isUpdating, setIsUpdating] = useState("");
    const [isOpenModal, setIsOpenModal] = useState("");

    const getAllReviews = async () => {
        const url = BaseURL(
            `reviews?page=${page}&limit=${recordsLimit}`
        );
        setLoading(true);
        const response = await Get(url, accessToken);
        if (response !== undefined) {
            setData(response?.data?.data);
            setTotalPages(response?.data?.totalCount);
        }
        setLoading(false);
    };
    const createReview = async (e) => {
        const url = BaseURL(`reviews`);
        setIsUpdating("add");
        const response = await Post(url, e, apiHeader(accessToken));
        if (response !== undefined) {
            setData([...data, response?.data]);
            toast.success("Review created successfully");
            setIsUpdating("");
            setIsOpenModal("");
        } else {
            setIsUpdating("");
        }
    };
    const updateReview = async (e) => {
        const url = BaseURL(`reviews/${selectedItem?._id}`);
        setIsUpdating("edit");
        let params = {
            ...e
        }
        const response = await Patch(url, params, apiHeader(accessToken));
        if (response !== undefined) {
            const newData = [...data];
            newData?.splice(
                newData?.findIndex((item) => item?._id == response?.data?._id),
                1,
                response?.data
            );
            setData(newData);
            toast.success("Review updated successfully");
            setIsUpdating("");
            setIsOpenModal("");
        } else {
            setIsUpdating("");
        }
    };

    const deleteFaq = async (e) => {
        const url = BaseURL(`reviews/${selectedItem?._id}`);
        setIsUpdating("delete");
        const response = await Delete(url, null, apiHeader(accessToken));
        if (response !== undefined) {
            const newData = [...data];
            newData?.splice(
                newData?.findIndex((item) => item?._id == response?.data?._id),
                1
            );
            setData(newData);
            toast.success("Review deleted successfully");
            setIsUpdating("");
            setIsOpenModal("");
        } else {
            setIsUpdating("");
        }
    };

    useEffect(() => {
        getAllReviews();
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
                        <h4>Reviews</h4>
                        <Button
                            label="Add Review"
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
                                            style={{ width: "5%", textAlign: "left" }}
                                        >
                                            S.No
                                        </th>
                                        <th
                                            class="cell100 column2"
                                            style={{ width: "20%", textAlign: "left" }}
                                        >
                                            Title
                                        </th>
                                        <th
                                            class="cell100 column4"
                                            style={{ width: "20%", textAlign: "left" }}
                                        >
                                            Description
                                        </th>
                                        <th
                                            class="cell100 column4"
                                            style={{ width: "15%", textAlign: "left" }}
                                        >
                                            User Name
                                        </th>
                                        <th
                                            class="cell100 column4"
                                            style={{ width: "10%", textAlign: "left" }}
                                        >
                                            User Type
                                        </th>
                                        <th
                                            class="cell100 column3"
                                            style={{ width: "10%", textAlign: "left" }}
                                        >
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
                            <TableSkeleton rowsCount={recordsLimit} colsCount={7} />
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
                                                    }}
                                                >
                                                    <td
                                                        class="cell100 column1"
                                                        style={{ width: "5%", textAlign: "left" }}
                                                    >
                                                        {index + 1}
                                                    </td>
                                                    <td
                                                        class="cell100 column2"
                                                        style={{
                                                            width: "20%",
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        {item?.title}
                                                    </td>

                                                    <td
                                                        class={`cell100 column4`}
                                                        style={{ width: "20%", textAlign: "left" }}
                                                    >
                                                        <p className={classes.textOverflow2}>
                                                            {item?.description}
                                                        </p>

                                                    </td>
                                                    <td
                                                        class="cell100 column4"
                                                        style={{ width: "15%", textAlign: "left" }}
                                                    >
                                                        {item?.userName}
                                                    </td>
                                                    <td
                                                        class="cell100 column4"
                                                        style={{ width: "10%", textAlign: "left" }}
                                                    >
                                                        {item?.role}
                                                    </td>
                                                    <td
                                                        class="cell100 column4"
                                                        style={{ width: "10%", textAlign: "left" }}
                                                    >
                                                        {moment(item?.createdAt).format(
                                                            "DD MMM YYYY hh:mm"
                                                        )}
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
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <NoData text={"No Reviews Found"} />
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
                {isOpenModal == "add" && <AddOrUpdateReviewModal
                    show={isOpenModal == "add"}
                    setShow={() => setIsOpenModal("")}
                    isLoading={isUpdating == "add"}
                    handleSubmit={createReview}
                />}
                <AddOrUpdateReviewModal
                    show={isOpenModal == "edit"}
                    setShow={() => setIsOpenModal("")}
                    isLoading={isUpdating == "edit"}
                    data={selectedItem}
                    handleSubmit={updateReview}
                />
                <AreYouSureModal
                    subTitle={`Do you want to delete this review?`}
                    show={isOpenModal == "delete"}
                    setShow={() => setIsOpenModal("")}
                    onClick={deleteFaq}
                    isApiCall={isUpdating == "delete"}
                />
            </SideBarSkeleton>
        </>
    );
};

export default HomeReviews;
