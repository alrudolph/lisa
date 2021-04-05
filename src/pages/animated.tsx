import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Link } from "gatsby";

import Page from "../components/page";
import MapView from "../components/bivar/mapView";
import MapView1 from "../components/bivar/mapView1";
import MapView2 from "../components/bivar/mapView2";
import Table from "../components/bivar/table";

import Sparse from "../utility/sparse";
import MapZoom from "../utility/mapZoom";

import CreateMap from "../components/bivar/createMap";

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
    margin: 5px 5px 0 5px;
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
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const width = container.current.getBoundingClientRect().width;
    setWidth(width);
    console.log("SETTING WIDTH", width);
  }, []);

  return (
    <Page selectedPage="Animation">
      <Container ref={container}>
        <TextContainer>
          <h1>Animated Choropleth Maps</h1>
          <Text>
            These maps show which counties were hot spots (colored red) and cold
            spots (colored blue) during the specified week on the timeline
            below.
          </Text>
        </TextContainer>
        <Divider />
        {/*<p>Week of {dates[week]}</p>*/}
        {/*<MapView
          MapSettings={MapSettings}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          time={time}
          setTime={setTime}
          week={week}
          setWeek={setWeek}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
        />*/}
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
        {/*<MapView1
          MapSettings={MapSettings}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          time={time}
          setTime={setTime}
          week={week}
          setWeek={setWeek}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          MapCreator={MapCreator}
        />*/}
        {selectedState[0] !== -1 ? (
          <>
            <Table selectedState={selectedState} week={week} />
          </>
        ) : (
          <TextContainer>
            <Text>
              Click on a state on one of the maps above in order to see
              individual county values.
            </Text>
          </TextContainer>
        )}
      </Container>
    </Page>
  );
};

export default Bivariate;
