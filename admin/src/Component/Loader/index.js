import React from "react";
import Spinner from 'react-bootstrap/Spinner';
import classes from "./loader.module.css";

export default function Loader({ className }) {
  return (
    <>
      <div className={`${classes.loaderContainer} ${className && className}`}>
        <div className={classes.loaderBox}>
          <Spinner animation="grow" className={classes.loader} />
          <Spinner animation="grow" className={classes.loader} />
          <Spinner animation="grow" className={classes.loader} />
        </div>
      </div>
    </>
  );
};

