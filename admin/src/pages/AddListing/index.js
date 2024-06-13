import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input/Input";
import { TextArea } from "../../Component/TextArea";
import classes from "./AddListing.module.css";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { useState } from "react";
import UploadImageBox from "../../Component/UploadImageBox";
import {
  apiHeader,
  BaseURL,
  formRegEx,
  formRegExReplacer,
} from "../../config/apiUrl";
import { Patch, Get, Post } from "../../Axios/AxiosFunctions";
import { toast } from "react-toastify";
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import AddMultiValueInputContainer from "../../Component/AddMultiValueInputContainer";
import AddMultiValueInputWithDropDownContainer from "../../Component/AddMultiValueInputWithDropDownContainer";
import AddMultiValueWithMultipleInput from "../../Component/AddMultiValueWithMultipleInput";
import AddMoreBtn from "../../Component/AddMoreBtn";
import UploadCSVBox from "../../Component/UploadCsvBox";
import { CsvToJsonConvertion } from "../../Helper/CsvToJsonConvertion";
import { Radio } from "../../Component/Radio/Radio";
import Maps from "../../Component/MapAndPlaces";
import { Checkbox } from "../../Component/Checkbox/Checkbox";
import {
  amountTypeOptions,
  createListingstatusOptions,
  onlinePresenceOptions,
} from "../../constant/commonData";
import AddMultiItemYearWithList from "../../Component/AddMultiItemYearWithList";

