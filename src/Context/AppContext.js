import React, { createContext, useState } from "react";
import VehiclesDataJson from "../Pages/Vehicles/data.json";
import UsersDataJson from "../Pages/Users/data.json";
import RolesDataJson from "../Pages/Roles/data.json";
import CustomersDataJson from "../Pages/Customers/data.json";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [ShowBackButton, setShowBackButton] = React.useState(false);
  const [NavigationBackURL, setNavigationBackURL] = React.useState({
    to: "",
    state: {},
  });
  const [VehiclesData, setVehiclesData] = useState(VehiclesDataJson);
  const [UsersData, setUsersData] = useState(UsersDataJson);
  const [RolesData, setRolesData] = useState(RolesDataJson);
  const [CustomersData, setCustomersData] = useState(CustomersDataJson);
  const defaultContext = {
    ShowBackButton,
    setShowBackButton,
    NavigationBackURL,
    setNavigationBackURL,
    VehiclesData,
    setVehiclesData,
    UsersData,
    setUsersData,
    RolesData,
    setRolesData,
    CustomersData,
    setCustomersData,
  };

  return (
    <AppContext.Provider value={defaultContext}>{children}</AppContext.Provider>
  );
};
