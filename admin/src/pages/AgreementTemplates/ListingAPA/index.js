import React, { useState } from "react";
import classes from "./ListingAPA.module.css";
import { Logo } from "../../../constant/imagePath";
import { Button } from "../../../Component/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import PdfAgreementModal from "../../../modals/PdfAgreementModal";
import {
  apiHeader,
  BaseURL,
  googleMapApiKey,
  mediaUrl,
} from "../../../config/apiUrl";
import { Patch, Post } from "../../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { downloadFileFromUrl } from "../../../constant/downloadFile";
import ListingAgreementModal from "../../../modals/ListingAgreementModal";
import { Checkbox } from "../../../Component/Checkbox/Checkbox";

const ListingAPA = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state?.authReducer?.access_token);
  const { templatePDF, ...data } = useLocation()?.state;
  const [showModal, setShowModal] = useState(false);
  const [allValues, setAllValues] = useState(null);
  const [loading, setLoading] = useState(false);
  //
  const [pdfDownloadLink, setPdfDownloadLink] = useState(
    templatePDF ? templatePDF : ""
  );

  const HandleSetData = (params) => {
    setAllValues(params);
  };

  const sendPdf = async () => {
    const url = BaseURL("business/update-owner-template");
    const params = {
      ...data,
      ...allValues,
    };
    setLoading(true);
    const response = await Patch(url, params, apiHeader(token));
    if (response !== undefined) {
      downloadFileFromUrl(
        mediaUrl(response?.data?.data?.ownerTemplate),
        `${data?.seller_title}-${data?.listingTitle}-Listing-APA.docx`
      );
      setPdfDownloadLink(response?.data?.data?.ownerTemplate);
      setAllValues(null);
    }
    setLoading(false);
  };

  return (
    <>
      <div className={classes.mainContainer}>
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
                      `${data?.seller_title}-${data?.listingTitle}-Listing-APA.docx`
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
        {/* content */}
        <div className={classes.contentDiv}>
          <div className="form_approval">
            <p style={{ textDecoration: "underline", fontWeight: "800" }}>
              THIS IS A BINDING CONTRACT. THIS FORM HAS IMPORTANT LEGAL
              CONSEQUENCES AND THE PARTIES SHOULD CONSULT LEGAL AND TAX OR OTHER
              COUNSEL BEFORE SIGNING.
            </p>
            <p style={{ fontWeight: "800" }}>
              Compensation charged by brokerage firms is not set by law. Such
              charges are established by each real estate brokerage firm.
            </p>
            <p style={{ textDecoration: "underline", fontWeight: "800" }}>
              DIFFERENT BROKERAGE RELATIONSHIPS ARE AVAILABLE WHICH INCLUDE
              BUYER AGENCY, SELLER AGENCY, OR TRANSACTION-BROKERAGE.
            </p>
          </div>

          <div
            className="main_heading"
            style={{ textAlign: "center", maxWidth: "60%", margin: "0 auto" }}>
            <h2>EXCLUSIVE RIGHT-TO-SELL LISTING CONTRACT</h2>
          </div>

          <div
            className="agreement_type"
            style={{ textAlign: "center", fontWeight: "800" }}>
            <div
              className="seller_agency"
              style={{ display: "inline-block", marginRight: "16px" }}>
              <Checkbox
                label={"SELLER AGENCY"}
                value={allValues?.is_seller_agency == "yes" && "SELLER AGENCY"}
                setValue={() => {
                  return;
                }}
              />
            </div>
            <div
              className="transaction_brokerage"
              style={{ display: "inline-block" }}>
              <Checkbox
                label={"TRANSACTION BROKERAGE"}
                value={
                  allValues?.is_transaction_brokerage == "yes" &&
                  "TRANSACTION BROKERAGE"
                }
                setValue={() => {
                  return;
                }}
              />
            </div>
          </div>

          <div
            className="agreement_date"
            style={{ textAlign: "right", marginBottom: "30px" }}>
            <p>
              Date:{" "}
              <span
                style={{ borderBottom: "1px solid black", padding: "0 60px" }}>
                {allValues?.current_date}
              </span>
            </p>
          </div>

          <div className="main_listing">
            <ul
              className="main_list"
              style={{ listStyle: "decimal", paddingLeft: "24px" }}>
              <li style={{ fontWeight: "800" }}>
                1. LISTING AGREEMENT.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      Seller and Brokerage Firm enter into this exclusive,
                      irrevocable contract (Seller Listing Contract) and agree
                      to its provisions. Broker, on behalf of Brokerage Firm,
                      agrees to provide brokerage services to Seller. Seller
                      agrees to pay Brokerage Firm as set forth in this Seller
                      Listing Contract.
                    </p>
                    <ul style={{ listStyle: "lower-alpha", fontWeight: "800" }}>
                      <li>
                        If this Business Opportunity includes Real Estate, a
                        separate Colorado Real Estate Commission EXCLUSIVE
                        RIGHT-TO-SELL LISTING CONTRACT (real estate) will be
                        attached and become part of this Agreement.
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li style={{ fontWeight: "800" }}>
                2. BROKER AND BROKERAGE FIRM. Multiple-Person Firm.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      Broker (as defined below) is the individual designated by
                      Brokerage Firm to serve as the broker of Seller and to
                      perform the services for Seller required by this Seller
                      Listing Contract. If more than one individual is so
                      designated, then references in this Seller Listing
                      Contract to Broker include all persons so designated,
                      including substitute or additional brokers. The brokerage
                      relationship exists only with Broker and does not extend
                      to the employing broker, Brokerage Firm or to any other
                      brokers employed or engaged by Brokerage Firm who are not
                      so designated.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                3. DEFINED TERMS.
                <ul style={{ listStyle: "upper-alpha" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      A. <b>Seller/Business Opportunity:</b>{" "}
                      {allValues?.dba_business_tradename}
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      B. <b>Brokerage:</b> Business Brokerage Services LLC
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      C. <b>Broker:</b>
                      {data?.broker_name}
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p style={{ marginBottom: "0" }}>
                      D. <b>Business Opportunity Address:</b>{" "}
                      {data?.business_address}
                    </p>
                    <p style={{ marginTop: "0" }}>
                      together with the interests, improvements, furniture,
                      fixtures, and equipment, unless otherwise specified.
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      E. <b>Sale; Lease.</b>
                    </p>
                    <ul style={{ listStyle: "lower-roman" }}>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          i. A “Sale” of the Business Opportunity is the
                          voluntary transfer or exchange of any interest in the
                          Business Opportunity or the voluntary creation of the
                          obligation to convey any interest in the Business
                          Opportunity, including a contract or lease. It also
                          includes an agreement to transfer any ownership
                          interest in an entity which owns the Business
                          Opportunity.
                        </p>
                      </li>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          ii. Seller authorizes Broker to negotiate a lease of
                          the Business Opportunity. “Lease of the Business
                          Opportunity” or “Lease” means any agreement between
                          the Seller and a tenant to create a tenancy or
                          leasehold interest in the Business Opportunity.
                        </p>
                      </li>
                    </ul>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      F. <b>Listing Period.</b> The Listing Period of this
                      Seller Listing Contract begins on {allValues?.start_date}
                      and continues through the earlier of (1) completion of the
                      Sale or, if applicable, Lease of the Business Opportunity
                      or (2) {allValues?.end_date}, and any written extensions
                      (Listing Period). Broker must continue to assist in the
                      completion of any Sale or Lease of the Business
                      Opportunity for which compensation is payable to Brokerage
                      Firm under § 7 of this Seller Listing Contract.
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      G. <b>Applicability of Terms.</b> A check or similar mark
                      in a box means that such provision is applicable. The
                      abbreviation “N/A” or the word “Deleted” means not
                      applicable. The abbreviation “MEC” (mutual execution of
                      this contract) means the date upon which both parties have
                      signed this Seller Listing Contract.
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      H. <b>Day; Computation of Period of Days, Deadline.</b>
                    </p>
                    <ul style={{ listStyle: "lower-roman" }}>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          i. <b>Day.</b> As used in this Seller Listing
                          Contract, the term “day” means the entire day ending
                          at 11:59 p.m., United States Mountain Time (Standard
                          or Daylight Savings as applicable).
                        </p>
                      </li>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          ii. <b>Computation of Period of Days, Deadline.</b> In
                          computing a period of days, when the ending date is
                          not specified, e.g., three days after MEC, the first
                          day is excluded and the last day is included. If any
                          deadline falls on a Saturday, Sunday or federal or
                          Colorado state holiday (Holiday), such deadline will
                          be extended to the next day that is not a Saturday,
                          Sunday or Holiday.
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                4. BROKERAGE RELATIONSHIP.
                <ul style={{ listStyle: "upper-alpha" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      A. If the Seller Agency box at the top of page 1 is
                      checked, Broker represents Seller as Seller’s limited
                      agent (Seller’s Agent). If the Transaction-Brokerage box
                      at the top of page 1 is checked, Broker acts as a
                      Transaction-Broker.
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      B. <b>In-Company Transaction – Different Brokers.</b> When
                      Seller and buyer in a transaction are working with
                      different brokers within the Brokerage Firm, those brokers
                      continue to conduct themselves consistent with the
                      brokerage relationships they have established. Seller
                      acknowledges that Brokerage Firm is allowed to offer and
                      pay compensation to brokers within Brokerage Firm working
                      with a buyer.{" "}
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      C. <b>In-Company Transaction – One Broker.</b> If Seller
                      and buyer are both working with the same Broker, Broker
                      must function as:
                    </p>
                    <ul style={{ listStyle: "lower-roman" }}>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          i. Seller’s Agent. If the Seller Agency box at the top
                          of page 1 is checked, the parties agree the following
                          applies:
                        </p>
                        <ul style={{ listStyle: "decimal" }}>
                          <li>
                            <b>
                              1. Seller Agency Unless Brokerage Relationship
                              with Both.
                            </b>{" "}
                            Broker represents Seller as Seller’s Agent and must
                            treat the buyer as a customer. A customer is a party
                            to a transaction with whom Broker has no brokerage
                            relationship. Broker must disclose to such customer
                            Broker’s relationship with Seller. However, if
                            Broker delivers to Seller a written Change of Status
                            that Broker has a brokerage relationship with the
                            buyer then Broker is working with both Seller and
                            buyer as a Transaction Broker. If the box in §
                            4.C.i.2 <b>(Seller Agency Only)</b> is checked, §
                            4.C.i.2
                            <b>(Seller Agency Only)</b> applies instead.
                          </li>

                          <li
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}>
                            <b style={{ display: "inline" }}>2.</b>{" "}
                            {
                              <Checkbox
                                label={"Seller Agency Only"}
                                value={
                                  allValues?.is_seller_agency == "yes" &&
                                  "Seller Agency Only"
                                }
                                setValue={() => {
                                  return;
                                }}
                              />
                            }
                            If this box is checked, Broker represents Seller as
                            Seller’s Agent and must treat the buyer as a
                            customer.
                          </li>
                        </ul>
                      </li>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          ii. <b>Transaction-Broker.</b> If the
                          Transaction-Brokerage box at the top of page 1 is
                          checked, or in the event neither box is checked,
                          Broker must work with Seller as a Transaction-Broker.
                          A Transaction-Broker must perform the duties described
                          in § 5 and facilitate sales transactions without being
                          an advocate or agent for either party. If Seller and
                          buyer are working with the same Broker, Broker must
                          continue to function as a Transaction-Broker.
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                5. BROKERAGE DUTIES.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      Brokerage Firm, acting through Broker, as either a
                      Transaction-Broker or a Seller’s Agent, must perform the
                      following <b>“Uniform Duties”</b> when working with
                      Seller:
                    </p>
                    <ul style={{ listStyle: "upper-alpha" }}>
                      <li>
                        <p>
                          A. Broker must exercise reasonable skill and care for
                          Seller, including, but not limited to the following:
                        </p>
                        <ul style={{ listStyle: "lower-roman" }}>
                          <li>
                            <p>
                              i. Performing the terms of any written or oral
                              agreement with Seller;
                            </p>
                          </li>
                          <li>
                            <p>
                              ii. Presenting all offers to and from Seller in a
                              timely manner regardless of whether the Business
                              Opportunity is subject to a contract for Sale;
                            </p>
                          </li>
                          <li>
                            <p>
                              iii. Disclosing to Seller adverse material facts
                              actually known by Broker;
                            </p>
                          </li>

                          <li>
                            <p>
                              iv. Advising Seller regarding the transaction and
                              advising Seller to obtain expert advice as to
                              material matters about which Broker knows but the
                              specifics of which are beyond the expertise of
                              Broker;
                            </p>
                          </li>
                          <li>
                            <p>
                              v. Accounting in a timely manner for all money and
                              Business Opportunity received; and
                            </p>
                          </li>
                          <li>
                            <p>
                              vi. Keeping Seller fully informed regarding the
                              transaction.
                            </p>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <p>
                          B. Broker must not disclose the following information
                          without the informed consent of Seller:
                        </p>
                        <ul style={{ listStyle: "lower-roman" }}>
                          <li>
                            <p>
                              i. That Seller is willing to accept less than the
                              asking price for the Business Opportunity;
                            </p>
                          </li>
                          <li>
                            <p>
                              ii. What the motivating factors are for Seller to
                              sell the Business Opportunity;
                            </p>
                          </li>
                          <li>
                            <p>
                              iii. That Seller will agree to financing terms
                              other than those offered;
                            </p>
                          </li>

                          <li>
                            <p>
                              iv. Any material information about Seller unless
                              disclosure is required by law or failure to
                              disclose such information would constitute fraud
                              or dishonest dealing; or
                            </p>
                          </li>
                          <li>
                            <p>
                              v. Any facts or suspicions regarding circumstances
                              that could psychologically impact or stigmatize
                              the Business Opportunity.
                            </p>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <p>
                          C. Seller consents to Broker’s disclosure of Seller’s
                          confidential information to the supervising broker or
                          designee for the purpose of proper supervision,
                          provided such supervising broker or designee does not
                          further disclose such information without consent of
                          Seller, or use such information to the detriment of
                          Seller.
                        </p>
                      </li>

                      <li>
                        <p>
                          D. Brokerage Firm may have agreements with other
                          sellers to market and sell their Business Opportunity.
                          Broker may show alternative properties not owned by
                          Seller to other prospective buyers and list competing
                          properties for sale.
                        </p>
                      </li>

                      <li>
                        <p>
                          E. Broker is not obligated to seek additional offers
                          to purchase the Business Opportunity while the
                          Business Opportunity is subject to a contract for
                          Sale.
                        </p>
                      </li>

                      <li>
                        <p>
                          F. Broker has no duty to conduct an independent
                          inspection of the Business Opportunity for the benefit
                          of a buyer and has no duty to independently verify the
                          accuracy or completeness of statements made by Seller
                          or independent inspectors. Broker has no duty to
                          conduct an independent investigation of a buyer’s
                          financial condition or to verify the accuracy or
                          completeness of any statement made by a buyer.
                        </p>
                      </li>

                      <li>
                        <p>
                          G. Seller understands that Seller is not liable for
                          Broker’s acts or omissions that have not been
                          approved, directed, or ratified by Seller.
                        </p>
                      </li>

                      <li>
                        <p>
                          H. When asked, Broker will disclose to prospective
                          buyers and cooperating brokers the existence of offers
                          on the Business Opportunity and whether the offers
                          were obtained by Broker, a broker within Brokerage
                          Firm or by another broker.
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800", marginTop: "40px" }}>
                6. ADDITONAL DUTIES OF SELLER’S AGENT.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      If the Seller Agency box at the top of page 1 is checked,
                      Broker is Seller’s Agent, with the following additional
                      duties:
                    </p>
                    <ul style={{ listStyle: "upper-alpha" }}>
                      <li>
                        <p>
                          A. Promoting the interests of Seller with the utmost
                          good faith, loyalty and fidelity;
                        </p>
                      </li>
                      <li>
                        <p>
                          B. Seeking a price and terms that are set forth in
                          this Seller Listing Contract; and
                        </p>
                      </li>
                      <li>
                        <p>
                          C. Counseling Seller as to any material benefits or
                          risks of a transaction that are actually known by
                          Broker.
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                7. COMPENSATION TO BROKERAGE FIRM.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      Seller agrees that any Brokerage Firm compensation that is
                      conditioned upon the Sale of the Business Opportunity will
                      be earned by Brokerage Firm as set forth herein without
                      any discount or allowance for any efforts made by Seller
                      or by any other person in connection with the Sale of the
                      Business Opportunity.
                    </p>
                    <ul style={{ listStyle: "upper-alpha" }}>
                      <li>
                        <p>
                          A. <b>Amount.</b> In consideration of the services to
                          be performed by Broker, Seller agrees to pay Brokerage
                          Firm as follows:
                        </p>
                        <ul style={{ listStyle: "lower-roman" }}>
                          <li>
                            <p>
                              i. <b>Business Sale Commission.</b> The greater of{" "}
                              {allValues?.total_purchase_percent} of the total
                              purchase price or,{" "}
                              {allValues?.total_purchase_price} in U.S. dollars.
                              Real Estate related commission documented on{" "}
                              <b>
                                Colorado Real Estate Commission EXCLUSIVE
                                RIGHT-TO-SELL LISTING CONTRACT (real estate)
                              </b>
                            </p>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <p>
                          B. When Earned. Such commission is earned upon the
                          occurrence of any of the following:
                        </p>
                        <ul style={{ listStyle: "lower-roman" }}>
                          <li>
                            <p>
                              i. Any Sale of the Business Opportunity within the
                              Listing Period by Seller, by Broker or by any
                              other person;
                            </p>
                          </li>
                          <li>
                            <p>
                              ii. Broker finding a buyer who is ready, willing
                              and able to complete the Sale or Lease as
                              specified in this Seller Listing Contract; or
                            </p>
                          </li>
                          <li>
                            <p>
                              iii. Any Sale or Lease of the Business Opportunity
                              within 730 calendar days after the Listing Period
                              expires (Holdover Period) (1) to anyone with whom
                              Broker negotiated and (2) whose name was submitted
                              to Seller by Broker during the Listing Period
                              (Submitted Prospect). Provided, however, Seller
                              will owe the commission to Brokerage Firm under
                              this § 7.B.iii if a commission is earned by
                              another licensed brokerage firm acting pursuant to
                              an exclusive agreement entered into during the
                              Holdover Period and a Sale or Lease to a Submitted
                              Prospect is consummated.
                            </p>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <p>
                          C. <b>When Applicable and Payable.</b> The commission
                          obligation applies to a Sale made during the Listing
                          Period or any extension of such original or extended
                          term. The commission described in § 7.A.i is payable
                          at the time of the closing of the Sale, or, if there
                          is no closing (due to the refusal or neglect of
                          Seller) then on the contracted date of closing, as
                          contemplated by § 7.B.i or § 7.B.iii, or upon
                          fulfillment of § 7.B.ii where the offer made by such
                          buyer is not accepted by Seller.
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                8. SERVICES AND MARKETING.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      Seller has been advised by Broker of the advantages and
                      disadvantages of various marketing methods, including
                      advertising and various methods of making the Business
                      Opportunity accessible by other brokerage firms and
                      whether some methods may limit the ability of another
                      broker to show the Business Opportunity. After having been
                      so advised, Seller has chosen the following:
                    </p>
                    <ul style={{ listStyle: "upper-alpha" }}>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          A. <b>Broker Marketing.</b> The Broker and Brokerage
                          Firm will market the Business and Business Opportunity
                          for Sale on the following Internet platforms:
                          Brokerage Firm’s company website, bizbuysell.com,
                          bizquest.com, and loopnet.com, etc.
                        </p>
                      </li>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          B. <b>Marketing Termination.</b> Broker and Brokerage
                          Firm may discontinue using any marketing materials if,
                          in Brokerage Firm’s sole discretion, Broker or
                          Brokerage Firm receives a credible threat of
                          litigation or a complaint regarding the use of such
                          marketing material. Upon expiration of the Listing
                          Period and request from Seller, Broker will use
                          reasonable efforts to remove information submitted to
                          the Internet platforms. Seller understands that
                          information submitted to some of the Internet
                          platforms may be difficult, if not impossible, to
                          remove from syndicators and the Internet and releases
                          Broker from any liability for Broker’s inability to
                          remove the information.
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                9. SELLER’S OBLIGATION TO BROKER; DISCLOSURES AND CONSENT.
                <ul style={{ listStyle: "upper-alpha" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      A. <b>Negotiations and Communication.</b> Seller agrees to
                      conduct all negotiations for the Sale of the Business
                      Opportunity only through Broker, and to refer to Broker
                      all communications received in any form from real estate
                      brokers, prospective buyers, tenants or any other source
                      during the Listing Period of this Seller Listing Contract.
                    </p>
                  </li>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      B. <b>Advertising.</b> Seller agrees that the Broker or
                      Brokerage Firm will have the sole and exclusive right to
                      advertise the Business Opportunity for sale.
                    </p>
                  </li>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      C. <b>No Existing Listing Agreement.</b> Seller represents
                      that Seller is NOT currently a party to any listing
                      agreement with any other broker to sell the Business
                      Opportunity. Seller further represents that Seller has not
                      received a list of “Submitted Prospects” pursuant to a
                      previous listing agreement to sell the Business
                      Opportunity with any other broker.
                    </p>
                  </li>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      D. <b>Ownership of Materials and Consent.</b> Seller
                      represents that all materials (including all photographs,
                      renderings, images, videos or other creative items)
                      supplied to Broker by or on behalf of Seller are owned by
                      Seller, except as Seller has disclosed in writing to
                      Broker. Seller is authorized to and grants to Broker,
                      Brokerage Firm and any Internet platform (that Broker
                      submits the Business Opportunity to) a nonexclusive
                      irrevocable, royalty-free license to use such material for
                      marketing of the Business Opportunity, reporting as
                      required and the publishing, display and reproduction of
                      such material, compilation and data. This license survives
                      the termination of this Seller Listing Contract. Unless
                      agreed to otherwise, all materials provided by Broker
                      (photographs, renderings, images, videos, or other
                      creative items) may not be used by Seller for any reason.
                    </p>
                  </li>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      E. <b>Due Diligence and Cooperation.</b> Seller agrees to
                      promptly provide due diligence information or due
                      diligence documents reasonably requested by Broker or a
                      potential purchaser and to cooperate with potential
                      purchaser in all due diligence investigations. Seller
                      understands and hereby acknowledges that all facts,
                      figures, and additional supporting documentation
                      pertaining to Business Opportunity has been provided to
                      Broker by Seller, and that Broker will rely upon Seller’s
                      representation of such facts, figures, and other
                      information when describing and promoting the business,
                      without making an investigation of the accuracy of such
                      representation by Seller. Therefore, Seller hereby
                      represents and warrants that all such facts, figures, and
                      all additional supporting documents including information
                      contained in the discovery and due diligence period are
                      true and accurate. Seller represents and warrants that
                      Seller and Business Opportunity are now and shall remain,
                      in full compliance with all local, state and federal laws,
                      rules and regulations regarding the operation and sale of
                      Business Opportunity and that Seller shall continue to
                      operate the business consistent with customary business
                      practices including maintenance of historical inventory
                      levels and maintenance of all equipment in good working
                      order. Seller hereby agrees to indemnify and hold harmless
                      Broker against any and all claims, demands, causes for
                      actions, losses, damages, costs and expenses including
                      reasonable attorney's fees and fees on appeals arising out
                      of breach of the warranty.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                10. PRICE AND TERMS.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      The following Price and Terms are acceptable to Seller:
                    </p>
                    <ul style={{ listStyle: "upper-alpha" }}>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          A. <b>Initial Asking Price Of Business.</b> U.S. $
                          {allValues?.askng_business_price} plus inventory of $
                          {allValues?.asking_plus_inventory_price}
                        </p>
                      </li>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          B. <b>Initial Asking Price Of CRE.</b> U.S. $
                          {allValues?.asking_price_of_cre}
                        </p>
                      </li>
                      <li style={{ fontWeight: "400" }}>
                        <p
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}>
                          C.
                          <b>Terms.</b>
                          {
                            <Checkbox
                              label={"Cash"}
                              value={allValues?.cash == "yes" && "Cash"}
                              setValue={() => {
                                return;
                              }}
                            />
                          }
                          {
                            <Checkbox
                              label={"SBA"}
                              value={allValues?.sba == "yes" && "SBA"}
                              setValue={() => {
                                return;
                              }}
                            />
                          }
                          <b>Other: {allValues?.other}</b>
                        </p>
                      </li>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          D. <b>Closing Costs.</b> The closing costs will be
                          shared ½ by Buyer and ½ by Seller.
                        </p>
                      </li>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          E. <b>Earnest Money.</b> Minimum amount of earnest
                          money to be deposited by a Buyer upon mutually
                          executed contract U.S. ${allValues?.earnest_money} in
                          the form of a personal check, business check, or wire
                          transfer.
                        </p>
                      </li>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          F. <b>Seller Proceeds.</b> Seller will receive net
                          proceeds of closing via Wire Transfer to an account
                          specified by Seller, at Seller’s expense; or Closing
                          Company’s Trust Account Check. Wire and other frauds
                          occur in real estate transactions. Any time Seller is
                          supplying confidential information such as social
                          security numbers or bank account numbers, Seller
                          should provide the information in person or in another
                          secure manner.
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                11. DEPOSITS.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      Brokerage Firm is authorized to accept earnest money
                      deposits received by Broker pursuant to a proposed
                      contract for the Sale of the Business Opportunity.
                      Brokerage Firm is authorized to deliver the earnest money
                      deposit to the closing agent, if any, at or before the
                      closing of the contract for the Sale of the Business
                      Opportunity.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                12. INCLUSIONS AND EXCLUSIONS.
                <ul style={{ listStyle: "upper-alpha" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      A. <b>Inclusions.</b> The Purchase Price includes the
                      following items (Inclusions): any and all furniture,
                      fixtures, equipment, tenant improvements, tenant fixtures,
                      tangible and intangible personal property, telephone and
                      facsimile numbers, goodwill, signs, inventory, stock in
                      trade, supplies, promotional materials, contracts and
                      equipment leases accepted by Buyer, websites and their
                      contents and all domain names, unexpired warranties and
                      equipment manuals, and trade name of the Business
                      Opportunity, unless excluded under §12.B (Exclusions)
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      B. <b>Conveyance.</b> Any and all Inclusions must be
                      conveyed by Seller free and clear of all taxes (except
                      personal property taxes for the year of Closing), liens
                      and encumbrances, except xxx. Conveyance of all Inclusions
                      will be by Bill of Sale or other applicable legal
                      instrument.
                    </p>
                    <ul style={{ listStyle: "lower-roman" }}>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          i. <b>Other Inclusions.</b> The following items,
                          whether fixtures or personal Business Opportunity, are
                          also included in the Purchase Price.
                        </p>
                      </li>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          ii. <b>Leased Items.</b> The following leased items
                          are part of the transaction:
                          {allValues?.leased_items_transaction}.
                        </p>
                      </li>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          iii. <b>Lease Documents.</b> Seller agrees to supply
                          to buyer, as will be set forth in the final contract
                          between Seller and buyer, the documents between Seller
                          and Seller’s lessor regarding the lease, leased item,
                          cost and other terms including requirements imposed
                          upon a buyer if buyer is assuming the leases.
                        </p>
                      </li>
                    </ul>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      C. <b>Exclusions.</b> The following are excluded
                      (Exclusions):{allValues?.price_exclusions}.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                13. TITLE AND ENCUMBERANCES.
                <ul style={{ listStyle: "upper-alpha" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      A. <b>Seller Representation.</b> Seller represents that
                      title to the Business Opportunity is solely in Seller’s
                      name.
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      B. <b>Delivery of Documents.</b> Seller must deliver to
                      Broker true copies of all relevant title materials,
                      leases, liens and other encumbrances, if any, on the
                      Business Opportunity, of which Seller has knowledge.
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      C.
                      <b>Monetary Encumbrances.</b> Business Opportunity must be
                      conveyed free and clear of all taxes, except the general
                      taxes for the year of closing. All monetary encumbrances
                      (such as mortgages, deeds of trust, liens, financing
                      statements) must be paid by Seller and released except as
                      Seller and buyer may otherwise agree. Existing monetary
                      encumbrances are as follows:{" "}
                      {allValues?.existing_monetary}. If the Business
                      Opportunity has been or will be subject to any
                      governmental liens for special improvements installed at
                      the time of signing a contract for the Sale of the
                      Business Opportunity, Seller is responsible for payment of
                      same, unless otherwise agreed.
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      D.
                      <b>Tenancies.</b> The Business Opportunity will be
                      conveyed subject to the following leases and tenancies for
                      possession of the Business Opportunity:{" "}
                      {allValues?.seller_info}
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                14. POSSESSION.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      Possession of the Business Opportunity will be delivered
                      to buyer at closing, subject to leases and tenancies as
                      described in § 13.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                15. MATERIAL DEFECTS, DISCLOSURES AND INSPECTION.
                <ul style={{ listStyle: "upper-alpha" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      A. <b>Broker’s Obligations.</b> Colorado law requires a
                      broker to disclose to any prospective buyer all adverse
                      material facts actually known by such broker including but
                      not limited to adverse material facts pertaining to the
                      title to the Business Opportunity and the physical
                      condition of the Business Opportunity, any material
                      defects in the Business Opportunity, and any environmental
                      hazards affecting the Business Opportunity which are
                      required by law to be disclosed. These types of
                      disclosures may include such matters as structural
                      defects, soil conditions, violations of health, zoning or
                      building laws, and nonconforming uses and zoning
                      variances. Seller agrees that any buyer may have the
                      Business Opportunity and Inclusions inspected and
                      authorizes Broker to disclose any facts actually known by
                      Broker about the Business Opportunity.
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      B. <b>Seller’s Obligations.</b>
                    </p>
                    <ul style={{ listStyle: "lower-roman" }}>
                      <li style={{ fontWeight: "400" }}>
                        <p>
                          i. <b>Condition of Business Opportunity.</b> The
                          Business Opportunity will be conveyed in the condition
                          existing as of the date of the contract for Sale or
                          Lease of the Business Opportunity, ordinary wear and
                          tear excepted, unless Seller, at Seller’s sole option,
                          agrees in writing to any repairs or other work to be
                          performed by Seller.
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                16. RIGHTS OF PARTIES TO CANCEL.
                <ul style={{ listStyle: "upper-alpha" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      A. <b>Right of Seller to Cancel.</b> In the event Broker
                      defaults under this Seller Listing Contract, Seller has
                      the right to cancel this Seller Listing Contract,
                      including all rights of Brokerage Firm to any compensation
                      if the Seller Agency box is checked. Examples of a Broker
                      default include, but are not limited to (1) abandonment of
                      Seller, (2) failure to fulfill all material obligations of
                      Broker and (3) failure to fulfill all material Uniform
                      Duties (§ 5) or, if the Seller Agency box at the top of
                      page 1 is checked, the failure to fulfill all material
                      Additional Duties Of Seller’s Agent (§ 6). Any rights of
                      Seller that accrued prior to cancellation will survive
                      such cancellation. Should Seller decide to terminate this
                      Seller Listing Contract for any other reason, the
                      Brokerage Firm shall be entitled to the Sale Commission
                      outlined in § 7.A.i.
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      B. <b>Right of Broker to Cancel.</b> Brokerage Firm may
                      cancel this Seller Listing Contract upon written notice to
                      Seller that the Business Opportunity is not satisfactory
                      to Brokerage Firm. Although Broker has no obligation to
                      investigate or inspect the Business Opportunity, and no
                      duty to verify statements made, Brokerage Firm has the
                      right to cancel this Seller Listing Contract if any of the
                      following are unsatisfactory (1) the physical condition of
                      the Business Opportunity or Inclusions, or (2) Seller
                      willfully misrepresents facts, financial information, or
                      supporting documentation related to Business Opportunity,
                      which adversely affects the ability to consummate a Sale
                      of Business Opportunity, or (3) any other activity or
                      nuances of the Business Opportunity and its effect or
                      expected effect on the Business Opportunity or its
                      occupants, or (4) any facts or suspicions regarding
                      circumstances that could psychologically impact or
                      stigmatize the Business Opportunity. Additionally,
                      Brokerage Firm has the right to cancel this Seller Listing
                      Contract if Seller or occupant of the Business Opportunity
                      fails to reasonably cooperate with Broker or Seller
                      defaults under this Seller Listing Contract. Any rights of
                      Brokerage Firm that accrued prior to cancellation will
                      survive such cancellation.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                17. FORFEITURE OF PAYMENTS.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      In the event of a forfeiture of payments made by a buyer,
                      the sums received will be divided between Brokerage Firm
                      and Seller, one-half to Brokerage Firm but not to exceed
                      the Brokerage Firm compensation agreed upon herein, and
                      the balance to Seller. Any forfeiture of payment under
                      this section will not reduce any Brokerage Firm
                      compensation owed, earned and payable under §7.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                18. COST OF SERVICES AND REIMBURSEMENT.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      Unless otherwise agreed upon in writing, Brokerage Firm
                      must bear all expenses incurred by Brokerage Firm, if any,
                      to market the Business Opportunity and to compensate
                      cooperating brokerage firms, if any. Neither Broker nor
                      Brokerage Firm will obtain or order any other products or
                      services unless Seller agrees in writing to pay for them
                      promptly when due (examples: title reports, Business
                      Opportunity valuations, inspections, etc.). Unless
                      otherwise agreed, neither Broker nor Brokerage Firm is
                      obligated to advance funds for Seller. Seller must
                      reimburse Brokerage Firm for payments made by Brokerage
                      Firm for such products or services authorized by Seller.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                19. DISCLOSURE OF SETTLEMENT COSTS.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      Seller acknowledges that costs, quality, and extent of
                      service vary between different settlement service
                      providers (e.g., attorneys, lenders, inspectors, and title
                      companies).
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                20. MAINTENANCE OF THE BUSINESS OPPORTUNITY.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      Neither Broker nor Brokerage Firm is responsible for
                      maintenance of the Business Opportunity nor are they
                      liable for damage of any kind occurring to the Business
                      Opportunity unless such damage is caused by their
                      negligence or intentional misconduct.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                21. NONDISCRIMINATION.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      The parties agree not to discriminate unlawfully against
                      any prospective buyers because of their inclusion in a
                      “protected class” as defined by federal, state or local
                      law. “Protected classes” include, but are not limited to,
                      race, creed, color, sex, sexual orientation, gender
                      identity, marital status, familial status, physical or
                      mental disability, handicap, religion, national origin, or
                      ancestry of such person. Seller authorizes Broker to
                      withhold any supplemental information about the
                      prospective buyer if such information would disclose a
                      buyer’s protected class(es). However, any financial,
                      employment or credit worthiness information about the
                      buyer received by Broker will be submitted to Seller.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                22. RECOMMENDATION OF LEGAL AND TAX COUNSEL.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      By signing this document, Seller acknowledges that Broker
                      has advised that this document has important legal
                      consequences and has recommended consultation with legal
                      and tax or other counsel before signing this Seller
                      Listing Contract.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                23. MEDIATION.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      If a dispute arises relating to this Seller Listing
                      Contract, prior to or after closing, and is not resolved,
                      the parties must first proceed in good faith to submit the
                      matter to mediation. Mediation is a process in which the
                      parties meet with an impartial person who helps to resolve
                      the dispute informally and confidentially. Mediators
                      cannot impose binding decisions. The parties to the
                      dispute must agree, in writing, before any settlement is
                      binding. The parties will jointly appoint an acceptable
                      mediator and will share equally in the cost of such
                      mediation. The mediation, unless otherwise agreed, will
                      terminate in the event the entire dispute is not resolved
                      within 30 calendar days of the date written notice
                      requesting mediation is delivered by one party to the
                      other at the other party’s last known address.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                24. ATTORNEY FEES.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      In the event of any arbitration or litigation relating to
                      this Seller Listing Contract, the arbitrator or court must
                      award to the prevailing party all reasonable costs and
                      expenses, including attorney and legal fees.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                25. ADDITIONAL PROVISIONS/:
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>{allValues?.additional_provisions}</p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                26. ATTACHMENTS:
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      The following are a part of this Exclusive Right To Sell
                      Listing Contract:
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                27. NO OTHER PARTY OR INTENDED BENEFICIARIES.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      Nothing in this Seller Listing Contract is deemed to inure
                      to the benefit of any person other than Seller, Broker and
                      Brokerage Firm.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                28. NOTICE, DELIVERY AND CHOICE OF LAW.
                <ul style={{ listStyle: "upper-alpha" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      A. <b>Physical Delivery and Notice.</b> Any document or
                      notice to Brokerage Firm or Seller must be in writing,
                      except as provided in § 27.B and is effective when
                      physically received by such party, or any individual named
                      in this Seller Listing Contract to receive documents or
                      notices for such party.
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      B. <b>Electronic Notice and Delivery.</b> As an
                      alternative to physical delivery, any notice, may be
                      delivered in electronic form to Brokerage Firm or Seller,
                      or any individual named in this Seller Listing Contract to
                      receive documents or notices for such party at the
                      electronic address of the recipient by facsimile, email or
                      by Brokerage Firm’s Customer Relationship Management
                      system.
                    </p>
                  </li>

                  <li style={{ fontWeight: "400" }}>
                    <p>
                      C. <b>Choice of Law.</b> This Seller Listing Contract and
                      all disputes arising hereunder are governed by and
                      construed in accordance with the laws of the State of
                      Colorado that would be applicable to Colorado residents
                      who sign a contract in Colorado for real property located
                      in Colorado.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                29. MODIFICATION OF THIS SELLER LISTING CONTRACT.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      No subsequent modification of any of the terms of this
                      Seller Listing Contract is valid, binding upon the
                      parties, or enforceable unless made in writing and signed
                      by the parties.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                30. COUNTERPARTS.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      This Seller Listing Contract may be executed by each of
                      the parties, separately, and when so executed by all the
                      parties, such copies taken together are deemed to be a
                      full and complete contract between the parties.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                31. ENTIRE AGREEMENT.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      This agreement constitutes the entire contract between the
                      parties, and any prior agreements, whether oral or
                      written, have been merged and integrated into this Seller
                      Listing Contract.
                    </p>
                  </li>
                </ul>
              </li>

              <li style={{ fontWeight: "800" }}>
                32. COPY OF CONTRACT.
                <ul style={{ listStyle: "none" }}>
                  <li style={{ fontWeight: "400" }}>
                    <p>
                      Seller acknowledges receipt of a copy of this Seller
                      Listing Contract signed by Broker, including all
                      attachments.
                    </p>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="detail_line" style={{ marginTop: "50px" }}>
            <p>
              Brokerage Firm authorizes Broker to execute this Seller Listing
              Contract on behalf of Brokerage Firm.
            </p>
            <p>
              By proceeding, you agree that Business Brokerage Services may
              communicate with you via telephone, video, email, text messages,
              or other media and messaging applications. Message and data rates
              may apply. If you would like to opt out at any time, please send
              an email with "STOP" to ask@denverbbs.com.
            </p>
          </div>

          <div className="seller_info_sec" style={{ marginTop: "70px" }}>
            <span style={{ textTransform: "uppercase" }}>
              <b>SELLER:</b>
            </span>
            <div
              className="seller_name"
              style={{ marginTop: "40px", marginBottom: "50px" }}>
              <span
                style={{
                  borderBottom: "1px solid black",
                  padding: "0 30px 5px 30px",
                  width: "190px",
                  display: "block",
                }}></span>
            </div>
            <p style={{ marginBottom: "0", marginTop: "0" }}>
              By: <span>{data?.seller_title}</span> for{" "}
              <span>{data?.listingTitle}</span>
            </p>
            <p style={{ marginBottom: "0", marginTop: "0" }}>
              Title: <span>{data?.seller_title}</span>
            </p>
            <p style={{ marginBottom: "0", marginTop: "0" }}>
              Telephone: <span>{data?.seller_phone}</span>
            </p>
            <p style={{ marginBottom: "0", marginTop: "0" }}>
              Email: <span>{data?.seller_email}</span>
            </p>
          </div>

          <div className="seller_info_sec" style={{ marginTop: "70px" }}>
            <span style={{ textTransform: "uppercase" }}>
              <b>BROKER:</b>
            </span>
            <div
              className="seller_name"
              style={{ marginTop: "40px", marginBottom: "50px" }}>
              <span
                style={{
                  borderBottom: "1px solid black",
                  padding: "0 30px 5px 30px",
                  width: "190px",
                  display: "block",
                }}></span>
            </div>
            <p style={{ marginBottom: "0", marginTop: "0" }}>
              Business Brokerage Services, LLC
            </p>
            <p style={{ marginBottom: "0", marginTop: "0" }}>
              {data?.broker_name}, Broker
            </p>
            <p style={{ marginBottom: "0", marginTop: "0" }}>
              Telephone: <span>{data?.broker_phone}</span>
            </p>
            <p style={{ marginBottom: "0", marginTop: "0" }}>
              Email: <span>{data?.broker_email}</span>
            </p>
          </div>
        </div>

        {/* content */}
      </div>
      {showModal && (
        <ListingAgreementModal
          show={showModal}
          setShow={setShowModal}
          handleSubmit={HandleSetData}
          preFetchedData={{
            askng_business_price: data?.askng_business_price,
            asking_plus_inventory_price: data?.asking_plus_inventory_price,
          }}
        />
      )}
    </>
  );
};

export default ListingAPA;
