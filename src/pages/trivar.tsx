import React, { useState } from "react";
import styled from "styled-components";

import MapView from "../components/trivar/mapView";
import ScatterView from "../components/trivar/scatterView";
import Slider from "../components/trivar/slider";
import Page from "../components/page";

import Sparse from "../utility/sparse";

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

type Props = {
  data: [Array<Sparse>, Array<Sparse>, Array<Sparse>, Array<Sparse>];
};

const Trivariate = ({ data }: Props) => {
  const width = 380;
  const height = 250;
  const mapsTranslate: [number, number] = [width / 2, height / 2];
  const mapsScale = 500;

  const mapTitles = [
    "Cuebiq mobility index, rolling avg (Cuebiq)",
    "% sheltered in place, rolling avg (Cuebiq)",
    "Median distance traveled (Safegraph)",
    "% sheltered (Safegraph)",
  ];

  const MapSettings = {
    width,
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

  const [time, setTime] = useState<[number, number]>([0, 52])

  return (
    <Page>
      <Container>
        <MapView
          MapData={data}
          MapSettings={MapSettings}
          selectedCounty={selectedCounty}
          mapTitles={mapTitles}
          setSelectedCounty={setSelectedCounty}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          time={time}
          setTime={setTime}
        />
        {/*<Slider time={time} setTime={setTime}/>*/}
        {/*<p>State Selected: {selectedState[1]}</p>*/}
        <hr style={{ width: "100%"}}/>
        <ScatterView 
          MapData={data}
          mapTitles={mapTitles}
          selectedCounty={selectedCounty}
          selectedState={selectedState}
          time={time}
          />
      </Container>
    </Page>
  );
};

export default Trivariate;
