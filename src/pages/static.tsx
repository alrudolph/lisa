import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Link } from "gatsby";

import MapView from "../components/trivar/mapView";
import ScatterView from "../components/scatter/scatterView";
import Slider from "../components/trivar/slider";
import Page from "../components/page";

import Sparse from "../utility/sparse";

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
    margin: 10px 5px 0 5px;
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
  margin: 5px;
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

  return (
    <Page selectedPage="Static">
      <Container>
        <TextContainer>
          <h1>Static Choropleth Maps</h1>
          <Text>
            This page provides a static representation of the{" "}
            <Link to="/animated">animated choropleth maps</Link> by using
            symbols to show the temporal aspects in a single view. Counties that
            were either a hot spot or cold spot at least once in 2020 have a
            circle over them. If the circle is colored blue then the county was
            a cold spot at some point in time and if it is color red it was a
            hot spot. The radius of the circle shows the number of times that
            county was a hot or cold spot in the given period. A circle with a
            larger radius indicates that it was a hot spot or cold spot more
            times in the year. A darker color shows the last time the county was
            a hot spot or cold spot was later in the year while a lighter color
            means the last time the county was a hot spot or cold spot was
            earlier in the year.
          </Text>
        </TextContainer>
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
        {/*<Slider time={time} setTime={setTime}/>*/}
        {/*<p>State Selected: {selectedState[1]}</p>*/}
      </Container>
    </Page>
  );
};

export default Trivariate;
