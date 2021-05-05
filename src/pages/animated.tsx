import React, { useState, useRef, useEffect } from "react";
import { useMediaQuery } from "beautiful-react-hooks";
import styled from "styled-components";
import { Link } from "gatsby";

import Page from "../components/page";
import MapView2 from "../components/bivar/mapView2";
import Table from "../components/bivar/table";

import Sparse from "../utility/sparse";
import MapZoom from "../utility/mapZoom";

// import CreateMap from "../components/bivar/createMap";

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

const Bivariate = () => {
  const [selectedCounty, setSelectedCounty] = useState<[number, string]>([
    -1,
    "",
  ]);

  const [time, setTime] = useState<[number, number]>([0, 52]);

  const [week, setWeek] = useState(0);
  const [selectedState, setSelectedState] = useState<[number, string]>([
    -1,
    "",
  ]);

  // const [MapCreator, _] = useState(new CreateMap());

  const container = useRef(null);
  const width = useMediaQuery("(max-width: 750px)");

  return (
    <Page selectedPage="Animation">
      <Container ref={container}>
        <TextContainer>
          <h1>Animated Spatial Clustering</h1>
          <Text>
            This page has four animated choropleth maps that show the spatial
            clustering in our variables for each week in 2020. Counties
            classified as hotspots are colored red and counties classified as
            coldspots are colored blue. For more information on how counties are
            classified as hotspots or coldspots see the{" "}
            <Link to="/">About Page</Link>.
          </Text>
          <Text>
            The top row of plots includes data from Cuebiq while the bottom row
            is from Safegraph. The column on the left shows the sources'
            measures of mobility while the column on the right is of measures of
            sheltering. If all of these variables are showing the same
            phenomenon then we would expect the same patterns in the each column
            and inverted colors across the rows. However, one of the points to
            be made by comparing different variables and different sources is
            that they don't show the exact same patterns which could lead to
            different predictions in models using different data.
          </Text>
        </TextContainer>
        <Divider />
        <MapView2
          MapSettings={MapSettings}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          time={time}
          setTime={setTime}
          week={week}
          setWeek={setWeek}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          width={width}
        />
        <Divider />
        {selectedState[0] !== -1 ? (
          <>
            <TextContainer>
              <Text>
                The table below shows the individual values that were used in
                the Local Moran test to calculate if a county was a hotspot or
                coldspot in the current week. This table just shows the counties
                in the selected state although the Local Moran test was run
                using every county in the US.
              </Text>
            </TextContainer>
            <Table selectedState={selectedState} week={week} />
          </>
        ) : (
          <TextContainer>
            <Text>
              Click on a state above to see a table of the state's county
              values.
            </Text>
          </TextContainer>
        )}
        <TextContainer>
          <Text>
            One of the first things to notice is how sparse the classifications
            are in Safegraph's mobility measure in the column on the left. If
            you turn on the cumulative map option and play the animation to the
            end, we can see all of the counties that were once classified in the
            year. While the other three maps are mostly colored in, this map has
            more counties that were never significant.
          </Text>
          <Text>
            On the 13th week, 3/23-3/29, we can see an abrupt change in the
            maps. These dates correspond to just after the declaration of a
            national emergency which is listed on the timeline events. In all of
            the weeks leading up to these dates, we see a large number of
            counties classified as coldspots in Cuebiq mobility and hotspots in
            the sheltered column, particularly in the west, which go away as the
            pandemic begins. However, particularly in the South around
            Mississippi and Alabama, we don't see this change as the
            classification of these counties remain constant throughout the year.
          </Text>
        </TextContainer>
      </Container>
    </Page>
  );
};

export default Bivariate;
