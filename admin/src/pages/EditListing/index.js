import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input/Input";
import { TextArea } from "../../Component/TextArea";
import classes from "./EditListing.module.css";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { useState } from "react";
import UploadImageBox from "../../Component/UploadImageBox";
import {
  apiHeader,
  BaseURL,
  formRegEx,
  formRegExReplacer,
} from "../../config/apiUrl";
import { Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AddMultiValueInputContainer from "../../Component/AddMultiValueInputContainer";
import AddMultiValueInputWithDropDownContainer from "../../Component/AddMultiValueInputWithDropDownContainer";
import AddMultiValueWithMultipleInput from "../../Component/AddMultiValueWithMultipleInput";
import AddMoreBtn from "../../Component/AddMoreBtn";
import UploadCSVBox from "../../Component/UploadCsvBox";
import { CsvToJsonConvertion } from "../../Helper/CsvToJsonConvertion";
import Loader from "../../Component/Loader";
import { Radio } from "../../Component/Radio/Radio";
import Maps from "../../Component/MapAndPlaces";
import { Checkbox } from "../../Component/Checkbox/Checkbox";
import {
  amountTypeOptions,
  createListingstatusOptions,
  onlinePresenceOptions,
} from "../../constant/commonData";
import AddMultiItemYearWithList from "../../Component/AddMultiItemYearWithList";

const EdiListing = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.authReducer?.access_token);
  const user = useSelector((state) => state.authReducer?.user);
  const isAdmin = !user?.role?.includes("broker");

  const { allBrokers, allCategories, allOwners } = useSelector(
    (state) => state.commonReducer
  );
  // New State Start
  const slug = useParams()?.slug;
  const isShowDraft = useLocation()?.state?.isShowDraft;
  const [listingData, setListingData] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState({
    label: "Under-Contract",
    value: "under-contract",
  });
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

  // For Deleting Images
  const [deletingImages, setDeletingImages] = useState({
    financialsAnalysis: [],
    demographics: [],
    images: [],
    deletedFinancialsCSVImages: [],
    isDeleting: false,
  });
  // Financial Options
  const [financialsMediaType, setFinancialsMediaType] = useState("Images");
  const [financialsCSVImages, setFinancialsCSVImages] = useState([{}, {}]);
  const [isSaving, setIsSaving] = useState(false);

  const [order, setOrder] = useState("");
  const [isFeatured, setIsFeatured] = useState("");

  // New State End

  // For Api's States
  const [isEditing, setIsEditing] = useState(false);
  // Geting data with the slug
  async function getData() {
    const url = BaseURL(
      isShowDraft ? `business/draft/${slug}` : `business/with-slug/${slug}`
    );
    setIsLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      const newData = isShowDraft
        ? response?.data?.data
        : response?.data?.data?.business;
      setListingData(newData);
      setTitle(newData?.title);
      setStatus(
        createListingstatusOptions?.find(
          (item) => item?.value == newData?.status
        )
      );
      setInventory(newData?.inventory);
      setCashFlow(newData?.cashFlow);
      setRealState(newData?.industry);
      setBusinessOpportunity(newData?.businessOpportunity);
      setListingId(newData?.refId);
      setFullTimeEmployee(newData?.fullTimeEmployees);
      setPartTimeEmployee(newData?.partTimeEmployees);
      setSalesRevenue(newData?.grossSales);
      setRealDescription(newData?.description);
      setBuildingSf(newData?.buildingSF);
      setDummyDescription(newData?.dummyDescription);

      setAmountTypeAndValue({
        ...amountTypeOptions?.find(
          (item) => item?.value == newData?.amountType
        ),
        amount:
          newData?.amountType == "rent"
            ? newData?.monthlyRent
            : newData?.realEstate,
      });
      setOwnerInvolvment(newData?.ownerInvolvment);
      setOnlinePresence(newData?.thirdPartyPresence);
      setPros(newData?.pros);
      setCons(newData?.cons);
      setHoursOfOperation(newData?.hoursOfOperation);
      setFinancingOptions(
        newData?.financingOptions?.map((item) => ({ label: item }))
      );
      setReasonForSelling(newData?.reason);
      setCompanyName(newData?.companyName);
      setCategory(newData?.category);
      setBusinessHighlights(newData?.businessHighlights);
      setAssignBroker(newData?.broker);
      setPictureDemo(newData?.dummyImage);
      setOwner(newData?.owner);
      setPropertyInformation(newData?.propertyInformation);
      setFinancialImages(newData?.financialsAnalysis);
      setFinancialDescription(newData?.financialsDescription);
      setRecentImprovements(newData?.recentImprovements);
      setDemographics(newData?.demographics);
      setBusinessAddress(newData?.businessAddress);
      setBusinessPlacesApiAddress(newData?.googleMapAddress);
      setGalleryImages(newData?.images);
      setHoursOfOperationOpportunityDescription(
        newData?.hoursOfOperationOpportunity
      );
      setIsLoading(false);
      setFinancialsCSVImages(newData?.financialsCSVImages);
      setFinancialsMediaType(
        newData?.financialsCSVImages?.length > 0 ? "Images" : "CSVs"
      );
      setBusinessAddressCoordinates({
        lat: newData?.location?.coordinates[1],
        lng: newData?.location?.coordinates[0],
      });
      setBusinessAddressDetail({
        city: newData?.city,
        country: newData?.country,
        state: newData?.state,
      });
      setAutoNDA(
        newData?.autoNdaApprove
          ? "Do you want to allow auto nda approve to this listing?"
          : ""
      );
      setOrder(newData?.order);
      setIsFeatured(
        newData?.isFeatured ? "Do you want to featured this listing?" : ""
      );
      setFinancialCSV([
        newData?.financialsCSV1?.map((item) => ({
          column1: item?.column1,
          column2: item?.column2,
          column3: item?.column3,
          column4: item?.column4,
          column5: item?.column5,
          column6: item?.column6,
        })),
        newData?.financialsCSV2?.map((item) => ({
          column1: item?.column1,
          column2: item?.column2,
          column3: item?.column3,
          column4: item?.column4,
          column5: item?.column5,
          column6: item?.column6,
        })),
      ]);

      setConvetedFinancialCSV([
        newData?.financialsCSV1?.map((item) => ({
          column1: item?.column1,
          column2: item?.column2,
          column3: item?.column3,
          column4: item?.column4,
          column5: item?.column5,
          column6: item?.column6,
        })),
        newData?.financialsCSV2?.map((item) => ({
          column1: item?.column1,
          column2: item?.column2,
          column3: item?.column3,
          column4: item?.column4,
          column5: item?.column5,
          column6: item?.column6,
        })),
      ]);
    }
  }
  useEffect(() => {
    getData();
  }, []);

  // Geting data with the slug

  // For Upload Images
  async function uploadImages(updatedSlug) {
    const url = BaseURL(
      isShowDraft ? "business/update-draft-images" : "business/update-images"
    );
    const filesArray = {
      ...(demographics?.findIndex((item) => typeof item == "object") !== -1 && {
        demographics: demographics?.filter((item) => typeof item == "object"),
      }),
      ...(galleryImages?.findIndex((item) => typeof item == "object") !==
        -1 && {
        images: galleryImages?.filter((item) => typeof item == "object"),
      }),
      ...(financialImages?.findIndex((item) => typeof item == "object") !==
        -1 && {
        financialsAnalysis: financialImages?.filter(
          (item) => typeof item == "object"
        ),
      }),
      ...(financialsCSVImages?.findIndex((item) => typeof item == "object") !==
        -1 && { financialsCSVImages }),
      ...(deletingImages?.financialsAnalysis?.length > 0 && {
        deletedFinancialsAnalysis: deletingImages?.financialsAnalysis,
      }),
      ...(deletingImages?.images?.length > 0 && {
        deletedImages: deletingImages?.images,
      }),
      ...(deletingImages?.demographics?.length > 0 && {
        deletedDemographics: deletingImages?.demographics,
      }),
      ...(deletingImages?.deletedFinancialsCSVImages?.length > 0 && {
        deletedFinancialsCSVImages: deletingImages?.deletedFinancialsCSVImages,
      }),
    };
    let formData = new FormData();

    for (let key in filesArray) {
      filesArray[key]?.map((item) => {
        if (key === "deletedDemographics") {
          formData.append(
            deletingImages.demographics?.length > 1 ? `${key}` : `${key}[]`,
            item
          );
        } else if (key === "deletedFinancialsAnalysis") {
          formData.append(
            deletingImages.financialsAnalysis?.length > 1
              ? `${key}`
              : `${key}[]`,
            item
          );
        } else if (key === "deletedImages") {
          formData.append(
            deletingImages.images?.length > 1 ? `${key}` : `${key}[]`,
            item
          );
        } else if (key === "deletedFinancialsCSVImages") {
          formData.append(
            deletingImages.deletedFinancialsCSVImages?.length > 1
              ? `${key}`
              : `${key}[]`,
            item
          );
        } else formData.append(`${key}`, item);
      });
    }

    formData.append("dummyImage", pictureDemo);
    formData.append(isShowDraft ? "draftId" : "slug", updatedSlug);

    const res = await Patch(url, formData, apiHeader(accessToken, true));
    setDeletingImages({
      financialsAnalysis: [],
      demographics: [],
      images: [],
      deletedFinancialsCSVImages: [],
      isDeleting: false,
    });
    return res;
  }

  async function editListing() {
    const url = BaseURL("business/update");
    let params = {
      status: status?.value,
      category: category?._id,
    };

    // Array Validations
    let array = {
      broker: assignBroker?.map((item) => item?._id),
    };

    for (let key in array) {
      if (key == "recentImprovements") {
        for (let a in array[key])
          if (array[key][a]?.features?.length == 0)
            return toast.error(`Please fill the recent improvements features`);
      }
      if (array[key]?.length == 0) {
        return toast.error(
          `Please fill the ${key
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
      ...(financialsMediaType !== "Images"
        ? {
            financialsCSV1: convertedFinancialCSV[0],
            financialsCSV2: convertedFinancialCSV[1],
          }
        : {
            financialsCSV1: [],
            financialsCSV2: [],
          }),
      slug: slug,
    };
    params = {
      ...params,
      // title added
      title,
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
      cashFlow: Number(cashFlow),
      inventory: Number(inventory),
      grossSales: Number(salesRevenue),
      businessOpportunity: Number(businessOpportunity),
      hoursOfOperationOpportunity: hoursOfOperationOpportunityDescription,
      order: Number(order),
      isFeatured: isFeatured !== "",
    };
    setIsEditing(true);

    const response = await Patch(url, params, apiHeader(accessToken));
    if (response !== undefined) {
      (demographics?.findIndex((item) => typeof item == "object") !== -1 ||
        galleryImages?.findIndex((item) => typeof item == "object") !== -1 ||
        financialImages?.findIndex((item) => typeof item == "object") !== -1 ||
        (typeof pictureDemo == "object") !== -1 ||
        (financialsMediaType == "Images" &&
          financialsCSVImages?.findIndex((item) => typeof item == "object") !==
            -1) ||
        deletingImages?.isDeleting) &&
        (await uploadImages(response?.data?.slug));
      await toast.success("Listing updated successfully");
      setListingData(response?.data);
      navigate(-1);
    }
    setIsEditing(false);
  }
  // add draft to business
  async function postListing() {
    const url = BaseURL(`business/update-draft-to-business`);
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
    setIsEditing(true);
    await updateToDraft(false);
    const response = await Post(url, { draftId: slug }, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success("Listing published successfully");
      navigate(-1);
    }
    setIsEditing(false);
  }

  // for edit draft
  async function updateToDraft(showToast = true) {
    const url = BaseURL(`business/update-draft`);
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
      cashFlow: Number(cashFlow),
      fullTimeEmployees: Number(fullTimeEmployee),
      partTimeEmployees: Number(partTimeEmployee),
      inventory: Number(inventory),
      grossSales: Number(salesRevenue),
      businessOpportunity: Number(businessOpportunity),
      autoNdaApprove: autoNDA == "" ? false : true,
      draftId: slug,
    };
    setIsSaving(true);
    const response = await Patch(url, params, apiHeader(accessToken));
    if (response !== undefined) {
      await uploadImages(response?.data?.data?._id, "draft");
      if (showToast) {
        await toast.success("Draft Listing updated successfully");
      }
      navigate(-1);
    }
    setIsSaving(false);
  }

  return (
    <>
      <SideBarSkeleton>
        <div className={classes.container_main}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className={classes.main_heading}>
                <h4>{isShowDraft ? "Edit Draft" : "Edit"} Listing</h4>
                {isShowDraft && (
                  <Button
                    label={isSaving ? "Updating..." : "Update Draft"}
                    disabled={isSaving}
                    onClick={updateToDraft}
                  />
                )}
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
                        setAmountTypeAndValue((prev) => ({
                          ...prev,
                          amount: e,
                        }))
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
                      placeholder={"Search business location"}
                      loader={
                        <Input
                          placeholder={"Search Location"}
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
                        const exx = assignBroker?.find(
                          (e) => e?._id == item?._id
                        );
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
                      value={allOwners?.find((item) => item?._id == owner?._id)}
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
                    dropDownPlaceholder={"select Platform"}
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
                    value={autoNDA ? "Automate" : ""}
                    setValue={(e) => setAutoNDA(e == "Automate")}
                    label={"Automate"}
                  />
                </Col>
                <Col lg={6} sm={12}>
                  <div className={classes.checkboxDiv}>
                    <Checkbox
                      setValue={(e) => setIsFeatured(e == "Featured")}
                      value={isFeatured ? "Featured" : ""}
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
                      setValue={(e) => {
                        setFinancialsMediaType(e);
                        setDeletingImages({
                          ...deletingImages,
                          deletedFinancialsCSVImages: [],
                          isDeleting: true,
                        });
                      }}
                      label={"Images"}
                    />
                    <Radio
                      value={financialsMediaType}
                      setValue={(e) => {
                        setFinancialsMediaType(e);
                        setDeletingImages({
                          ...deletingImages,
                          deletedFinancialsCSVImages: financialsCSVImages,
                          isDeleting: true,
                        });
                      }}
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
                              hideDeleteIcon
                              state={item}
                              setter={(e) => {
                                if (
                                  ![
                                    "image/jpeg",
                                    "image/png",
                                    "image/jpg",
                                  ].includes(e.type)
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
                                const newImages = [...financialsCSVImages];
                                newImages[i] = e;
                                setFinancialsCSVImages(newImages);
                              }}
                              onDelete={() => {
                                const newImages = [...financialsCSVImages];
                                newImages.splice(i, 1);
                                setFinancialsCSVImages(newImages);
                                if (typeof item !== "object") {
                                  setDeletingImages({
                                    ...deletingImages,
                                    deletedFinancialsCSVImages: [
                                      ...deletingImages?.financialsCSVImages,
                                      item,
                                    ],
                                    isDeleting: true,
                                  });
                                }
                              }}
                              onEdit={() => {
                                if (typeof item !== "object") {
                                  setDeletingImages({
                                    ...deletingImages,
                                    deletedFinancialsCSVImages: [
                                      ...deletingImages?.financialsCSVImages,
                                      item,
                                    ],
                                    isDeleting: true,
                                  });
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={classes?.titleContainer}>
                        <span className={classes?.titleText}>
                          Financials (CSV)
                        </span>
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
                                isJson={
                                  item?.length > 0 && item[0]?.column1 && true
                                }
                                i={i}
                                edit={true}
                                setter={async (e) => {
                                  if (!["text/csv"].includes(e.type)) {
                                    return toast.error(
                                      "Please upload a csv file"
                                    );
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
                    <span className={classes?.imagesTitleText}>
                      Picture (Demo)
                    </span>
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
                        onDelete={() => {
                          setPictureDemo({});
                        }}
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
                            hideDeleteIcon
                            state={item}
                            setter={(e) => {
                              if (
                                ![
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ].includes(e.type)
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
                              if (typeof item !== "object") {
                                setDeletingImages({
                                  ...deletingImages,
                                  financialsAnalysis: [
                                    ...deletingImages?.financialsAnalysis,
                                    financialImages[i],
                                  ],
                                  isDeleting: true,
                                });
                              }
                              setFinancialImages(newImages);
                            }}
                            onEdit={() => {
                              if (typeof item !== "object") {
                                setDeletingImages({
                                  ...deletingImages,
                                  financialsAnalysis: [
                                    ...deletingImages?.financialsAnalysis,
                                    financialImages[i],
                                  ],
                                  isDeleting: true,
                                });
                              }
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
                      Demographic
                    </span>

                    <AddMoreBtn
                      onClick={() => {
                        if (demographics?.length < 10) {
                          setDemographics((pre) => [...pre, {}]);
                        } else {
                          toast.info(
                            "Maximum 10 images can upload on Demographic"
                          );
                        }
                      }}
                    />
                  </div>
                  <div className={classes.galleryImages}>
                    {demographics?.map((item, i) => {
                      return (
                        <div className={classes.galleryImageDiv}>
                          <UploadImageBox
                            hideDeleteIcon
                            state={item}
                            setter={(e) => {
                              if (
                                ![
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ].includes(e.type)
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
                              if (typeof item !== "object") {
                                setDeletingImages({
                                  ...deletingImages,
                                  demographics: [
                                    ...deletingImages?.demographics,
                                    demographics[i],
                                  ],
                                  isDeleting: true,
                                });
                              }
                              setDemographics(newImages);
                            }}
                            onEdit={() => {
                              if (typeof item !== "object") {
                                setDeletingImages({
                                  ...deletingImages,
                                  demographics: [
                                    ...deletingImages?.demographics,
                                    demographics[i],
                                  ],
                                  isDeleting: true,
                                });
                              }
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
                            hideDeleteIcon
                            state={item}
                            setter={(e) => {
                              if (
                                ![
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ].includes(e.type)
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
                              if (typeof item !== "object") {
                                setDeletingImages({
                                  ...deletingImages,
                                  images: [
                                    ...deletingImages?.images,
                                    galleryImages[i],
                                  ],
                                  isDeleting: true,
                                });
                              }
                              setGalleryImages(newImages);
                            }}
                            onEdit={() => {
                              if (typeof item !== "object") {
                                setDeletingImages({
                                  ...deletingImages,
                                  images: [
                                    ...deletingImages?.images,
                                    galleryImages[i],
                                  ],
                                  isDeleting: true,
                                });
                              }
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
                      onClick={() =>
                        isShowDraft ? postListing() : editListing()
                      }
                      label={
                        isShowDraft
                          ? isEditing
                            ? "Posting..."
                            : "Post"
                          : isEditing
                          ? "Updating..."
                          : "Update"
                      }
                      className={classes.submit_btn}
                      disabled={isEditing}
                    />
                  </Col>
                )}
              </Row>
            </>
          )}
        </div>
      </SideBarSkeleton>
    </>
  );
};

export default EdiListing;
