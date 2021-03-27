import React, { useState } from "react";
import styled from "styled-components";

import MapView1 from "../components/trivar/mapView1";
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

const Trivariate1 = () => {

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
        <p>Darker color means fewer number of changes</p>
        <p>Bigger Radius means more counts</p>
        <MapView1
          MapSettings={MapSettings}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          time={time}
          setTime={setTime}
        />
        {/*<Slider time={time} setTime={setTime}/>*/}
        {/*<p>State Selected: {selectedState[1]}</p>*/}
        <hr style={{ width: "100%"}}/>
        <p>I think this would end up having a triangular look with one side on yaxis and other vertex above positive x</p>
      </Container>
    </Page>
  );
};

export default Trivariate1;
