import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "gatsby";

import MapView from "../components/trivar/mapView";
import Page from "../components/page";
import LegendDescription from "../components/trivar/legendDescription";

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;

  & > h1 {
    margin: 10px 15px 0 15px;
  }

  & > h2 {
    margin: 5px 15px 0 15px;
  }
`;
const Divider = styled.hr`
  width: 98%;
  height: 1px;
  background-color: black;
  border-radius: 1px;
  margin: 5px 10px;
`;
const Text = styled.p`
  margin: 5px 15px;
`;
const Trivariate = () => {
  const width = 380;
  const height = 250;
  const mapsTranslate: [number, number] = [width / 2 - 5, height / 2];
  const mapsScale = 500;

  const MapSettings = {
    width: width - 10,
    height,
    translate: mapsTranslate,
    scale: mapsScale,
  };

  const [selectedCounty, setSelectedCounty] = useState<[number, string]>([
    -1,
    "",
  ]);

  const [selectedState, setSelectedState] = useState<[number, string]>([
    -1,
    "",
  ]);

  const [time, setTime] = useState<[number, number]>([0, 52]);

  const [legendStep, setLegendStep] = useState(1);

  return (
    <Page selectedPage="Interactive">
      <Container>
        <TextContainer>
          <h1>Clustering Recency & Consistency</h1>
          <Text>
            This page provides a single view representation of the{" "}
            <Link to="/animated">Animated Choropleth Maps</Link>. Counties that
            were either a hotspot or coldspot at least once in 2020 have a
            circle over them. If the circle is colored blue then the county was
            a coldspot at some point in time and if it is colored red it was a
            hotspot. The radius of the circle shows the total number of times
            that county was a hotspot or coldspot in the given period. A circle
            with a larger radius indicates that it was a hotspot or coldspot
            more times in the year. A darker color shows the last time the
            county was a hotspot or coldspot was later in the year while a
            lighter color means the last time the county was a hotspot or
            coldspot was earlier in the year.
          </Text>
        </TextContainer>
        <LegendDescription step={legendStep} setLegendStep={setLegendStep} />
        <Divider />
        <MapView
          MapSettings={MapSettings}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          time={time}
          setTime={setTime}
        />
        <Divider />
        <TextContainer>
          <Text>
            In general, we see more circles in the eastern parts of the US
            because of the smaller county size compared to counties in western
            states. We also see different patterns across the different data
            sources in each column.
          </Text>
          <Text>
            In the left column, showing mobility, Cuebiq shows a cluster of
            hotspots (high mobility) in the south. These counties are recent
            (dark red color) and also consistent (larger circle radius).
            Mississippi in particular contains multiple counties that were
            hotspots every week in the US. This pattern is not as prevalent in
            the Safegraph data, though the Safegraph data shows a cluster of
            coldspots in New England that the Cuebiq map does not.
          </Text>
          <Text>
            The plots showing measures of sheltering in the right column are
            much more similar to each other than the plots in the left column.
            However, we still see variation in terms of the recency and
            consistency of cluster classifications. For example, clicking on
            Iowa will show counties that area classified as hotspots in the
            Safegraph data but are classified as coldspots in the Cuebiq data.
            There is still variation in the counties classified as coldspots in
            both sources. Generally, the counties in the Safegraph data are less
            recent (lighter shades of blue) and also less consistent (smaller
            radius).
          </Text>
        </TextContainer>
      </Container>
    </Page>
  );
};

export default Trivariate;
