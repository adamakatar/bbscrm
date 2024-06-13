import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getZipCode,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

import classes from "./PlacesInput.module.css";
import { useEffect, useState } from "react";

export default function PlacesInput({
  setCoordinates,
  setAddress,
  address,
  label,
  placeholder = "Search address",
  className,
  setPlaceDetail,
  leftIcon,
}) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  //   handleSelect
  const handleSelect = async (val) => {
    setValue(val, false);
    clearSuggestions();

    const results = await getGeocode({ address: val });
    const zipcode = await getZipCode(results[0], false);
    const { lat, lng } = await getLatLng(results[0]);

    let country = "";
    let city = "";
    let state = "";
    let zipCode = "";

    let addrComp = results[0].address_components;
    for (let i = 0; i < addrComp.length; ++i) {
      if (addrComp[i].types.includes("administrative_area_level_1"))
        state = addrComp[i].long_name;
      else if (addrComp[i].types.includes("locality"))
        city = addrComp[i].long_name;
      else if (addrComp[i].types.includes("country"))
        country = addrComp[i].long_name;
      //we can break early if we find all three data
      if (state != "" && city != "" && country != "") break;
    }
    setPlaceDetail && setPlaceDetail({ state, city, country, zipcode });
    setCoordinates && setCoordinates({ lat, lng });
    setAddress(val);
  };
  useEffect(() => {
    setValue(address, false);
    clearSuggestions();
  }, []);
  return (
    <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
      <Combobox
        onSelect={handleSelect}
        className={`${className ? className : ""}`}>
        {label && (
          <label className={`${[classes.labelText].join(" ")}`}>{label}</label>
        )}
        <div className={classes.inputDiv}>
          <ComboboxInput
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (e.target.value == "") {
                setPlaceDetail(null);
                setCoordinates(null);
                setAddress("");
                setValue("", false);
                clearSuggestions();
              }
            }}
            disabled={!ready}
            className={classes["comboboxInput"]}
            placeholder={placeholder}
          />
          {leftIcon && <span className={classes.leftIcon}>{leftIcon}</span>}
          <ComboboxList className={classes.comboBoxList}>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </div>
      </Combobox>
    </form>
  );
}
