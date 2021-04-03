import React, { useState, useContext } from "react";
import styled from "styled-components";

import Page from "../components/page";
import MapView from "../components/bivar/mapView";
import Table from "../components/bivar/table"

import Sparse from "../utility/sparse";
import MapZoom from "../utility/mapZoom";

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const width = 380;
const height = 250;
const mapsTranslate: [number, number] = [width / 2, height / 2];
const mapsScale = 500;

const MapSettings = {
  width,
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

  return (
    <Page selectedPage="Animation">
      <Container>
        {/*<p>Week of {dates[week]}</p>*/}
        <MapView
          MapSettings={MapSettings}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          time={time}
          setTime={setTime}
          week={week}
          setWeek={setWeek}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
        />
        <p>Clicking on a state on the map above will show the raw values for counties in that state that are displayed below. and other words that i know.</p>
        {selectedState[0] !== -1 ? <Table selectedState={selectedState} week={week}/> : null}
      </Container>
    </Page>
  );
};

export default Bivariate;
