import React, { useState } from "react";
import styled from "styled-components";

//import us from "us-atlas/nation-10m.json"
import counties from "us-atlas/counties-10m.json";
import states from "us-atlas/states-10m.json";
//import data from "../data/counties.json";

import MapZoom from "../utility/mapZoom";
import Sparse from "../utility/sparse";
import Map from "./map";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  justify-content: space-evenly;

  width: 100%;
  flex-wrap: wrap;
`;

const Text = styled.p`
  margin: 0;
  width: 100px;
  white-space: nowrap;
`;

const Button = styled.button`
  width: 50px;
`;

type MapSettings = {
  width: number;
  height: number;
  translate: [number, number];
  scale: number;
};

type Data = Array<Sparse>;

type Props = {
  MapSettings: MapSettings;
  mapTitles: Array<string>;
  selectedCounty: [string, string];
  setSelectedCounty: ([s1, s2]: [string, string]) => void;
  selectedState: string;
  setSelectedState: (s: string) => void;
  MapData: [Data, Data, Data, Data];
};

export default function MapView({
  MapSettings,
  mapTitles,
  selectedCounty,
  setSelectedCounty,
  selectedState,
  setSelectedState,
  MapData
}: Props) {
  const [mapZoom, setMapZoom] = useState(Array<MapZoom>(mapTitles.length));

  const addState = (m: MapZoom, mapNum: number) => {
    mapZoom[mapNum] = m;
    setMapZoom(mapZoom);
  };

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
              data={MapData[i]}
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
    </Container>
  );
}
