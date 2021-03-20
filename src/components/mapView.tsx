import React, { useState } from "react";
import styled from "styled-components";

//import us from "us-atlas/nation-10m.json"
import counties from "us-atlas/counties-10m.json";
import states from "us-atlas/states-10m.json";
//import data from "../data/counties.json";

import MapZoom from "../utility/mapZoom";
import Map from "./map";
import Card from "./cards";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const MapContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  width: 100%;
  flex-wrap: wrap;

  @media (max-width: 770px) {
    flex-wrap: wrap;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  width: 100%;
  flex-wrap: wrap;
`;

const Text = styled.p`
  margin: 0;
  width: 100px;
`;

const Button = styled.button`
  width: 200px;
`;

export default function MapView() {
  const width = 380;
  const height = 250;
  const translate: [number, number] = [width / 2, height / 2];
  const scale = 500;

  const mapTitles = ["Cuebiq 1", "Cuebiq 2", "Safegraph 1", "Safegraph 2"];

  const MapSettings = {
    width,
    height,
    translate,
    scale,
  };

  const [mapZoom, setMapZoom] = useState(Array<MapZoom>(mapTitles.length));

  const addState = (m: MapZoom, mapNum: number) => {
    mapZoom[mapNum] = m;
    setMapZoom(mapZoom);
  };

  const [selectedCounty, setSelectedCounty] = useState(["", ""]);

  const [selectedState, setSelectedState] = useState("");

  const stateSelector = (id: string, reset: boolean = false) => {
    mapZoom.forEach((m) => {
      if (!reset && id !== m.currId) {
        m.select(id);
      } else {
        m.reset();
      }
      setSelectedState(m.currId);
    });
    setSelectedCounty(["", ""]);
  };

  return (
    <Container>
      <MapContainer>
        {mapTitles.map((title, i) => {
          return (
            <Map
              key={i}
              MapSettings={MapSettings}
              title={title}
              countiesMap={counties}
              highlightedCounty={selectedCounty[0]}
              addState={(m: MapZoom) => addState(m, i)}
              stateSelector={stateSelector}
              countySelector={setSelectedCounty}
            />
          );
        })}
      </MapContainer>
      <Row>
        <Button
          onClick={() => {
            stateSelector("", true);
          }}
        >
          Reset
        </Button>
        <Text>{selectedState}</Text>
        <Text>{selectedCounty[1] ? selectedCounty[1] + " County" : ""}</Text>
      </Row>
      <Row>
        {mapTitles.map((title, i) => {
          return <Card key={i} title={title} />;
        })}
      </Row>
    </Container>
  );
}
