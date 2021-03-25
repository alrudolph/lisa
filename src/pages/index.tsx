import React from "react";
import styled from "styled-components";

import Sparse from "../utility/sparse";

import Page from "../components/page";
import Trivariate from "./trivar";
import Bivariate from "./bivar";

import cue_mobility from "../data/cm.json";
import cue_sheltered from "../data/cs.json";
import safe_mobility from "../data/sm.json";
import safe_sheltered from "../data/ss.json";

const nweek = 52;

const format = (data) => {
  return Object.keys(data).map((key, i) => {
    return new Sparse(data[key], nweek, key);
  });
};

{
  /* <Trivariate
      data={[
        format(cue_mobility),
        format(cue_sheltered),
        format(safe_mobility),
        format(safe_sheltered),
      ]}
    /> */
}

const Index = () => {
  return (
    <Trivariate
      data={[
        format(cue_mobility),
        format(cue_sheltered),
        format(safe_mobility),
        format(safe_sheltered),
      ]}
    /> 
  );
};

export default Index;
