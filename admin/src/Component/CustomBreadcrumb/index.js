import React from "react";
import { Breadcrumb } from "react-bootstrap";
import classes from "./CustomBreadCrumb.module.css";

function CustomBreadcrumb({ data, onClick, active }) {
  return (
    <>
      <style>{`
        .breadcrumb-item.active{
            color:var(--main-color) !important;
        }
    `}</style>
      <Breadcrumb className={[classes.BreadcrumbMainDiv].join(" ")}>
        {data?.map((item, i) => (
          <Breadcrumb.Item
            key={i}
            active={active == item?.id}
            onClick={() => onClick(item?.id)}
          >
            {item?.title}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </>
  );
}

export default CustomBreadcrumb;
