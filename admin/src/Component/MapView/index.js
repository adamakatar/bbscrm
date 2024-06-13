import { useMemo } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import classes from "./MapView.module.css";

export default function MapView({ location, className }) {
  const options = useMemo(() => ({ mapId: "6a59d5a654e7c4b1" }), []); //dark

  return (
    <div className={`${classes?.container} ${className && className}`}>
      <GoogleMap
        zoom={16}
        center={location}
        mapContainerClassName={classes["map-container"]}>
        {location && (
          <>
            <Marker position={location} />
          </>
        )}
      </GoogleMap>
    </div>
  );
}
