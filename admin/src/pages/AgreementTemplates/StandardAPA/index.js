import React, { useRef, useState } from "react";
import { Logo } from "../../../constant/imagePath";
import classes from "./StandardAPA.module.css";
import { Button } from "../../../Component/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import PdfAgreementModal from "../../../modals/PdfAgreementModal";
import { apiHeader, BaseURL, mediaUrl } from "../../../config/apiUrl";
import { Post } from "../../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { downloadFileFromUrl } from "../../../constant/downloadFile";

const StandardAPA = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state?.authReducer?.access_token);
  const { templatePDF, ...data } = useLocation()?.state;
  const [showModal, setShowModal] = useState(false);
  const [allValues, setAllValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const reportTemplateRef = useRef(null);
  //
  const [pdfDownloadLink, setPdfDownloadLink] = useState(
    templatePDF ? templatePDF : ""
  );

  const tableData = [
    {
      reference: "§ 2.B.i",
      event: "Time of day for deadlines",
      calendarDate: "11:59 PM MTN",
      relativeDate: "",
    },
    {
      reference: "§ 1.A",
      event: "Earnest Money Deposit Deadline",
      calendarDate: "",
      relativeDate: "3 days after MEC",
    },
    {
      reference: "§ 4.A",
      event: "Lease Assignment or New Lease Approval Deadline",
      calendarDate: "",
      relativeDate: "3 days after MEC",
    },
    {
      reference: "§ 4.B",
      event: "Required License(s) Application",
      calendarDate: "",
      relativeDate:
        "3 days after Buyer’s receipt of a new lease or lease assignment",
    },
    {
      reference: "§ 4.D",
      event: "Inspection Deadline",
      calendarDate: "",
      relativeDate: "3 days after MEC",
    },
    {
      reference: "§ 4.D.i",
      event: "Inspection Objection Deadline",
      calendarDate: "",
      relativeDate: "2 days after Inspection Deadline",
    },
    {
      reference: "§ 4.D.ii",
      event: "Inspection Resolution Deadline",
      calendarDate: "",
      relativeDate: "2 days after Inspection Objection Deadline",
    },
    {
      reference: "§ 4.D.iii",
      event: "Inspection Termination Deadline",
      calendarDate: "",
      relativeDate: "2 days after Inspection Resolution Deadline",
    },
    {
      reference: "§ 4.E",
      event: "Due Diligence Documents Delivery Deadline",
      calendarDate: "",
      relativeDate: "5 days after MEC",
    },
    {
      reference: "§ 4.F.iii",
      event: "Due Diligence Documents Objection Deadline",
      calendarDate: "",
      relativeDate: "7 days after Delivery of Due Diligence Items Deadline",
    },
    {
      reference: "§ 4.F.iv",
      event: "Due Diligence Documents Resolution Deadline",
      calendarDate: "",
      relativeDate: "TBD days after Due Diligence Documents Objection Deadline",
    },
    {
      reference: "§ 4.G",
      event: "New Loan Approval Deadline",
      calendarDate: "",
      relativeDate: "30 days after MEC",
    },
    {
      reference: "§ 14",
      event: "Closing Date",
      calendarDate: `On or before ${allValues?.closingDate}`,
      relativeDate: "",
    },
    {
      reference: "§ 26",
      event: "Acceptance Deadline Date and Time",
      calendarDate: `${allValues?.closingYear_manual}`,
      relativeDate: "",
    },
  ];

  const HandleSetData = (params) => {
    setAllValues(params);
  };

  const sendPdf = async () => {
    const url = BaseURL("leads/send-mail");
    const params = {
      ...data,
      ...allValues,
      templateType: "standard",
    };
    setLoading(true);
    const response = await Post(url, params, apiHeader(token));
    if (response !== undefined) {
      downloadFileFromUrl(
        mediaUrl(response?.data?.data?.template),
        `${data?.buyer_name}-${data?.business_title}-Standard-APA.docx`
      );
      setPdfDownloadLink(response?.data?.data?.template);
      setAllValues(null);
    }
    setLoading(false);
  };

  return (
    <>
      <style>
        {`
            .table100 .table100-head tr{
              background-color:#fff;
              color:#000;
              border-bottom: 1px solid #8eaadb;
              border-radius:0px;
              margin:0px;
            }
            .table100.ver1 th {
              color:#000;
              font-size: 15px;
              font-weight: 600;
            }
            .table100.ver1 .table100-body tr{
              border-bottom: 1px solid #8eaadb;
              box-shadow:none;
              border-radius:0px;
              margin:0px;
            }
            .table100-body{
              max-height: initial;
              overflow: unset;
            }
          `}
      </style>
      <div className={classes.mainContainer} ref={reportTemplateRef}>
        <div className={classes.headerContainer}>
          <div className={classes.logoDiv}>
            <img src={Logo} alt="..." />
          </div>
          <div className={classes.btnsContainer}>
            <Button
              label={"Go Back"}
              onClick={() => {
                navigate(-1);
              }}
            />
            <Button
              label={`Edit Agreement`}
              onClick={() => {
                setShowModal(!showModal);
              }}
            />

            {(allValues !== null || pdfDownloadLink !== "") && (
              <Button
                disabled={loading}
                label={loading ? "downloading..." : "Download"}
                onClick={() => {
                  if (allValues !== null) {
                    sendPdf();
                  } else {
                    downloadFileFromUrl(
                      mediaUrl(pdfDownloadLink),
                      `${data?.buyer_name}-${data?.business_title}-Standard-APA.docx`
                    );
                  }
                }}
                customStyle={{
                  marginLeft: 5,
                }}
              />
            )}
          </div>
        </div>

        <em>
          This form has not been approved by the Colorado Real Estate
          Commission. Buyer and Seller are advised to seek legal counsel prior
          to signing.
        </em>
        <div>
          <p align="center">
            <strong></strong>
          </p>
          <p align="center">
            <strong>AGREEMENT FOR SALE AND PURCHASE OF BUSINESS ASSETS</strong>
          </p>
          <p>
            THIS AGREEMENT is made and entered into by and between{" "}
            <strong>{data?.seller_name} ("Seller")</strong> and{" "}
            <strong>
              {data?.buyer_name} {allValues?.buyerCompanyName_manual}
            </strong>{" "}
            and/or Assigns <strong>("Buyer").</strong>
          </p>
          <p>
            WHEREAS, Seller is the owner of a business being operated under the
            name of <strong>{data?.business_title} (the "Business")</strong>{" "}
            located at{" "}
            <strong>{data?.business_address} (the "Premises")</strong>, and
            Seller desires to sell to Buyer substantially all of its assets and
            interest in and to the Business and the Buyer is willing to purchase
            same on the terms and conditions set forth herein;
          </p>
          <p>
            NOW, THEREFORE, in consideration of the premises and the mutual
            promises set forth below, the parties agree as follows:
          </p>
          <p>
            <strong>1. </strong>
            <strong>ASSETS BEING SOLD, SELLING PRICE AND TERMS</strong>
          </p>
          <p>
            Seller shall sell and Buyer shall purchase, free from all
            liabilities and encumbrances, substantially all assets of the
            Business, including all furniture, fixtures and equipment owned by
            Seller and used or useful in the operation of the Business per the
            list to be provided to Buyer; the Business lease of the Premises,
            indoor and outdoor signs, the trade name, transferable licenses,
            telephone numbers, promotional materials, customer goodwill,
            warranties, equipment leases and/or concession agreements or service
            contracts, software and software licenses, all intellectual property
            including trade secrets, patents, copyrights, and all websites and
            email addresses including their contents, and domain names
            (collectively the "Assets") will be transferred to Buyer (unless
            otherwise specified) for the purchase price of ${" "}
            {allValues?.purchasePrice_manual} plus approximately ${" "}
            {allValues?.addOn_manual} in inventory.
            <em>
              The following items are specifically excluded from the sale: all
              accounts receivable and all accounts payable; lease security
              deposit, all utility deposits, cash on hand, bank accounts.
            </em>
          </p>
          <p>The purchase price shall be payable as follows:</p>
          <p>
            A. $ {allValues?.pointANumber_manual} in the form of Buyer's
            personal check/wire transfer to be held by Business Brokerage
            Services, LLC in its TRUST account as earnest money and part payment
            to be deposited within {allValues?.pointADays_manual}
            days of this mutually executed contract (MEC); and
          </p>
          <p>
            B. $ {allValues?.pointBNumber_manual} (adjusted as set forth herein)
            from any combination of Buyer’s personal funds in the form of wire
            transfer or bank cashier's check at the time of closing; and,
          </p>
          <p>
            C. $ {allValues?.pointCNumber1_manual} portion of purchase price to
            be paid to SELLER pursuant to a Secured Promissory Note in said
            amount, with interest at {allValues?.pointCInterest_manual} % per
            annum, amortized over {allValues?.pointCNumber2_manual}
            to be secured by a security agreement and a financing statement as
            provided by the Uniform Commercial Code of Colorado which shall be
            filed with the appropriate State agency.
          </p>
          <p>
            D. $ {allValues?.pointDNumber_manual}
            in the form of an SBA or other loan acceptable to Buyer.
          </p>

          <p>
            <strong>2. </strong>
            <strong>APPLICABILITY AND DEFINITIONS</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            A. <strong>Applicability of Dates and Deadlines</strong>
          </p>
          <p>
            If any deadline blank in §3 (Dates and Deadlines) is left blank or
            completed with "N/A", or the word "Deleted," or lined through, such
            deadline is not applicable and the corresponding provision
            containing the deadline is deleted.
          </p>
          <p>
            B. <strong>Definitions and Computation of Periods</strong>
          </p>
          <p>
            i. <strong>Day. </strong>As used in this Agreement, the term "day"
            means the entire day ending at 11:59 PM, United States Mountain Time
            (Standard or Daylight Savings, as applicable). Except however, if a{" "}
            <strong>Time of Day Deadline </strong>is specified in §3. (Dates and
            Deadlines), all Objection Deadlines, Resolution Deadlines,
            Examination Deadlines and Termination Deadlines will end on the
            specified deadline date at the time of day specified in the
            <strong>Time of Day Deadline</strong>, United States Mountain Time.
            If <strong>Time of Day Deadline </strong>is left blank or "N/A" the
            deadlines will expire at 11:59 PM, United States Mountain Time.
          </p>
          <p>
            ii. <strong>MEC.</strong> Use of the term "MEC" shall mean "Mutually
            Executed Contract," and shall be the date on which the last
            signature or initials of the parties are affixed to this Agreement.
            In addition, the terms "date hereof,” or "date of this Agreement,”
            shall constitute the same and shall be used for calculating the
            times of performance for this Agreement.
          </p>
          <p>
            iii. <strong>Computation of Period of Days. </strong>In computing a
            period of days (e.g., three days after MEC), when the ending date is
            not specified, the first day is excluded and the last day is
            included.
          </p>
          <p>
            iv. <strong>Deadlines. </strong>If any deadline falls on a Saturday,
            Sunday or federal or Colorado state holiday (Holiday), such deadline{" "}
            <strong>Will </strong>be extended to the next day that is not a
            Saturday, Sunday or Holiday.
          </p>
          <p>
            v. <strong>TBD.</strong> Use of the term "TBD" shall mean "To Be
            Determined."
          </p>
          <p>
            vi. <strong>Broker.</strong> Broker shall be defined as Business
            Brokerage Services, LLC, "the Brokerage," including, but not limited
            to any of its partners, officers, associate brokers, directors,
            agents, employees, shareholders, independent contractors, or any
            other person(s) or companies directly representing the Brokerage for
            this Agreement.
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            <strong>3. </strong>
            <strong>DATES AND DEADLINES </strong>
          </p>
          <div class="table100 ver1 m-b-110">
            <div class="table100-head">
              <table>
                <thead>
                  <tr class="row100 head">
                    <th
                      class="cell100 column1"
                      style={{ width: "10%", textAlign: "left" }}>
                      Item No.
                    </th>
                    <th
                      class="cell100 column2"
                      style={{ width: "15%", textAlign: "center" }}>
                      Reference
                    </th>
                    <th
                      class="cell100 column4"
                      style={{ width: "30%", textAlign: "center" }}>
                      Event
                    </th>
                    <th
                      class="cell100 column3"
                      style={{ width: "20%", textAlign: "center" }}>
                      Calendar Date
                    </th>
                    <th
                      class="cell100 column5"
                      style={{ width: "25%", textAlign: "center" }}>
                      Relative Date
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="table100-body js-pscroll ps ps--active-y">
              <table>
                <tbody>
                  {tableData?.map((item, i) => {
                    return (
                      <tr
                        class="row100 body"
                        key={i}
                        className={i % 2 == 0 && classes.tableStrippedColor}>
                        <td
                          class="cell100 column1"
                          style={{ width: "10%", textAlign: "left" }}>
                          {i + 1}
                        </td>
                        <td
                          class="cell100 column1"
                          style={{ width: "15%", textAlign: "left" }}>
                          {item?.reference}
                        </td>
                        <td
                          class="cell100 column1"
                          style={{ width: "30%", textAlign: "left" }}>
                          {item?.event}
                        </td>
                        <td
                          class="cell100 column1"
                          style={{ width: "20%", textAlign: "left" }}>
                          {item?.calendarDate}
                        </td>
                        <td
                          class="cell100 column1"
                          style={{ width: "25%", textAlign: "left" }}>
                          {item?.relativeDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p>
            <strong></strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            <strong>4. </strong>
            <strong>CONTINGENCIES</strong>
          </p>
          <p>
            The closing under this Agreement is specifically contingent upon the
            following:
          </p>
          <p>
            A. On or before {allValues?.pointADay_manual} days the Lease
            Assignment or New Lease Approval Deadline, Buyer shall have received
            a new lease or assignment of lease from the landlord in form and
            substance acceptable to Buyer. The lease shall include the following
            terms: the term of the lease shall be a minimum of{" "}
            {allValues?.pointAYear_manual}
            years, including options. Buyer shall be responsible for the payment
            of any lease preparation or transfer fees required by landlord.
          </p>
          <p>
            B. On or before the date of closing Buyer shall obtain (in
            cooperation with Seller) all necessary State, County and/or City
            licenses and inspection approvals, including temporary liquor permit
            (if applicable). Buyer shall make application for such licenses and
            permits within {allValues?.pointBDay_manual} business days after
            Buyer's receipt of an acceptable lease.
          </p>
          <p>
            C. On or before the Inspection Deadline, Buyer (in cooperation with
            Seller) shall have the Premises inspected by the health, building
            and fire departments of the appropriate city and/or county and
            approved without conditions.
          </p>
          <p>
            D. On or before {allValues?.pointDDay_manual} days the Inspection
            Deadline, Buyer shall have conducted a physical inspection of the
            Premises and testing of the equipment at its sole cost and expense
            and shall have approved same. Buyer is advised to have all equipment
            of the Business and HVAC system professionally inspected. If Buyer
            does not notify Seller of disapproval, the physical condition of the
            Premises and the equipment shall be deemed acceptable.
          </p>
          <p>
            i. <strong>Inspection Objection Deadline. </strong>Buyer shall have
            {allValues?.inspectionDeadlineDay_manual} until the Inspection
            Objection Deadline to deliver to Seller a written description of any
            unsatisfactory conditions that Buyer requires Seller to correct. If
            Buyer does not notify Seller of disapproval within such time, the
            inspection shall be deemed acceptable.
          </p>
          <p>
            ii. <strong>Inspection Resolution Deadline</strong>. Buyer and
            Seller shall have {allValues?.inspectionResolutionDay_manual} until
            the Inspection Resolution Deadline to agree in writing to the
            resolution of the unsatisfactory conditions.
          </p>
          <p>
            iii. <strong>Inspection Termination Deadline</strong>. Buyer shall
            have {allValues?.inspectionTerminationDay_manual} until the
            Inspection Termination Deadline to notify Seller in writing that
            this Agreement is terminated due to any unsatisfactory condition,
            provided the Buyer did not previously deliver an Inspection
            Objection.
          </p>
          <p>
            E. On or before Due Diligence Documents Delivery Deadline, Seller
            shall provide to Buyer copies of the following documents:
          </p>
          <p>
            i. Current executed lease, lease assignments and lease amendments
          </p>
          <p>
            ii. All equipment contracts and leases, vendor and service
            contracts,
          </p>
          <p>
            iii. List of the furniture, fixtures and equipment to be sold and
            excluded items,
          </p>
          <p>
            iv. Tax returns and yearly financial statements for the past{" "}
            {allValues?.pointEYear_manual}
            years (if applicable),
          </p>
          <p>
            v. Monthly financial statements and sales tax returns for the
            current year if tax returns are not yet prepared,
          </p>
          <p>
            vi. Copies of all existing records and documents regarding city,
            county or state inspections,
          </p>
          <p>
            vii. Any pertinent or germane documents related to the operation of
            the Business.
          </p>
          <p>
            F. <strong>Due Diligence Documents Review and Objection</strong>.
            Buyer has the right to review, and object based on the Due Diligence
            Documents. If the Due Diligence Documents are not supplied to Buyer
            or are unsatisfactory, in Buyer’s sole subjective discretion, Buyer
            may, on or before Due Diligence Documents Objection Deadline:
          </p>
          <p>
            i. <strong>Review and Disapproval. </strong>Buyer shall have{" "}
            {allValues?.pointFDay_manual} until the Due Diligence Documents
            Objection Deadline to review and disapprove same. If Buyer does not
            notify Seller of disapproval within such time, the documents shall
            be deemed acceptable.
          </p>
          <p>
            ii. <strong>Notice to Terminate</strong>. Buyer shall notify Seller
            in writing that this Agreement is terminated; or
          </p>
          <p>
            iii. <strong>Due Diligence Documents Objection</strong>. Buyer shall
            deliver to Seller a written description of any unsatisfactory Due
            Diligence Documents that Buyer requires Seller to correct.
          </p>
          <p>
            iv. <strong>Due Diligence Documents Resolution.</strong> If a Due
            Diligence Documents Objection is received by Seller, on or before
            Due Diligence Documents Objection Deadline and if Buyer and Seller
            have not agreed in writing to a settlement thereof on or before Due
            Diligence Documents Resolution Deadline, this Agreement shall
            terminate. At Buyer’s and Seller’s sole discretion, there may be a
            mutually agreed upon number of days to correct any unsatisfactory
            Due Diligence Documents. This mutually agreed time period shall be
            the Due Diligence Documents Resolution Deadline.
          </p>
          <p>
            G. On or before the New Loan Approval Deadline, Buyer shall have
            obtained approval for the purchase money loan on terms acceptable to
            Buyer and shall provide a copy of the loan commitment to Broker. If
            Buyer does not obtain a loan commitment on or before such date,
            either Seller or Buyer shall have the option to terminate this
            Agreement by written notice to the other party whereupon all earnest
            money shall be returned to Buyer. Seller shall cooperate with Buyer
            to provide all information reasonably required by Buyer’s lender.
          </p>
          <p>
            <em>
              If the above conditions are not met on or before the applicable
              date, the disapproving party may terminate this Agreement by
              written notice as provided herein in which event the earnest money
              deposit shall be promptly returned to Buyer; provided if any lease
              preparation or transfer fees are due to the landlord, then each
              party shall pay its share in accordance with paragraph 4A. In the
              event of termination pursuant to this section, Seller agrees to
              execute and deliver a written statement authorizing the release of
              the earnest money deposit to Buyer.
            </em>
          </p>

          <p>
            <strong>5. </strong>
            <strong>EXCLUSIVITY</strong>
            <p>
              <strong></strong>
            </p>
            <p>
              Upon MEC of this Agreement, and continuing thereafter until
              terminated by written notice from any party to the other parties
              hereto (the “Exclusive Period” defined as “During the period the
              Asset Purchase Agreement is in effect”), neither the Business, nor
              their respective officers, nor any of their respective affiliates
              or representatives or, as applicable, employees, managers,
              partners or agents, will, directly or indirectly, (i) solicit,
              initiate, encourage or discuss any proposal or offer, enter into
              any agreement, or accept any offer, relating to any
              reorganization, liquidation, dissolution, acquisition, merger,
              consolidation, purchase or sale of assets or stock, or similar
              transaction or business combination involving the Business, or
              (ii) furnish any information with respect to, assist or
              participate in or in any other manner facilitate any effort or
              attempt by any person or entity to do or seek to do any of the
              foregoing.
            </p>
          </p>

          <p>
            <strong>6. </strong>
            <strong>ASSIGNMENT OF CONTRACTS</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            All current equipment contracts and leases, unless otherwise
            specified, will be assumed and transferred to Buyer on the date of
            closing. Seller shall deliver to Buyer all equipment contracts and
            leases relating to the Business within{" "}
            {allValues?.assignmentOfContractday_manual}
            days after the date hereof for review.
          </p>
          <p>
            <strong>7. </strong>
            <strong>CONFIDENTIALITY AND NON-INTERFERENCE</strong>
          </p>
          <p>
            Buyer understands and agrees that the existence of this Agreement
            and its terms are to be kept strictly confidential except as
            required to carry out its terms. Under no circumstances shall Buyer
            or any of Buyer’s representatives visit the inside Business location
            or contact any of Seller’s employees directly or indirectly without
            the prior approval of Seller and/or Broker. Buyer shall not
            interfere in any way with the operation of the Business. Buyer
            understands and agrees that all Due Diligence Documents and other
            information relating to the Seller must be kept strictly
            confidential and may not be used for any purpose other than for
            consideration of the transaction contemplated hereby. This duty of
            confidentiality will remain in force until the closing or
            indefinitely if this agreement is terminated by either party.
          </p>
          <p>
            <strong>8. </strong>
            <strong>PAYMENT OF TAXES AND ACCOUNTS PAYABLE BY SELLER</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            It is not intended that there will be any prorations at the time of
            closing except proration of the rent, personal property taxes and
            other items approved and assumed by Buyer such as equipment leases
            and contracts. Seller shall be solely responsible for and pay all
            taxes and accounts payable of the Business for services performed or
            goods supplied due prior to the date of closing, including, but not
            limited to salaries of employees, utilities, income tax, sales tax,
            use tax, withholding tax, personal property tax, FICA, unemployment
            and workmen's compensation, and all vendors, and shall indemnify and
            hold Buyer harmless from and against the payment of same and all
            costs and expenses which Buyer may incur in connection therewith.
            Seller shall prepare and pay all non-income taxes (except prorated
            personal property taxes for the current year) to the date of closing
            so that the same shall be fully paid and current at the time of
            closing. Utilities shall be transferred at the date of closing.
            Buyer shall be responsible for any use tax assessed as a result of
            this transaction
            <em>. </em> All vendors shall be paid in full by Seller prior to
            closing or at the time of closing from Seller’s proceeds.
          </p>
          <p>
            <em>The provisions of this section shall survive the closing.</em>
          </p>
          <p>
            <strong>9. </strong>
            <strong>WARRANTIES BY SELLER</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>Seller warrants and represents to Buyer:</p>
          <p>
            A. It is a legal entity validly existing and in good standing under
            the laws of the state of Colorado and has the power to sell the
            business and Assets as provided for herein.
          </p>
          <p>
            B. It is understood and agreed that the furniture, fixtures and
            equipment comprising the Assets are being sold in their "as is"
            condition, provided all equipment and HVAC shall be in good working
            condition on the date of closing. Seller agrees not to dispose of
            any of the Assets from the date of this Agreement to the date of
            closing except in the ordinary course of business.
          </p>
          <p>
            C. That there is no outstanding litigation pending which affects the
            Assets or the Business.
          </p>
          <p>
            D. That the Assets are free and clear of any debt or obligation as
            of the date of closing or will be as a result of payment from
            Seller's proceeds.
          </p>
          <p>
            E. The financial information provided to Buyer is complete, true,
            and accurate in all respects.
          </p>
          <p>
            F. There are no past or pending governmental violations affecting
            the Business.
          </p>
          <p>
            G. Seller has filed all tax returns required to be filed. All taxes
            owed by Seller relating to the Business have been paid or are
            current. Seller has withheld and paid all taxes required to have
            been withheld and paid in connection with all amounts owing to any
            employee.
          </p>
          <p>
            <em>The provisions of this paragraph shall survive the closing.</em>
          </p>

          <p>
            <strong>10. </strong>
            <strong>WARRANTIES BY BUYER</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>Buyer warrants and represents to Seller:</p>
          <p>
            A. If Buyer assigns this Agreement pursuant to Section 20, said
            Assignee is a legal entity validly existing and in good standing
            under the laws of the state of Colorado and has the power to
            purchase the Business and Assets as provided for herein.
          </p>
          <p>
            B. There is no outstanding, threatened, or pending litigation which
            affects the Buyer or Assignee.
          </p>
          <p>
            C.The tax and financial information provided to Seller is complete,
            true, and accurate in all respects.
          </p>
          <p>
            D. There are no past or pending governmental violations affecting
            Buyer or Assignee.
          </p>
          <p>
            E. Buyer has the funds necessary for down payment at the time of
            MEC.
          </p>
          <p>
            F. Buyer and Assignee have filed all tax returns required to be
            filed to date. All taxes owed by Buyer, or Assignee have been paid
            or are current. Buyer, or Assignee has withheld and paid all taxes
            required to have been withheld and paid in connection with all
            amounts owing to any employee of same.
          </p>
          <p>
            G. That Buyer will operate the Business to the best of Buyer’s
            ability, attempting to maintain or improve upon the image and
            reputation of the Business; that the Business will be conducted
            according to, and conforming with, all laws, rules and regulations
            of the city, state and federal governments; and that Buyer will not
            violate the terms of any lease or contract connected with the
            Business.
          </p>
          <p>
            H. Buyer hereby indemnifies, holds harmless and releases Seller, its
            agents, and associates from any and all suits, actions, proceedings,
            claims, and demands, for any loss occasioned by reason of the
            failure or invalidity of any of the warranties and representations
            made in this Section 10.
          </p>
          <p>
            <em>The provisions of this section shall survive the closing.</em>
          </p>

          <p>
            <strong>11. </strong>
            <strong>ACCOUNTS RECEIVABLE AND PAYABLE</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            Seller's accounts receivable and accounts payable are not being
            transferred or sold to Buyer and Buyer agrees to deliver to Seller
            any and all mail, payments, invoices or bills received by Buyer
            after the date of closing which are intended for Seller. Buyer is
            not assuming any liabilities or obligations relating to the
            Business, other than expressly agreed by Buyer.
          </p>
          <p>
            <strong>12. </strong>
            <strong>ALLOCATION OF PURCHASE PRICE</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            The purchase price shall be allocated to the Assets as mutually
            agreed by the parties on or prior to closing in consultation with
            their respective accountants and/or financial advisors.
          </p>
          <p>
            <strong>13. </strong>
            <strong>CONDUCT OF BUSINESS PRIOR TO CLOSING</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            To the date of closing the Business will be conducted by Seller
            according to, and conforming with, all laws, rules and regulations
            of the city, state and federal governments and Seller shall operate
            and maintain the Business in a normal and regular manner; will not
            violate the terms of any lease or contract connected with the
            Business; will not remove or cause to be removed any Assets except
            as they may be used in the regular course of business; and will not
            increase the compensation payable to any employee of the Business.
          </p>
          <p>
            <strong>14. </strong>
            <strong>FINAL INVENTORY AND INSPECTION</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            On or before the date of closing Seller and Buyer shall jointly
            verify the list of the Assets to be transferred, and the physical
            condition of the Assets and the Premises, which list shall be part
            of the closing documents.
          </p>
          <p>
            <strong>15. </strong>
            <strong>NON-COMPETE AGREEMENT</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            At the closing Seller shall execute and deliver to Buyer a
            non-compete agreement (the "Non-Compete Agreement") which shall
            provide that Seller and its principals shall not directly or
            indirectly engage in the business of owning or operating the{" "}
            {data?.listingCategory} within a period of{" "}
            {allValues?.mileRadiusYears} years in the state of Colorado.
          </p>
          <p>
            <strong>16. </strong>
            <strong>CLOSING AND ESTIMATED CLOSING DATE</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            The closing shall be held on or before{" "}
            {allValues?.estimatedClosingDate} OR TWO BUSINESS DAYS AFTER LOAN
            CLOSING AND APPROVAL OF APPLICABLE PERMITS, whichever is later, at
            the hour and place to be established by mutual agreement of Buyer
            and Seller. At the closing the following shall occur:
          </p>
          <p>A. Seller shall execute and/or deliver to Buyer the following:</p>
          <p>
            i. Bill of Sale for the furniture, fixtures and equipment included
            in the Assets with full warranties of title and transferring the
            Assets free and clear from all liens and encumbrances;
          </p>
          <p>ii. The Non-Compete Agreement;</p>
          <p>
            iii. An indemnity agreement by Seller acknowledging its obligation
            to pay all bills and liabilities of the Business which accrued prior
            to the date of closing;
          </p>
          <p>
            iv. All keys, combinations and security codes relating to the
            Business;
          </p>
          <p>v. A withdrawal or release of the Business trade name to Buyer;</p>
          <p>
            vi. All current equipment contracts and leases, unless otherwise
            specified, will be assumed and transferred to Buyer on the date of
            closing and/or during the training period after closing.
          </p>
          <p>
            B. Buyer shall execute and/or deliver to Seller: The purchase money
            described in §1B.
          </p>
          <p>
            C. Buyer will receive a credit for the earnest money deposit
            described in §1A.
          </p>
          <p>
            D. Buyer and Seller shall arrange for the transfer of utilities and
            Business telephone number to Buyer and any leases and/or contracts
            assumed by Buyer.
          </p>
          <p>
            E. Buyer and Seller shall execute and deliver such other documents
            which may be required to carry out the purpose and intention of this
            Agreement.
          </p>
          <p>F. Buyer shall receive possession of the Business and Assets.</p>
          <p>
            <strong>17. </strong>
            <strong>AFTER CLOSING</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            Seller and Buyer agree in good faith to cooperate to the extent
            reasonably necessary to affect the intent of this Agreement and the
            on-going success of the Business.
          </p>
          <p>
            <em>
              The provisions of this paragraph shall survive the closing.{" "}
            </em>
          </p>
          <p>
            <strong>18. </strong>
            <strong>RISK OF LOSS </strong>
          </p>
          <p>
            In the event the Premises are damaged by fire or other casualty
            prior to time of closing in an amount of not more than ten percent
            of the total purchase price, Seller shall be obligated to repair
            same before the date of closing. In the event such damage is not
            repaired within said time or if the damages exceed such sum, this
            Agreement may be terminated at the option of Buyer. Should Buyer
            elect to carry out this Agreement despite such damage, Buyer shall
            be entitled to credit for all the insurance proceeds resulting from
            such damage to the Premises and Assets not to exceed the total
            purchase price. Should any Asset fail or be damaged between the date
            of this Agreement and the date of closing, then Seller shall be
            liable for the repair or replacement of such Asset with a unit of
            similar size, age and quality, or an equivalent credit, less any
            insurance proceeds received by Buyer covering such repair or
            replacement.
          </p>
          <p>
            <strong>19. </strong>
            <strong>TIME OF THE ESSENCE AND DEFAULT</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            Time is of the essence hereof and if any payment or other condition
            hereof is not made, tendered, or performed by either Seller or
            Buyer, then this Agreement, at the option of the party who is not in
            default, may be terminated by that party by written notice to the
            defaulting party, in which case the non-defaulting party may recover
            such damages as may be proper.
          </p>
          <p>
            A. In the event of such default by Seller, then all payments or
            things delivered hereunder by Buyer to Seller shall be promptly
            returned to Buyer and Buyer shall have the additional right to sue
            for specific performance. IN THE EVENT OF SUCH DEFAULT BY BUYER,
            THEN ALL PAYMENTS MADE HEREUNDER BY BUYER SHALL BE FORFEITED AS
            LIQUIDATED DAMAGES AND RETAINED BY SELLER AS ITS SOLE AND EXCLUSIVE
            REMEDY.
          </p>
          <p>
            B. In the event of a dispute under the terms of this Agreement, the
            prevailing party shall be entitled to recover all costs of suit and
            reasonable attorney's fees. Good faith participation in mediation
            shall be a condition precedent to the filing of any litigation. If
            the parties cannot agree on a mediator within{" "}
            {allValues?.timeOfEssenceDays}
            days after a party's demand for mediation, then the mediation shall
            be conducted by the Judicial Arbiter Group in Denver, Colorado. The
            costs of mediation shall be shared equally, with each side to pay
            its or their own attorney's fees.
          </p>
          <p>
            <strong>20. </strong>
            <strong>ASSIGNMENT</strong>
          </p>
          <p>
            Buyer shall have the right to assign this Agreement to a corporation
            or limited liability company which it controls without the consent
            of Seller.
          </p>
          <p>
            <strong>21. </strong>
            <strong>BUYER TRAINING</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            Seller shall train Buyer in the operation of the Business at no
            additional cost to Buyer as follows:
          </p>
          <p>After closing: {allValues?.afterClosing_manual}</p>
          <p>
            <strong>22. </strong>
            <strong>MISCELLANEOUS</strong>
          </p>
          <p>
            A. Both parties acknowledge that they have been advised to seek
            financial counsel in reference to this transaction.
            <strong>
              THE FORM OF THIS AGREEMENT HAS BEEN PREPARED BY COUNSEL FOR
              BROKER. BOTH PARTIES ARE ADVISED TO SEEK THEIR OWN LEGAL COUNSEL
              PRIOR TO SIGNING THIS AGREEMENT
            </strong>
            . Buyer and Seller hereby release brokerage firm, broker, its
            agents, and associates from any and all suits, actions, proceedings,
            claims, and demands by either party made which resulted in any loss
            occasioned by reason of either party’s failure to obtain separate
            legal counsel and advice.
          </p>
          <p>
            B. This Agreement shall be construed under and governed by the laws
            of the State of Colorado.
          </p>
          <p>
            C. This Agreement shall be binding upon the heirs, personal
            representatives, successors and assigns of the parties.
          </p>
          <p>
            D. All notices under this Agreement may be sent to the parties via
            electronic mail to the addresses set forth below and shall be deemed
            given at the time sent.
          </p>
          <p>
            E. The paragraph headings are for convenient reference only and
            shall not be used in construing this Agreement. Whenever the
            singular is used, it shall include the plural, and the words of any
            gender shall include the other genders.
          </p>
          <p>
            F. This Agreement constitutes the entire Agreement between the
            parties relating to the subject hereof and it may not be amended or
            modified unless made in writing and signed by both parties.
          </p>
          <p>
            G. Each party shall bear its own expenses in connection with this
            Agreement.
          </p>
          <p>
            H. A facsimile or other photo reproduction of this Agreement may be
            executed by each party separately and when each party has executed
            such a copy thereof, such copies taken together shall be deemed to
            be a full and complete Agreement between the parties.
          </p>
          <p>
            I. The sale of the Business and inventory is illustrated in this
            Agreement for Sale and Purchase of Business Assets and does NOT
            include Property. Any sale of Property shall be conveyed on a
            separate State of Colorado Real Estate Contract. In the case of a
            real estate purchase in addition to business assets, both contracts
            shall be dependent of one another. Should one contract fail to meet
            any of the provisions, BOTH contracts fail and are deemed void.
          </p>
          <p>
            <strong>23. </strong>
            <strong>CLOSING AGENT</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            In order to facilitate the closing, Broker shall assign a closing
            agent for execution, preparation and distribution of documents
            evidencing the terms and conditions of this Agreement and provide
            for the proper closing and distribution of funds. Seller and Buyer
            each agree to pay one-half (½) of the closing agent's fees and
            expenses which shall be due and payable at the time of closing.
          </p>
          <p>
            <strong>24. </strong>
            <strong>BROKER DISCLOSURE</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            The parties acknowledge and agree that the
            {/* {data?.broker_name}  */}
            {allValues?.disclosureBroker}, is acting as{" "}
            {allValues?.disclosureBrokerType}Transactional Broker in this
            transaction, and that they have received copies of the "Definitions
            of Real Estate Relationship." Seller shall be responsible to pay the
            broker’s commission per the written agreement between Broker and
            Seller.
          </p>
          <p>
            <strong>25. </strong>
            <strong>DISPUTES BETWEEN SELLER AND BUYER</strong>
          </p>
          <p>
            In the event any dispute arises under this Agreement between Seller
            and Buyer resulting in Broker being made a party to any action or
            proceeding, judicial or administrative, Seller and Buyer, jointly
            and severally, agree to indemnify and reimburse Broker for all
            reasonable attorney’s fees and costs incurred as a result of Broker
            having been made a party to such action or proceeding, provided a
            judgment is not rendered stating that Broker acted improperly
            regarding such dispute. All of Broker’s reasonable attorney’s fees
            and costs incurred shall be shared equally between Seller and Buyer,
            unless the decision of the Court or other tribunal determines that
            Broker was improperly or needlessly made a party solely as a result
            of the actions of either Seller or Buyer, in which case such party
            shall immediately thereafter pay and satisfy all of Broker’s
            reasonable attorney’s fees and costs incurred.
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            <strong>26. </strong>
            <strong>BROKER’S DISCLAIMER</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            The parties acknowledge that all information concerning Seller’s
            Business, Assets, and Premises, whether furnished before or after
            the execution of this Agreement, was and is supplied by Seller to
            Buyer, and that Broker has not made nor does Broker make any
            warranty or representation as to the genuineness, accuracy, and
            truthfulness of any and all information of the Business,
            notwithstanding the fact that any such information may have been
            delivered by Broker to Buyer and/or Buyer’s representatives, it
            being understood that in so doing, Broker has acted merely as a
            conduit for the information between Seller and Buyer
            <strong>.</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            <strong>27. </strong>
            <strong>SURVIVAL OF WARRANTIES</strong>
          </p>
          <p>
            The representations and warranties provided by Buyer and Seller in
            this Agreement shall survive the closing, and in the event Buyer
            pays a claim made against the Business or the Assets related to
            Seller’s operation and ownership of the Business and Assets prior to
            Closing following Seller’s failure to pay and satisfy same within a{" "}
            {allValues?.survivalWarrantyDay_manual}
            day prior written notice period from Buyer to Seller, then Buyer
            shall have the right of set-off against any note or other obligation
            which may then be owing from Buyer to Seller, in addition to seeking
            appropriate judicial relief which shall include Buyer’s reasonable
            attorney’s fees and costs incurred.
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            <strong>28. </strong>
            <strong>ACCEPTANCE DATE</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            Buyer's offer shall be open for Seller's written acceptance on or
            before 11:59 PM on {allValues?.closingYear_manual}.
          </p>
          <p align="center">
            <strong>— SIGNATURE PAGE TO FOLLOW —</strong>
            <br clear="all" />
            <strong></strong>
          </p>
          <p align="center">
            <strong>–– SIGNATURE PAGE ––</strong>
          </p>
          <p align="center">
            <strong></strong>
          </p>
          <p align="center">
            <strong></strong>
          </p>
          <p align="center">
            <strong></strong>
          </p>
          <p align="center">
            <strong></strong>
          </p>
          <p>
            THE UNDERSIGNED BUYER AND SELLER EXPRESSLY ACKNOWLEDGE FULLY
            READING, UNDERSTANDING AND RECEIVING A TRUE COPY OF THIS AGREEMENT.
          </p>
          <p>EXECUTED the date set forth below.</p>
          <p>
            <strong>BUYER:</strong>
            {data?.buyer_name}
          </p>
          <p>
            <u></u>
          </p>
          <p>
            <u> </u>
          </p>
          <p>By: {allValues?.buyerCompanyName_manual} (TBD Corp/LLC)</p>
          <p>Telephone: {data?.buyer_phone}</p>
          <p>Email: {data?.buyer_email}</p>
          <p>
            <strong></strong>
          </p>
          <p>
            <strong>29. </strong>
            <strong>SELLER'S ACCEPTANCE</strong>
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            Seller accepts the above offer this{" "}
            {allValues?.sellerAcceptanceDay_manual} and agrees to pay a success
            fee commission to Business Brokerage Services, LLC, relating to the
            Listing Agreement for Sole and Exclusive Right to Sell, dated{" "}
            {allValues?.seller_desgination}.
          </p>
          <p>
            <strong></strong>
          </p>
          <p>
            <strong>SELLER:</strong>
            {data?.seller_name}
          </p>
          <p>
            <u></u>
          </p>
          <p>
            <u> </u>
          </p>
          <p>
            By: {data?.seller_name} for {data?.business_title}
          </p>
          <p>Title: {allValues?.seller_desgination}</p>
          <p>Telephone: {data?.seller_phone}</p>
          <p>Email: {data?.seller_email}</p>
          <p>
            <u></u>
          </p>
          <p>
            <strong>BROKER:</strong>
          </p>
          <p>
            <strong> </strong>
          </p>
          <p>{data?.broker_name}</p>
          <p>Business Brokerage Services, LLC</p>
          <p>{data?.broker_name}, Broker</p>
          <p>Telephone: {data?.broker_phone}</p>
          <p>Email: {data?.broker_email}</p>
        </div>
        <br clear="all" />
        <br clear="ALL" />
        <table cellpadding="0" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td>
                <div></div>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          The printed portions of this form, except differentiated additions,
          have been approved by the Colorado Real Estate Commission. (DD25-5-09)
          (Mandatory 7-09)
        </p>
        <p>
          <strong>
            DIFFERENT BROKERAGE RELATIONSHIPS ARE AVAILABLE WHICH INCLUDE SELLER
            AGENCY, BUYER AGENCY OR TRANSACTION-BROKERAGE.
          </strong>
          <strong></strong>
        </p>
        <p>
          <strong></strong>
        </p>
        <p align="center">
          <strong>DEFINITIONS OF WORKING RELATIONSHIPS</strong>
          <strong></strong>
        </p>
        <p>
          <strong></strong>
        </p>
        <p>
          For purposes of this document, seller also means "landlord" (which
          includes sublandlord) and buyer also means "tenant" (which includes
          subtenant).
        </p>
        <p>
          <strong>Seller's Agent: </strong>A seller's agent (or listing agent)
          works solely on behalf of the seller to promote the interests of the
          seller with the utmost good faith, loyalty and fidelity. The agent
          negotiates on behalf of and acts as an advocate for the seller. The
          seller's agent must disclose to potential buyers all adverse material
          facts actually known by the seller's agent about the property or{" "}
          <strong>business</strong>. A separate written listing agreement is
          required which sets forth the duties and obligations of the broker and
          the seller.
        </p>
        <p>
          <strong>Buyer's Agent: </strong>A buyer's agent works solely on behalf
          of the buyer to promote the interests of the buyer with the utmost
          good faith, loyalty and fidelity. The agent negotiates on behalf of
          and acts as an advocate for the buyer. The buyer's agent must disclose
          to potential sellers all adverse material facts actually known by the
          buyer's agent including the buyer's financial ability to perform the
          terms of the transaction and, if a residential property, whether the
          buyer intends to occupy the property. A separate written buyer agency
          agreement is required which sets forth the duties and obligations of
          the broker and the buyer.
        </p>
        <p>
          <strong>Transaction-Broker: </strong>A transaction-broker assists the
          buyer or seller or both throughout a real estate or{" "}
          <strong>business</strong> transaction by performing terms of any
          written or oral agreement, fully informing the parties, presenting all
          offers and assisting the parties with any contracts, including the
          closing of the transaction without being an agent or advocate for any
          of the parties. A transaction-broker must use reasonable skill and
          care in the performance of any oral or written agreement and must make
          the same disclosures as agents about all adverse material facts
          actually known by the transaction-broker concerning a property/
          <strong>business</strong> or a buyer's financial ability to perform
          the terms of a transaction and, if a residential property whether the
          buyer intends to occupy the property. No written agreement is
          required.
        </p>
        <p>
          <strong>Customer: </strong>A customer is a party to a real estate or{" "}
          <strong>business</strong>
          transaction with whom the broker has no brokerage relationship because
          such party has not engaged or employed the broker, either as the
          party's agent or as the party's transaction-broker.
        </p>
        <p>
          <strong></strong>
        </p>
        <p>
          <strong></strong>
        </p>
        <p>
          <strong>THIS IS NOT A CONTRACT.</strong>
        </p>
        <p>
          <strong></strong>
        </p>
        <p>I acknowledge receipt of this document.</p>
        <p>
          Signature <strong>(Buyer) Date</strong> Signature{" "}
          <strong>(Seller)</strong> <strong>Date</strong>
          <strong></strong>
        </p>
        <p>
          Broker provided <u> Buyer and Seller </u>with this document via{" "}
          <u>Adobe Sign and/or email </u>and retained a copy for Broker's
          records.
        </p>
        <p>Brokerage Firm's Name: Business Brokerage Services</p>
        <p>Broker</p>
        <p>
          <strong>DD25-5-09. DEFINITIONS OF WORKING RELATIONSHIPS</strong>
          <strong></strong>
        </p>
      </div>
      {showModal && (
        <PdfAgreementModal
          show={showModal}
          setShow={setShowModal}
          handleSubmit={HandleSetData}
          temaplateType={"standard"}
        />
      )}
    </>
  );
};

export default StandardAPA;
