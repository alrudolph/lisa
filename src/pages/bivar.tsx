import React, { useState, useContext } from "react";
import styled from "styled-components";

import Page from "../components/page";
import MapView from "../components/bivar/mapView";
import { DatesContext } from "../contexts/datesContext"

import Sparse from "../utility/sparse";

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

  return (
    <Page>
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
          />
      </Container>
    </Page>
  );
};

export default Bivariate;
