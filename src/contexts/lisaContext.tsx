import React, { createContext } from "react";

import cue_mobility from "../data/cm.json";
import cue_sheltered from "../data/cs.json";
import safe_mobility from "../data/sm.json";
import safe_sheltered from "../data/ss.json";

import Sparse from "../utility/sparse";

const nweek = 52;

const format = (data): Array<Sparse> => {
  return Object.keys(data).map((key, i) => {
    return new Sparse(data[key], nweek, key);
  });
};


const mapData: [Array<Sparse>, Array<Sparse>, Array<Sparse>, Array<Sparse>] = [
  format(cue_mobility),
  format(cue_sheltered),
  format(safe_mobility),
  format(safe_sheltered),
];

export const LisaContext = createContext(null);

export const LisaData = ({ children }) => {

  const mapTitles = [
    "Cuebiq mobility index, rolling avg (Cuebiq)",
    "% sheltered in place, rolling avg (Cuebiq)",
    "Median distance traveled (Safegraph)",
    "% sheltered (Safegraph)",
  ];

  return (
    <LisaContext.Provider value={{ mapData, mapTitles }}>
      {children}
    </LisaContext.Provider>
  );
};
