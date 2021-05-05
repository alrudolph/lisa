import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "gatsby";

import Page from "../components/page";

import GlobalMoranView from "../components/index/globalMoranView";
import MapExamples from "../components/index/mapExamples";
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
    margin: 30px 15px 0 15px;
  }

  & > h1:nth-child(1) {
    margin-top: 10px;
  }
`;

const Text = styled.p`
  margin: 5px 15px;
`;

const Index = () => {
  const [showFDR, setShowFDR] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () => {
        return setShowFDR(window.scrollY > 500);
      });
    }
  }, []);

  return (
    <Page selectedPage="About">
      <TextContainer>
        <h1>About This Website</h1>
        <Text>
          This website presents three different ways to compare the spatial
          structures of different mobility measures over a period of time. The{" "}
          <Link to="/animated">Animated Choropleth Maps</Link> page allows you
          to either play an animation or step through individual weeks to see
          the spatial structure of our different measures in those weeks. The{" "}
          <Link to="/interactive"> Interactive Maps</Link> page shows the
          temporal aspects of this animation in a single single view. The{" "}
          <Link to="/scatter">Scatter Plots</Link> page shows the same points as
          on our Interactive Maps, just without the spatial aspect to see a
          different view of the same information.
        </Text>
        <h1>Data</h1>
        <Text>
          We have two data sources, Safegraph and Cuebiq, and two variables from
          each source. One variable is a measure of the distance traveled for
          people in a county, the other is a measure of the percentage of people
          in the county that are staying at home. We then computed weekly
          averages of these variables on the county level for each week in 2020.
        </Text>
        <h1>Global Moran's I</h1>
        <Text>
          We can use the Global Moran's I to test for spatial association
          between counties. Below are four plots for each data source and
          variable which show the test statistic of Global Moran's I, calculated
          for each week in 2020. All of these values are positive and
          significant which indicates that there is spatial association every
          week for each variable. This means that we generally see high valued
          counties next to other high valued counties (hotspots) and low valued
          counties next to other low valued counties (coldspots).
        </Text>
        <GlobalMoranView />
        <Text>
          The vertical lines in the plots show the week that COVID-19 was
          declared a pandemic by the World Health Organization.
        </Text>
        <h1>Local Moran's I</h1>
        <MapExamples showFDR={showFDR} setShowFDR={setShowFDR} />
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
