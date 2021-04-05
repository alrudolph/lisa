import React from "react";
import styled from "styled-components";
import { Link } from "gatsby"

import Sparse from "../utility/sparse";

import Page from "../components/page";
import Trivariate from "./static";
import Bivariate from "./animated";

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

import dates from "../data/dates.json";

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;

  & > h1 {
    margin: 5px 5px 0 5px;
  }
`;

const Text = styled.p`
  margin: 5px;
`;

const Index = () => {
  return (
    <Page selectedPage="About">
      <TextContainer>
        <h1>About This Website</h1>
        <Text>The about page is still under construction. Please see one of the individual visualization pages.</Text>
        <ul>
          <li><Link to="/animated"><h2>Animated Choropleth Maps</h2></Link></li>
          <li><Link to="/static"><h2>Static Choropleth Maps</h2></Link></li>
          <li><Link to="/scatter"><h2>Scatter Plot Representations</h2></Link></li>
        </ul>
      </TextContainer>
    </Page>
  );
};

export default Index;
