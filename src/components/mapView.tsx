import React, { useCallback, useState } from "react";
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
  selectedCounty: [number, string];
  setSelectedCounty: ([s1, s2]: [number, string]) => void;
  selectedState: [number, string];
  setSelectedState: ([s1, s2]: [number, string]) => void;
  MapData: [Data, Data, Data, Data];
};

const getStateFips = (fips: number): number => {
  return Number(String(fips).slice(0, -3));
};

export default function MapView({
  MapSettings,
  mapTitles,
  selectedCounty,
  setSelectedCounty,
  selectedState,
  setSelectedState,
  MapData,
}: Props) {
  const [mapZoom, setMapZoom] = useState(Array<MapZoom>(mapTitles.length));

  const addState = (m: MapZoom, mapNum: number) => {
    mapZoom[mapNum] = m;
    setMapZoom(mapZoom);
  };

  const stateSelector = ([id, name]: [number, string], reset: boolean = false) => {
    let zooming: boolean;

    mapZoom.forEach((m) => {
      if (!reset && id !== m.currId && id !== -1) {
        m.select(id);
        zooming = true;
      } else {
        m.reset();
        zooming = false;
      }
    });

    if (zooming) {
      setSelectedState([id, name]);
      return true;
    }
    else {
      setSelectedState([-1, ""]);
      return false;
    }
  };

  const countySelector = ([id, name]: [number, string]) => {
    if (id === -1 || getStateFips(id) === selectedState[0]) {
      setSelectedCounty([id, name])
    }
  }

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
              highlightedCounty={selectedCounty}
              highlightedState={selectedState}
              addState={(m: MapZoom) => addState(m, i)}
              stateSelector={stateSelector}
              countySelector={countySelector}
              data={MapData ? MapData[i] : null}
            />
          );
        })}
      </MapContainer>
      <Row>
        <Button
          onClick={() => {
            stateSelector([-1, ""], true);
          }}
        >
          Reset
        </Button>
        <Text>{selectedState[1]}</Text>
        <Text>{selectedCounty[1] ? selectedCounty[1] + " County" : ""}</Text>
      </Row>
    </Container>
  );
}
