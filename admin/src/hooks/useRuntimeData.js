import { useContext } from "react";
import { RuntimeDataContext } from "../contexts/RuntimeDataContext";

const useRuntimeData = () => useContext(RuntimeDataContext);

export default useRuntimeData;
