import React, { createContext } from "react";

import dates from "../data/dates.json";

export const DatesContext = createContext(null);

export const DatesData = ({ children }) => {

  return (
    <DatesContext.Provider value={dates}>
      {children}
    </DatesContext.Provider>
  );
};
