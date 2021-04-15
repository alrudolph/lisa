import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "gatsby";

import Page from "../components/page";
import CenterMap from "../components/index/centerMap";
import ValueMap from "../components/index/valueMap";
import { Maps } from "../contexts/mapsContext";
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
    margin: 10px 5px 0 5px;
  }
`;

const Text = styled.p`
  margin: 0 5px;
`;

const Index = () => {
  const [showFDR, setShowFDR] = useState(false);

  useEffect(() => {
    if (typeof window !== `undefined`) {
      window.addEventListener("scroll", () => {
        return setShowFDR(window.scrollY > 120);
      });
    }
  }, []);

  return (
    <Page selectedPage="About">
      <TextContainer>
        <h1>About This Website</h1>
        <Text>What this is showing and stuff</Text>
        <h1>Data</h1>
        <Text>The Data we have</Text>
        <h1>Global Moran</h1>
        <Text>We see spatial clustering every week</Text>
        <h1>LISA</h1>
        <Maps>
          <ValueMap />
          <CenterMap showFDR={showFDR} />
        </Maps>
        {/* 
        <Text>The about page is still under construction. Please see one of the individual visualization pages.</Text>
        <ul>
          <li><Link to="/animated"><h2>Animated Choropleth Maps</h2></Link></li>
          <li><Link to="/static"><h2>Static Choropleth Maps</h2></Link></li>
          <li><Link to="/scatter"><h2>Scatter Plot Representations</h2></Link></li>
        </ul>*/}
      </TextContainer>
    </Page>
  );
};

export default Index;