const AddListing = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.authReducer?.access_token);
  const user = useSelector((state) => state.authReducer?.user);

  const { allBrokers, allCategories, allOwners } = useSelector(
    (state) => state.commonReducer
  );
  const isAdmin = !user?.role?.includes("broker");

  // New State Start
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(createListingstatusOptions[0]);
  const [listingId, setListingId] = useState("");
  // For Places Api
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessAddressCoordinates, setBusinessAddressCoordinates] =
    useState(null);
  const [businessAddressDetail, setBusinessAddressDetail] = useState(null);
  const [businessOpportunity, setBusinessOpportunity] = useState("");
  const [realState, setRealState] = useState("");
  const [cashFlow, setCashFlow] = useState("");
  const [inventory, setInventory] = useState("");
  const [salesRevenue, setSalesRevenue] = useState("");
  const [fullTimeEmployee, setFullTimeEmployee] = useState("");
  const [partTimeEmployee, setPartTimeEmployee] = useState("");
  const [businessPlacesApiAddress, setBusinessPlacesApiAddress] = useState("");
  const [ownerInvolvment, setOwnerInvolvment] = useState("");
  const [reasonForSelling, setReasonForSelling] = useState("");
  const [dummyDescription, setDummyDescription] = useState("");
  const [realDescription, setRealDescription] = useState("");
  const [busniessHighlightText, setBusniessHighlightText] = useState("");
  const [businessHighlights, setBusinessHighlights] = useState([]);
  const [onlinePresenceInputState, setOnlinePresenceInputState] = useState({
    key: "",
    link: "",
  });
  const [onlinePresence, setOnlinePresence] = useState([]);

  const [prosText, setProsText] = useState("");
  const [pros, setPros] = useState([]);
  const [consText, setConsText] = useState("");
  const [cons, setCons] = useState([]);
  const [propertyInformation, setPropertyInformation] = useState({
    title: "",
    description: "",
    leaseRate: "",
    leaseInformation: "",
  });

  const [hoursOfOperationText, setHoursOfOperationText] = useState({
    days: "",
    hours: "",
  });
  const [hoursOfOperation, setHoursOfOperation] = useState([]);
  const [
    hoursOfOperationOpportunityDescription,
    setHoursOfOperationOpportunityDescription,
  ] = useState("");
  const [financingOptions, setFinancingOptions] = useState([]);
  const [recentImprovements, setRecentImprovements] = useState([]);
  const [financialCSV, setFinancialCSV] = useState([{}, {}]);
  const [convertedFinancialCSV, setConvetedFinancialCSV] = useState([{}, {}]);

  const [financialDescription, setFinancialDescription] = useState("");
  const [financialImages, setFinancialImages] = useState([{}, {}, {}]);
  const [demographics, setDemographics] = useState([{}, {}, {}, {}, {}]);
  const [galleryImages, setGalleryImages] = useState([{}, {}, {}, {}, {}]);
  const [pictureDemo, setPictureDemo] = useState(null);
  const [assignBroker, setAssignBroker] = useState([]);

  const [companyName, setCompanyName] = useState("");

  const [amountTypeAndValue, setAmountTypeAndValue] = useState({
    ...amountTypeOptions[0],
    amount: 0,
  });
  const [buildingSf, setBuildingSf] = useState("");
  const [category, setCategory] = useState("");
  const [owner, setOwner] = useState("");
  const [autoNDA, setAutoNDA] = useState("");

  const [order, setOrder] = useState("");
  const [isFeatured, setIsFeatured] = useState("");

  // New State End

  // For Api's States
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [financialsMediaType, setFinancialsMediaType] = useState("Images");
  const [financialsCSVImages, setFinancialsCSVImages] = useState([{}, {}]);
  
  // For Upload Images
  async function uploadImages(slug, type) {
    const url = BaseURL(
      type == "draft"
        ? "business/update-draft-images"
        : "business/update-images"
    );
    const filesArray = {
      demographics: demographics?.filter(
        (item) => typeof item == "object" && item?.name
      ),
      images: galleryImages?.filter(
        (item) => typeof item == "object" && item?.name
      ),
      financialsAnalysis: financialImages?.filter(
        (item) => typeof item == "object" && item?.name
      ),
      financialsCSVImages: financialsCSVImages?.filter(
        (item) => typeof item == "object" && item?.name
      ),
    };
    let formData = new FormData();
    for (let key in filesArray) {
      filesArray[key]?.map((item) => {
        formData.append(key, item);
      });
    }

    formData.append("dummyImage", pictureDemo);
    formData.append(type == "draft" ? "draftId" : "slug", slug);

    const res = await Patch(url, formData, apiHeader(accessToken, true));
    return res;
  }
  // for add listing
  async function addListing() {
    const newData = [...convertedFinancialCSV];
    financialCSV?.map((item, i) => {
      CsvToJsonConvertion(item, (data) => {
        newData[i] = data;
        setConvetedFinancialCSV(newData);
      });
    });

    const url = BaseURL("business/create");
    let params = {
      title,
      status: status?.value,
      category: category?._id,
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error(
          `Please fill the ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()} field`
        );
      }
    }

    // location:{}

    // Array Validations
    let array = {
      broker: assignBroker?.map((item) => item?._id),
    };

    for (let key in array) {
      if (key == "recentImprovements") {
        for (let a in array[key])
          if (array[key][a]?.features?.length == 0)
            return toast.error(
              `Please provide the recent improvements features`
            );
      }
      if (array[key]?.length == 0) {
        return toast.error(
          `Please provide the ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()}`
        );
      }
    }
    // For Form Data
    params = {
      ...params,
      ...array,
      propertyInformation,
      ...(businessAddressCoordinates !== null && {
        longitude: businessAddressCoordinates?.lng,
        latitude: businessAddressCoordinates?.lat,
        country: businessAddressDetail?.country,
        state: businessAddressDetail?.state,
        city: businessAddressDetail?.city,
      }),
      ...(financialsMediaType !== "Images" && {
        financialsCSV1: convertedFinancialCSV[0],
        financialsCSV2: convertedFinancialCSV[1],
      }),
    };

    params = {
      ...params,
      autoNdaApprove: autoNDA == "" ? false : true,
      fullTimeEmployees: Number(fullTimeEmployee),
      partTimeEmployees: Number(partTimeEmployee),
      googleMapAddress: businessPlacesApiAddress,
      owner: owner?._id,
      // New Changes
      refId: listingId,
      businessAddress,
      buildingSF: buildingSf,
      companyName,
      ownerInvolvment,
      reason: reasonForSelling,
      dummyDescription,
      description: realDescription,
      financialsDescription: financialDescription,
      industry: realState,
      pros,
      cons,
      businessHighlights,
      thirdPartyPresence: onlinePresence,
      hoursOfOperation,
      recentImprovements,
      financingOptions: financingOptions?.map((item) => item?.label),
      amountType: amountTypeAndValue?.value,
      ...(amountTypeAndValue?.value == "rent"
        ? {
            monthlyRent: Number(amountTypeAndValue?.amount),
          }
        : {
            realEstate: Number(amountTypeAndValue?.amount),
          }),
      // askingPrice: Number(askingPrice),
      cashFlow: Number(cashFlow),
      inventory: Number(inventory),
      grossSales: Number(salesRevenue),
      businessOpportunity: Number(businessOpportunity),
      hoursOfOperationOpportunity: hoursOfOperationOpportunityDescription,
      order: Number(order),
      isFeatured: isFeatured !== "",
    };
    setIsAdding(true);

    const response = await Post(url, params, apiHeader(accessToken));
    if (response !== undefined) {
      await uploadImages(response?.data?.slug);
      await toast.success("Listing added successfully");
      navigate(-1);
    }
    setIsAdding(false);
  }
  // for add listing to draft
  async function addToDraft() {
    const url = BaseURL(`business/create-draft`);
    let params = {
      title,
      status: status?.value,
      refId: listingId,
      businessAddress,
      googleMapAddress: businessPlacesApiAddress,
      buildingSF: buildingSf,
      ...(category !== "" && {
        category: category?._id,
      }),
      companyName,
      owner: owner?._id,
      ownerInvolvment,
      reason: reasonForSelling,
      dummyDescription,
      description: realDescription,
      financialsDescription: financialDescription,
      hoursOfOperationOpportunity: hoursOfOperationOpportunityDescription,
      industry: realState,
      pros,
      cons,
      businessHighlights,
      thirdPartyPresence: onlinePresence,
      hoursOfOperation,
      recentImprovements,
      financingOptions: financingOptions?.map((item) => item?.label),
      broker: assignBroker?.map((item) => item?._id),
      propertyInformation,
      longitude: businessAddressCoordinates?.lng,
      latitude: businessAddressCoordinates?.lat,
      country: businessAddressDetail?.country,
      state: businessAddressDetail?.state,
      city: businessAddressDetail?.city,
      ...(financialsMediaType !== "Images" && {
        financialsCSV1: convertedFinancialCSV[0],
        financialsCSV2: convertedFinancialCSV[1],
      }),
      amountType: amountTypeAndValue?.value,
      ...(amountTypeAndValue?.value == "rent"
        ? {
            monthlyRent: Number(amountTypeAndValue?.amount),
          }
        : {
            realEstate: Number(amountTypeAndValue?.amount),
          }),
      // askingPrice: Number(askingPrice),
      cashFlow: Number(cashFlow),
      fullTimeEmployees: Number(fullTimeEmployee),
      partTimeEmployees: Number(partTimeEmployee),
      inventory: Number(inventory),
      grossSales: Number(salesRevenue),
      businessOpportunity: Number(businessOpportunity),
      autoNdaApprove: autoNDA == "" ? false : true,
    };
    setIsSaving(true);
    const response = await Post(url, params, apiHeader(accessToken));
    if (response !== undefined) {
      await uploadImages(response?.data?.data?._id, "draft");
      await toast.success("Listing added in the draft successfully");
      navigate(-1);
    }
    setIsSaving(false);
  }

  return (
    <>
      <SideBarSkeleton>
        <div className={classes.container_main}>
          <div className={classes.main_heading}>
            <h4>Add Listing</h4>
            <Button
              label={isSaving ? "Saving..." : "Save to Draft"}
              onClick={addToDraft}
            />
          </div>

          <Row className={"gy-4"}>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setTitle}
                  value={title}
                  placeholder={"Enter Title"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.dropdown_main}>
                <DropDown
                  setter={setStatus}
                  value={status}
                  placeholder={"Select Status"}
                  options={createListingstatusOptions}
                  optionLabel={"label"}
                  optionValue={"value"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setListingId}
                  value={listingId}
                  placeholder={"Enter Listing Id"}
                  type={"text"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setBusinessAddress}
                  value={businessAddress}
                  placeholder={"Business Address"}
                  type={"text"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setBusinessOpportunity}
                  value={businessOpportunity}
                  placeholder={"Business Opportunity Price"}
                  type={"number"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setRealState}
                  value={realState}
                  placeholder={"Enter Industry"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setCashFlow}
                  value={cashFlow}
                  placeholder={"Enter Cash Flow"}
                  type={"number"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setInventory}
                  value={inventory}
                  placeholder={"Enter Inventory"}
                  type={"number"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setSalesRevenue}
                  value={salesRevenue}
                  placeholder={"Enter Sales Revenue"}
                  type={"number"}
                />
              </div>
            </Col>

            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <DropDown
                  setter={(e) =>
                    setAmountTypeAndValue((prev) => ({ ...prev, ...e }))
                  }
                  value={amountTypeAndValue}
                  placeholder={"Select"}
                  options={amountTypeOptions}
                  optionLabel={"label"}
                  optionValue={"value"}
               />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={(e) =>
                    setAmountTypeAndValue((prev) => ({ ...prev, amount: e }))
                  }
                  value={amountTypeAndValue?.amount}
                  placeholder={`Enter ${amountTypeAndValue?.label}`}
                  type={"number"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setBuildingSf}
                  value={buildingSf}
                  placeholder={"Enter Building Square Feet"}
                  type={"number"}
                />
              </div>
            </Col>

            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setFullTimeEmployee}
                  value={fullTimeEmployee}
                  placeholder={"Enter Full Time Employee"}
                  type={"number"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setPartTimeEmployee}
                  value={partTimeEmployee}
                  placeholder={"Enter Part Time Employee"}
                  type={"number"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Maps
                  setAddress={setBusinessPlacesApiAddress}
                  address={businessPlacesApiAddress}
                  setCoordinates={setBusinessAddressCoordinates}
                  setPlaceDetail={setBusinessAddressDetail}
                  type={"Places"}
                  loader={
                    <Input
                      placeholder={"Business Location"}
                      label={"Business Location"}
                      type={"text"}
                    />
                  }
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.dropdown_main}>
                <DropDown
                  setter={setFinancingOptions}
                  value={financingOptions}
                  placeholder={"Select Financing Options"}
                  options={[
                    { label: "SBA" },
                    { label: "Cash" },
                    { label: "Conventional" },
                    { label: "Owner Financing" },
                  ]}
                  optionLabel={"label"}
                  optionValue={"label"}
                  isMulti={true}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.dropdown_main}>
                <DropDown
                  setter={setCategory}
                  value={category}
                  placeholder={"Select Category"}
                  options={allCategories?.filter((item) => {
                    const exx = category?._id == item?._id;
                    if (!exx) {
                      return item;
                    }
                  })}
                  optionLabel={"name"}
                  optionValue={"_id"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.dropdown_main}>
                <DropDown
                  setter={setAssignBroker}
                  value={assignBroker}
                  placeholder={"Select Broker"}
                  options={allBrokers?.filter((item) => {
                    const exx = assignBroker?.find((e) => e?._id == item?._id);
                    if (!exx) {
                      return item;
                    }
                  })}
                  optionValue={"_id"}
                  isMulti={true}
                  getOptionLabel={(option) => {
                    return `${option["firstName"]} ${option["lastName"]}`;
                  }}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setCompanyName}
                  value={companyName}
                  placeholder={"Enter Company Name"}
                  // type={"number"}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.dropdown_main}>
                <DropDown
                  setter={setOwner}
                  value={owner}
                  placeholder={"Select Owner"}
                  options={allOwners?.filter((item) => {
                    const exx = owner?._id == item?._id;
                    if (!exx) {
                      return item;
                    }
                  })}
                  optionValue={"_id"}
                  getOptionLabel={(option) => {
                    return `${option["firstName"]} ${option["lastName"]} (${option["email"]})`;
                  }}
                />
              </div>
            </Col>
            <Col xl={4} lg={6} sm={12}>
              <div className={classes.input_main}>
                <Input
                  setter={setOrder}
                  value={order}
                  placeholder={"Enter Order"}
                  type={"number"}
                />
              </div>
            </Col>

            <Col xl={6} lg={6} sm={12}>
              <AddMultiValueInputContainer
                title={""}
                inputValue={prosText}
                inputSetter={setProsText}
                arrayValue={pros}
                arraySetter={setPros}
                placeholder={"Add Pros"}
              />
            </Col>
            <Col xl={6} lg={6} sm={12}>
              <AddMultiValueInputContainer
                title={""}
                inputValue={consText}
                inputSetter={setConsText}
                arrayValue={cons}
                arraySetter={setCons}
                placeholder={"Add Cons"}
              />
            </Col>
            <Col lg={12} md={12} sm={12}>
              <AddMultiValueInputContainer
                title={""}
                inputValue={busniessHighlightText}
                inputSetter={setBusniessHighlightText}
                arrayValue={businessHighlights}
                arraySetter={setBusinessHighlights}
                placeholder={"Add Business Highlights"}
              />
            </Col>
            <Col lg={12} md={12} sm={12}>
              <AddMultiValueInputWithDropDownContainer
                title={"Third Party Presence"}
                inputValue={onlinePresenceInputState}
                inputSetter={setOnlinePresenceInputState}
                arrayValue={onlinePresence}
                arraySetter={setOnlinePresence}
                inputPlaceholder={"Enter Url"}
                dropDownPlaceholder={"Select platform"}
                dropDownValueKey={"key"}
                inputValueKey={"link"}
                dropDownoptions={onlinePresenceOptions?.filter((item) => {
                  const exx = onlinePresence?.find(
                    (e) => e?.key == item?.value
                  );
                  if (!exx) {
                    return item;
                  }
                })}
              />
            </Col>
            <Col lg={12} md={12} sm={12}>
              <AddMultiValueWithMultipleInput
                title={"Property Information"}
                inputValue={propertyInformation}
                inputSetter={setPropertyInformation}
                firstValueKey={"title"}
                secondValueKey={"description"}
                firstPlaceholder={"Enter Title"}
                secondPlaceholder={"Enter Description"}
                hideAddBtn={true}
                firstInputWidth={15}
              />
            </Col>
            <Col lg={4} md={4} sm={12}>
              <Input
                value={propertyInformation?.leaseRate}
                setter={(e) =>
                  setPropertyInformation({
                    ...propertyInformation,
                    leaseRate: e,
                  })
                }
                placeholder={"Enter lease rate"}
              />
            </Col>
            <Col lg={8} md={8} sm={12}>
              <Input
                value={propertyInformation?.leaseInformation}
                setter={(e) =>
                  setPropertyInformation({
                    ...propertyInformation,
                    leaseInformation: e,
                  })
                }
                placeholder={"Enter lease information"}
              />
            </Col>
            <Col lg={7} sm={12}>
              <AddMultiValueWithMultipleInput
                title={"Hours Of Operation"}
                inputValue={hoursOfOperationText}
                inputSetter={setHoursOfOperationText}
                arrayValue={hoursOfOperation}
                arraySetter={setHoursOfOperation}
                firstValueKey={"days"}
                secondValueKey={"hours"}
                firstPlaceholder={"Enter Days"}
                secondPlaceholder={"Enter Timings"}
              />
            </Col>
            <Col lg={5} sm={12}>
              <div className={classes.textArea_main}>
                <TextArea
                  placeholder={"Enter Description"}
                  label={"Hours Of Operation Opportunity"}
                  setter={setHoursOfOperationOpportunityDescription}
                  value={hoursOfOperationOpportunityDescription}
                  rows={1}
                />
              </div>
            </Col>
            <Col lg={6} sm={12}>
              <div className={classes.textArea_main}>
                <TextArea
                  placeholder={"Enter Owner Involement"}
                  setter={setOwnerInvolvment}
                  value={ownerInvolvment}
                  rows={5}
                />
              </div>
            </Col>
            <Col lg={6} sm={12}>
              <div className={classes.textArea_main}>
                <TextArea
                  placeholder={"Enter Reason For Selling"}
                  setter={setReasonForSelling}
                  value={reasonForSelling}
                  rows={5}
                />
              </div>
            </Col>
            <Col lg={6} sm={12}>
              <div className={classes.textArea_main}>
                <TextArea
                  placeholder={"Description Demo"}
                  setter={setDummyDescription}
                  value={dummyDescription}
                  rows={5}
                />
              </div>
            </Col>
            <Col lg={6} sm={12}>
              <div className={classes.textArea_main}>
                <TextArea
                  placeholder={"Enter Real Description"}
                  setter={setRealDescription}
                  value={realDescription}
                  rows={5}
                />
              </div>
            </Col>
            <Col lg={6} sm={12}>
              <Checkbox
                value={autoNDA}
                setValue={(e) => setAutoNDA(e)}
                label={"Automate"}
              />
            </Col>
            <Col lg={6} sm={12}>
              <div className={classes.checkboxDiv}>
                <Checkbox
                  setValue={setIsFeatured}
                  value={isFeatured}
                  label={"Featured"}
                />
              </div>
            </Col>

            <Col lg={12} md={12} sm={12}>
              <AddMultiItemYearWithList
                title={"Recent Improvement"}
                arrayValue={recentImprovements}
                arraySetter={setRecentImprovements}
              />
            </Col>

            <Col sm={12}>
              <label className={classes.label}>
                What do you want to upload in the financials section?
              </label>
              <div className={classes.financialsMediaType}>
                <Radio
                  value={financialsMediaType}
                  setValue={setFinancialsMediaType}
                  label={"Images"}
                />
                <Radio
                  value={financialsMediaType}
                  setValue={setFinancialsMediaType}
                  label={"CSVs"}
                />
              </div>
            </Col>

            <Col md={12}>
              {financialsMediaType == "Images" ? (
                <>
                  <div className={classes?.titleContainer}>
                    <span className={classes?.titleText}>
                      Financials (Images)
                    </span>
                    <AddMoreBtn
                      onClick={() => {
                        if (financialsCSVImages?.length < 6) {
                          setFinancialsCSVImages((pre) => [...pre, {}]);
                        } else {
                          toast.info(
                            "Maximum 6 images can upload on Financial Images"
                          );
                        }
                      }}
                    />
                  </div>
                  <div className={classes.galleryImages}>
                    {financialsCSVImages?.map((item, i) => (
                      <div className={classes.galleryImageDiv}>
                        <UploadImageBox
                          hideDeleteIcon={true}
                          state={item}
                          setter={(e) => {
                            const newImages = [...financialsCSVImages];
                            newImages[i] = e;
                            setFinancialsCSVImages(newImages);
                          }}
                          onDelete={() => {
                            const newImages = [...financialsCSVImages];
                            newImages.splice(i, 1);
                            setFinancialsCSVImages(newImages);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className={classes?.titleContainer}>
                    <span className={classes?.titleText}>Financials (CSV)</span>
                    <AddMoreBtn
                      onClick={() => {
                        if (financialCSV?.length < 2) {
                          setFinancialCSV((pre) => [...pre, {}]);
                        } else {
                          toast.info(
                            "Maximum 2 files can upload on Financial CSV"
                          );
                        }
                      }}
                    />
                  </div>
                  <div className={classes.csvContainer}>
                    {financialCSV?.map((item, i) => {
                      return (
                        <div className={classes.csvFileDiv}>
                          <UploadCSVBox
                            className={classes.csvBox}
                            state={item}
                            setter={async (e) => {
                              if (!["text/csv"].includes(e.type)) {
                                return toast.error("Please upload a csv file");
                              }
                              // max size 2MB
                              if (e?.size / 1024 / 1024 > 2)
                                return toast.error(
                                  "Please upload a valid image. [Max size: 2MB]"
                                );

                              const newCsvs = [...financialCSV];
                              newCsvs.splice(i, 1, e);
                              setFinancialCSV(newCsvs);

                              const newData = [...convertedFinancialCSV];
                              newCsvs?.map((item, i) => {
                                CsvToJsonConvertion(item, (data) => {
                                  newData[i] = data;
                                  setConvetedFinancialCSV(newData);
                                });
                              });
                            }}
                            onDelete={() => {
                              const newCsvs = [...financialCSV];
                              newCsvs.splice(i, 1);
                              setFinancialCSV(newCsvs);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Col>

            <Col sm={12}>
              <div className={classes.textArea_main}>
                <TextArea
                  placeholder={"Enter Financials Description"}
                  label={"Financials Description"}
                  setter={setFinancialDescription}
                  value={financialDescription}
                  rows={4}
                />
              </div>
            </Col>

            <Col md={12}>
              <div className={classes?.titleContainer}>
                <span className={classes?.imagesTitleText}>Picture (Demo)</span>
              </div>
              <div className={classes.galleryImages}>
                <div className={classes.galleryImageDiv}>
                  <UploadImageBox
                    setter={(e) => {
                      if (
                        !["image/jpeg", "image/png", "image/jpg"].includes(
                          e.type
                        )
                      ) {
                        return toast.error(
                          "Please upload a valid image. [jpg and png formats only]"
                        );
                      }
                      // max size 2MB
                      if (e?.size / 1024 / 1024 > 2)
                        return toast.error(
                          "Please upload a valid image. [Max size: 2MB]"
                        );
                      setPictureDemo(e);
                    }}
                    state={pictureDemo}
                    onDelete={() => setPictureDemo({})}
                  />
                </div>
              </div>
            </Col>
            <Col md={12}>
              <div className={classes?.titleContainer}>
                <span className={classes?.imagesTitleText}>
                  Financial Analysis
                </span>
                <AddMoreBtn
                  onClick={() => {
                    if (financialImages?.length < 10) {
                      setFinancialImages((pre) => [...pre, {}]);
                    } else {
                      toast.info(
                        "Maximum 10 images can upload on Financial Analysis"
                      );
                    }
                  }}
                />
              </div>
              <div className={classes.galleryImages}>
                {financialImages?.map((item, i) => {
                  return (
                    <div className={classes.galleryImageDiv}>
                      <UploadImageBox
                        hideDeleteIcon={true}
                        state={item}
                        setter={(e) => {
                          if (
                            !["image/jpeg", "image/png", "image/jpg"].includes(
                              e.type
                            )
                          ) {
                            return toast.error(
                              "Please upload a valid image. [jpg and png formats only]"
                            );
                          }
                          // max size 2MB
                          if (e?.size / 1024 / 1024 > 2)
                            return toast.error(
                              "Please upload a valid image. [Max size: 2MB]"
                            );
                          const newImages = [...financialImages];
                          newImages.splice(i, 1, e);
                          setFinancialImages(newImages);
                        }}
                        onDelete={() => {
                          const newImages = [...financialImages];
                          newImages.splice(i, 1);
                          setFinancialImages(newImages);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </Col>
            <Col md={12}>
              <div className={classes?.titleContainer}>
                <span className={classes?.imagesTitleText}>Demographic</span>

                <AddMoreBtn
                  onClick={() => {
                    if (demographics?.length < 10) {
                      setDemographics((pre) => [...pre, {}]);
                    } else {
                      toast.info("Maximum 10 images can upload on Demographic");
                    }
                  }}
                />
              </div>
              <div className={classes.galleryImages}>
                {demographics?.map((item, i) => {
                  return (
                    <div className={classes.galleryImageDiv}>
                      <UploadImageBox
                        hideDeleteIcon={true}
                        state={item}
                        setter={(e) => {
                          if (
                            !["image/jpeg", "image/png", "image/jpg"].includes(
                              e.type
                            )
                          ) {
                            return toast.error(
                              "Please upload a valid image. [jpg and png formats only]"
                            );
                          }
                          // max size 2MB
                          if (e?.size / 1024 / 1024 > 2)
                            return toast.error(
                              "Please upload a valid image. [Max size: 2MB]"
                            );
                          const newImages = [...demographics];
                          newImages.splice(i, 1, e);
                          setDemographics(newImages);
                        }}
                        onDelete={() => {
                          const newImages = [...demographics];
                          newImages.splice(i, 1);
                          setDemographics(newImages);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </Col>

            <Col md={12}>
              <div className={classes?.titleContainer}>
                <span className={classes?.imagesTitleText}>
                  Picture (Gallery)
                </span>
                <AddMoreBtn
                  onClick={() => {
                    if (galleryImages?.length < 10) {
                      setGalleryImages((pre) => [...pre, {}]);
                    } else {
                      toast.info("Maximum 10 images can upload on Gallery");
                    }
                  }}
                />
              </div>
              <div className={classes.galleryImages}>
                {galleryImages?.map((item, i) => {
                  return (
                    <div className={classes.galleryImageDiv}>
                      <UploadImageBox
                        hideDeleteIcon={true}
                        state={item}
                        setter={(e) => {
                          if (
                            !["image/jpeg", "image/png", "image/jpg"].includes(
                              e.type
                            )
                          ) {
                            return toast.error(
                              "Please upload a valid image. [jpg and png formats only]"
                            );
                          }
                          // max size 2MB
                          if (e?.size / 1024 / 1024 > 2)
                            return toast.error(
                              "Please upload a valid image. [Max size: 2MB]"
                            );
                          const newImages = [...galleryImages];
                          newImages.splice(i, 1, e);
                          setGalleryImages(newImages);
                        }}
                        onDelete={() => {
                          const newImages = [...galleryImages];
                          newImages.splice(i, 1);
                          setGalleryImages(newImages);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </Col>

            {isAdmin && (
              <Col lg={12} sm={12}>
                <Button
                  onClick={() => addListing()}
                  label={isAdding ? "Submitting..." : "Submit"}
                  className={classes.submit_btn}
                  disabled={isAdding}
                />
              </Col>
            )}
          </Row>
        </div>
      </SideBarSkeleton>
    </>
  );
};

export default AddListing;
