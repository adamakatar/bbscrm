import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { Get } from "../../../Axios/AxiosFunctions";
import Loader from "../../../Component/Loader";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import { BaseURL, ReturnFormatedNumber } from "../../../config/apiUrl";
import classes from "./PrefferedBusinessDetail.module.css";

const PrefferedBusinessDetail = () => {
  const id = useParams()?.id;
  const accessToken = useSelector((state) => state?.authReducer?.access_token);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDetail = async () => {
    const url = BaseURL(`valuation/${id}`);
    setLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setData(response?.data?.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    getDetail();
  }, []);
  return (
    <>
      <SideBarSkeleton>
        <div className={classes.mainContainer}>
          {loading ? (
            <Loader />
          ) : (
            <>
              <h4>Preffered Business Detail</h4>
              <Row className={classes.mainRow}>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Name</p>
                    <p className={classes.text}>
                      {data?.firstName + " " + data?.lastName}
                    </p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Email</p>
                    <p className={`${classes.text} ${classes.emailText}`}>
                      <p
                        className={"ellipsis1Line emailLink"}
                        title={data?.email}>
                        {data?.email}
                      </p>
                    </p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>City</p>
                    <p className={classes.text}>{data?.city}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Contact</p>
                    <p className={classes.text}>
                      {ReturnFormatedNumber(data?.contact)}
                    </p>
                  </div>
                </Col>
                {/* 2row */}
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Accounts Payable</p>
                    <p className={classes.text}>${data?.accountsPayable}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Cash Range</p>
                    <p className={classes.text}>${data?.cashRange}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Business Assistance</p>
                    <p className={classes.text}>{data?.businessAssistance}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Business Equity</p>
                    <p className={classes.text}>${data?.businessEquity}</p>
                  </div>
                </Col>
                {/* row3 */}
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Credit Score</p>
                    <p className={classes.text}>${data?.creditScore}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Current Business</p>
                    <p className={classes.text}>{data?.currentBusiness}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Home Equity</p>
                    <p className={classes.text}>${data?.homeEquity}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Liabilites Net Worth</p>
                    <p className={classes.text}>${data?.liabilitesNetWorth}</p>
                  </div>
                </Col>
                {/* row4 */}
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Looking For Business</p>
                    <p className={classes.text}>{data?.lookingForBusiness}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Mortgage</p>
                    <p className={classes.text}>${data?.mortgage}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Net Worth</p>
                    <p className={classes.text}>${data?.netWorth}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Other Assets</p>
                    <p className={classes.text}>${data?.otherAssets}</p>
                  </div>
                </Col>
                {/* row5 */}
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Other Liabilities</p>
                    <p className={classes.text}>${data?.otherLiabilities}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Other Mortgages</p>
                    <p className={classes.text}>${data?.otherMortgages}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Owned Business</p>
                    <p className={classes.text}>{data?.ownedBusiness}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Payables</p>
                    <p className={classes.text}>${data?.payables}</p>
                  </div>
                </Col>
                {/* row6 */}
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Plan Paying Purchase</p>
                    <p className={classes.text}>{data?.planPayingPurchase}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Plan Purchasing Business</p>
                    <p className={classes.text}>
                      {data?.planPurchasingBusiness}
                    </p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Postal Code</p>
                    <p className={classes.text}>{data?.postalCode}</p>
                  </div>
                </Col>
                {/* row7 */}
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Retirement Funds</p>
                    <p className={classes.text}>${data?.retirementFunds}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Spouse Name</p>
                    <p className={classes.text}>
                      {data?.spouseName ? data?.spouseName : "Not Added"}
                    </p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>state</p>
                    <p className={classes.text}>{data?.state}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Street Address</p>
                    <p className={classes.text}>{data?.streetAddress}</p>
                  </div>
                </Col>
                {/* row8 */}
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Street Address2</p>
                    <p className={classes.text}>
                      {data?.streetAddress2
                        ? data?.streetAddress2
                        : "Not Added"}
                    </p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Total Assets</p>
                    <p className={classes.text}>${data?.totalAssets}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Total Cash</p>
                    <p className={classes.text}>${data?.totalCash}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Total Equity</p>
                    <p className={classes.text}>${data?.totalEquity}</p>
                  </div>
                </Col>
                {/* row9 */}
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Total Liabilities</p>
                    <p className={classes.text}>${data?.totalLiabilities}</p>
                  </div>
                </Col>
                <Col md={4} xl={3} sm={6}>
                  <div className={classes.viewContactMain}>
                    <p className={classes.mainHead}>Total Stock</p>
                    <p className={classes.text}>${data?.totalStock}</p>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </div>
      </SideBarSkeleton>
    </>
  );
};

export default PrefferedBusinessDetail;
