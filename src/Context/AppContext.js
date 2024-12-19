import React, { createContext, useState } from "react";
import VehiclesDataJson from "../Pages/Vehicles/data.json";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [ShowBackButton, setShowBackButton] = React.useState(false);
  const [NavigationBackURL, setNavigationBackURL] = React.useState({
    to: "",
    state: {},
  });
  const [VehiclesData, setVehiclesData] = useState(VehiclesDataJson);
  const defaultContext = {
    ShowBackButton,
    setShowBackButton,
    NavigationBackURL,
    setNavigationBackURL,
    VehiclesData,
    setVehiclesData,
  };

  return (
    <AppContext.Provider value={defaultContext}>{children}</AppContext.Provider>
  );
};
