import moment from "moment";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./PdfAgreementModal.module.css";

const PdfAgreementModal = ({ show, setShow, handleSubmit, temaplateType }) => {
  const [pdfFields, setPdfFields] = useState({
    purchasePrice_manual: "",
    addOn_manual: "",
    pointANumber_manual: "",
    pointADays_manual: "3",
    pointBNumber_manual: "",
    pointCNumber1_manual: "",
    pointCInterest_manual: "",
    pointCNumber2_manual: "",
    pointDNumber_manual: "",
    ...(temaplateType == "liquor" && {
      lastNumberOfPara1_manual: "",
    }),
    pointADay_manual: "30 days after MEC",
    pointAYear_manual: "10 years",
    pointBDay_manual:
      "3 days after Buyer's receipt of a new lease or lease assignment",
    pointDDay_manual: "30 days after MEC",
    inspectionDeadlineDay_manual: "2 days after Inspection Deadline",
    inspectionResolutionDay_manual:
      "2 days after Inspection Objection Deadline",
    inspectionTerminationDay_manual:
      "2 days after Inspection Resolution Deadline",
    pointEYear_manual: "3 years",
    closingDate: "",
    assignmentOfContractday_manual: "5",
    afterClosing_manual:
      "After Closing: 2 weeks in-person training, not to exceed 40 hours per week",
    survivalWarrantyDay_manual: "10",
    closingYear_manual: "",
    buyerCompanyName_manual: "(TBD CORP/LLC)",
    sellerAcceptanceDay_manual: "",
    seller_desgination: "", //newly added not coming from
    ...(temaplateType == "liquor" && {
      mileRadius: "5 miles",
    }),
    mileRadiusYears: "5 years",
    estimatedClosingDate: "",
    timeOfEssenceDays: "3",
    disclosureBroker: "Broker",
    disclosureBrokerType: "Transactional Broker",
  });

  const pdfSubmit = async () => {
    /*
    for (let key in pdfFields) {
      if (pdfFields[key] == "") {
        return toast.error("Please fill all the fields!");
      }
    } */
    await handleSubmit({
      ...pdfFields,
      purchasePrice_manual: Number(
        pdfFields?.purchasePrice_manual
      )?.toLocaleString(),
      addOn_manual: Number(pdfFields?.addOn_manual)?.toLocaleString(),
      pointANumber_manual: Number(
        pdfFields?.pointANumber_manual
      )?.toLocaleString(),
      pointBNumber_manual: Number(
        pdfFields?.pointBNumber_manual
      )?.toLocaleString(),
      pointCNumber1_manual: Number(
        pdfFields?.pointCNumber1_manual
      )?.toLocaleString(),
      pointDNumber_manual: Number(
        pdfFields?.pointDNumber_manual
      )?.toLocaleString(),
      closingDate: moment(pdfFields?.closingDate).format("MM-DD-YYYY"),
      estimatedClosingDate: moment(pdfFields?.estimatedClosingDate).format(
        "MM-DD-YYYY"
      ),
      closingYear_manual: moment(pdfFields?.closingYear_manual).format(
        "MM-DD-YYYY"
      ),
      sellerAcceptanceDay_manual: moment(
        pdfFields?.sellerAcceptanceDay_manual
      ).format("MM-DD-YYYY"),
      seller_desgination: moment(pdfFields?.seller_desgination).format(
        "MM-DD-YYYY"
      ),
    });
    setShow(false);
  };

  return (
    <>
      <style>{`
        .modal-body{
            height: 600px;
            overflow-y: scroll;
        }
    `}</style>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        borderRadius="20px"
        width="800px"
        borderLine={false}
        header={"Send APA Agreement"}>
        <Row>
          <Col md={12}>
            <h5 className={classes.sectionHeader}>Section 1</h5>
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.purchasePrice_manual}
              setter={(e) => {
                setPdfFields((prev) => ({ ...prev, purchasePrice_manual: e }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Purchase Price"}
              label={"Purchase Price"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.addOn_manual}
              setter={(e) => {
                setPdfFields((prev) => ({ ...prev, addOn_manual: e }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Inventory"}
              label={"Inventory"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.pointANumber_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  pointANumber_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Earnest Money"}
              label={"Earnest Money"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.pointADays_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  pointADays_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Earnest Money Deposit Deadline"}
              label={"Earnest Money Deposit Deadline"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.pointBNumber_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  pointBNumber_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Cash at Closing"}
              label={"Cash at Closing"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.pointCNumber1_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  pointCNumber1_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Seller Carry Amount"}
              label={"Seller Carry Amount"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.pointCInterest_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  pointCInterest_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Interest Rate"}
              label={"Interest Rate"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.pointCNumber2_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  pointCNumber2_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Term"}
              label={"Term"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.pointDNumber_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  pointDNumber_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Loan Amount"}
              label={"Loan Amount"}
            />
          </Col>
          {temaplateType == "liquor" && (
            <Col md={6} className={classes.formCol}>
              <Input
                value={pdfFields?.lastNumberOfPara1_manual}
                setter={(e) => {
                  setPdfFields((prev) => ({
                    ...prev,
                    lastNumberOfPara1_manual: e,
                  }));
                }}
                customStyle={{
                  borderRadius: "10px",
                  border: "none",
                }}
                inputStyle={{ borderColor: "none" }}
                placeholder={"Inventory Margin %"}
                label={"Inventory Margin %"}
              />
            </Col>
          )}
          <Col md={12}>
            <h5 className={classes.sectionHeader}>Section 4</h5>
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.pointADay_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  pointADay_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Lease Assignment Deadline"}
              label={"Lease Assignment Deadline"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.pointAYear_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  pointAYear_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Minimum Lease Term*"}
              label={"Minimum Lease Term*"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.pointBDay_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  pointBDay_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              labelStyle={{ textTransform: "none" }}
              placeholder={"Required License(s) Application Deadline"}
              label={"Required License(s) Application Deadline"}
              inputClass={classes.customInputClass}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.pointDDay_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  pointDDay_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Inspection Deadline"}
              label={"Inspection Deadline"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.inspectionDeadlineDay_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  inspectionDeadlineDay_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Inspection Objection Deadline"}
              label={"Inspection Objection Deadline"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.inspectionResolutionDay_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  inspectionResolutionDay_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Inspection Resolution Deadline"}
              label={"Inspection Resolution Deadline"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.inspectionTerminationDay_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  inspectionTerminationDay_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Inspection Termination Deadline"}
              label={"Inspection Termination Deadline"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.pointEYear_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  pointEYear_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Past Financial Statements"}
              label={"Past Financial Statements"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.closingDate}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  closingDate: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Closing Date"}
              label={"Closing Date"}
              type={"date"}
            />
          </Col>
          <Col md={12}>
            <h5 className={classes.sectionHeader}>Section 6</h5>
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.assignmentOfContractday_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  assignmentOfContractday_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Assignment Of Contracts"}
              label={"Assignment Of Contracts"}
            />
          </Col>

          <Col md={12}>
            <h5 className={classes.sectionHeader}>Section 15</h5>
          </Col>
          {temaplateType == "liquor" && (
            <Col md={6} className={classes.formCol}>
              <Input
                value={pdfFields?.mileRadius}
                setter={(e) => {
                  setPdfFields((prev) => ({
                    ...prev,
                    mileRadius: e,
                  }));
                }}
                customStyle={{
                  borderRadius: "10px",
                  border: "none",
                }}
                inputStyle={{ borderColor: "none" }}
                placeholder={"Non-Compete Radius"}
                label={"Non-Compete Radius"}
              />
            </Col>
          )}
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.mileRadiusYears}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  mileRadiusYears: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Non-Compete Term"}
              label={"Non-Compete Term"}
            />
          </Col>
          <Col md={12}>
            <h5 className={classes.sectionHeader}>Section 16</h5>
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.estimatedClosingDate}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  estimatedClosingDate: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Estimated Closing Date"}
              label={"Estimated Closing Date"}
              type={"date"}
            />
          </Col>
          <Col md={12}>
            <h5 className={classes.sectionHeader}>Section 19</h5>
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.timeOfEssenceDays}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  timeOfEssenceDays: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Time Of Essence"}
              label={"Time Of Essence"}
            />
          </Col>
          <Col md={12}>
            <h5 className={classes.sectionHeader}>Section 21</h5>
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.afterClosing_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  afterClosing_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Buyer Training"}
              label={"Buyer Training"}
            />
          </Col>
          <Col md={12}>
            <h5 className={classes.sectionHeader}>Section 24</h5>
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.disclosureBroker}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  disclosureBroker: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Broker Disclosure"}
              label={"Broker Disclosure"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.disclosureBrokerType}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  disclosureBrokerType: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Broker Disclosure Type"}
              label={"Broker Disclosure Type"}
            />
          </Col>

          <Col md={12}>
            <h5 className={classes.sectionHeader}>Section 27</h5>
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.survivalWarrantyDay_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  survivalWarrantyDay_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Survival Warranty Written Notice"}
              label={"Survival Warranty Written Notice"}
            />
          </Col>
          <Col md={12}>
            <h5 className={classes.sectionHeader}>Section 28</h5>
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.closingYear_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  closingYear_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Acceptance Deadline"}
              label={"Acceptance Deadline"}
              type={"date"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.buyerCompanyName_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  buyerCompanyName_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Buyer Company Name"}
              label={"Buyer Company Name"}
            />
          </Col>
          <Col md={12}>
            <h5 className={classes.sectionHeader}>Section 29</h5>
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.sellerAcceptanceDay_manual}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  sellerAcceptanceDay_manual: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Seller Acceptance Date"}
              label={"Seller Acceptance Date"}
              type={"date"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.seller_desgination}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  seller_desgination: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Listing Agreement Date"}
              label={"Listing Agreement Date"}
              type={"date"}
            />
          </Col>
          <Col md={12} className={classes.BtnCol}>
            <Button label={"Submit"} onClick={pdfSubmit} />
          </Col>
        </Row>
      </ModalSkeleton>
    </>
  );
};

export default PdfAgreementModal;
