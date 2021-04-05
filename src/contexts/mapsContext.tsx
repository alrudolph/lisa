import React, { createContext } from "react";

import * as d3 from "d3";
import * as topojson from "topojson";

import countiesMap from "us-atlas/counties-10m.json";

export const MapsContext = createContext(null);

export const Maps = ({ children }) => {

  const states = topojson.feature(countiesMap, countiesMap.objects.states).features
  const counties = topojson.feature(countiesMap, countiesMap.objects.counties).features

  return (
    <MapsContext.Provider value={{ states, counties }}>
      {children}
    </MapsContext.Provider>
  );
};
