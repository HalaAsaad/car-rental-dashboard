import React, { createContext } from "react";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [ShowBackButton, setShowBackButton] = React.useState(false);
  const [NavigationBackURL, setNavigationBackURL] = React.useState({
    to: "",
    state: {},
  });

  const defaultContext = {
    ShowBackButton,
    setShowBackButton,
    NavigationBackURL,
    setNavigationBackURL,
  };

  return (
    <AppContext.Provider value={defaultContext}>{children}</AppContext.Provider>
  );
};
