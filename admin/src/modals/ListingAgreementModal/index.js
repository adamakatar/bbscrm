import moment from "moment";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input/Input";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ListingAgreementModal.module.css";

const ListingAgreementModal = ({
  show,
  setShow,
  handleSubmit,
  preFetchedData,
}) => {
  const [sba, setSba] = useState(null);
  const [cash, setCash] = useState(null);
  const [isSellerAgency, setIsSellerAgency] = useState(null);
  const [isTransactionBrokerage, setIsTransactionBrokerage] = useState(null);

  const [other, setOther] = useState("");

  const [pdfFields, setPdfFields] = useState({
    dba_business_tradename: "",
    start_date: "",
    end_date: "",
    total_purchase_percent: "",
    total_purchase_price: "",
    asking_price_of_cre: "",
    earnest_money: "",
    leased_items_transaction: "",
    price_exclusions: "",
    existing_monetary: "",
    seller_info: "",
    additional_provisions: "",
    current_date: "",
    // prefetched
    askng_business_price: preFetchedData?.askng_business_price.toString(),
    asking_plus_inventory_price:
      preFetchedData?.asking_plus_inventory_price.toString(),
  });

  const pdfSubmit = async () => {
    if (sba?.value == "no" && cash?.value == "no" && other == "") {
      return toast.error("Please fill all other field!");
    }
    for (let key in pdfFields) {
      if (pdfFields[key] == "" || pdfFields[key] == null) {
        return toast.error("Please fill all the fields!");
      }
    }
    const dropdownObj = {
      is_seller_agency: isSellerAgency?.value,
      is_transaction_brokerage: isTransactionBrokerage?.value,
      sba: sba?.value,
      cash: cash?.value,
    };
    for (let key in dropdownObj) {
      if (dropdownObj[key] == "" || dropdownObj[key] == null) {
        return toast.error("Please fill all the fields!");
      }
    }
    await handleSubmit({
      ...pdfFields,
      ...dropdownObj,
      other,
      asking_price_of_cre: Number(
        pdfFields?.asking_price_of_cre
      )?.toLocaleString(),
      askng_business_price: Number(
        pdfFields?.askng_business_price
      )?.toLocaleString(),
      asking_plus_inventory_price: Number(
        pdfFields?.asking_plus_inventory_price
      )?.toLocaleString(),
      total_purchase_price: Number(
        pdfFields?.total_purchase_price
      )?.toLocaleString(),
      earnest_money: Number(pdfFields?.earnest_money)?.toLocaleString(),
      start_date: moment(pdfFields?.start_date).format("MM-DD-YYYY"),
      end_date: moment(pdfFields?.end_date).format("MM-DD-YYYY"),
      current_date: moment(pdfFields?.current_date).format("MM-DD-YYYY"),
    });
    setShow(false);
  };

  const dropDownOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];
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
          <Col md={6} className={classes.formCol}>
            <DropDown
              label={"Seller Agency"}
              options={dropDownOptions}
              placeholder={"Seller Agency"}
              value={isSellerAgency}
              setter={setIsSellerAgency}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <DropDown
              label={"Transaction Brokerage"}
              options={dropDownOptions}
              placeholder={"Transaction Brokerage"}
              value={isTransactionBrokerage}
              setter={setIsTransactionBrokerage}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.dba_business_tradename}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  dba_business_tradename: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Business Tradename"}
              label={"Business Tradename"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.start_date}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  start_date: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Start Date"}
              label={"Start Date"}
              type={"date"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.end_date}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  end_date: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"End Date"}
              label={"End Date"}
              type={"date"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.total_purchase_percent}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  total_purchase_percent: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Commission %"}
              label={"Commission %"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.total_purchase_price}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  total_purchase_price: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Commission $"}
              label={"Commission $"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.asking_price_of_cre}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  asking_price_of_cre: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Cre Asking Price"}
              label={"Cre Asking Price"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.askng_business_price}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  askng_business_price: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Business Asking Price"}
              label={"Business Asking Price"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.asking_plus_inventory_price}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  asking_plus_inventory_price: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Inventory Price"}
              label={"Inventory Price"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <DropDown
              label={"Cash"}
              options={dropDownOptions}
              placeholder={"Cash"}
              value={cash}
              setter={setCash}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <DropDown
              label={"SBA"}
              options={dropDownOptions}
              placeholder={"SBA"}
              value={sba}
              setter={setSba}
            />
          </Col>

          <Col md={6} className={classes.formCol}>
            <Input
              value={other}
              setter={setOther}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Other"}
              label={"Other"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.earnest_money}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  earnest_money: e,
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
              value={pdfFields?.leased_items_transaction}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  leased_items_transaction: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Leased Items"}
              label={"Leased Items"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.price_exclusions}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  price_exclusions: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Exclusions"}
              label={"Exclusions"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.existing_monetary}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  existing_monetary: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Monetary Encumbrances"}
              label={"Monetary Encumbrances"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.seller_info}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  seller_info: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Landlord Name"}
              label={"Landlord Name"}
            />
          </Col>
          {/*  */}
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.additional_provisions}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  additional_provisions: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Additional Provisions"}
              label={"Additional Provisions"}
            />
          </Col>
          <Col md={6} className={classes.formCol}>
            <Input
              value={pdfFields?.current_date}
              setter={(e) => {
                setPdfFields((prev) => ({
                  ...prev,
                  current_date: e,
                }));
              }}
              customStyle={{
                borderRadius: "10px",
                border: "none",
              }}
              inputStyle={{ borderColor: "none" }}
              placeholder={"Current Date"}
              label={"Current Date"}
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

export default ListingAgreementModal;
