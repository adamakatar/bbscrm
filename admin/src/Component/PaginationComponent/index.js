import React from "react";
import Pagination from "@mui/material/Pagination";

const PaginationComponent = ({ totalPages, currentPage, setCurrentPage }) => {
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <>
      <style>{`
        .MuiPagination-ul li .Mui-selected {
            background: var(--dashboard-main-color) !important;
            color: var(--white-color) !important;
            font-size:16px !important;
            min-width: 28px !important;
            height: 28px !important;
            font-family:"Open-Sans-semiBold" !important;
        }
        .MuiPagination-ul li button {
            color: var(--dashboard-text-color) !important;
            font-size:16px !important;
            font-family:"Open-Sans-semiBold" !important;
        }
    `}</style>
      <div>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChange}
          shape="rounded"
        />
      </div>
    </>
  );
};

export default PaginationComponent;
