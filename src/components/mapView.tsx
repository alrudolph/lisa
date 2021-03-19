import React from "react";
import styled from "styled-components";

//import us from "us-atlas/nation-10m.json"
import us from "us-atlas/counties-10m.json";
//import data from "../data/counties.json";

import MapZoom from "../utility/mapZoom";
import Map from "./map";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  @media(max-width: 770px) {
      flex-wrap: wrap;
  }
`;

export default function MapView() {
  const width = 380;
  const height = 250;
  const translate: [number, number] = [width / 2, height / 2];
  const scale = 500;

  const mapTitles = ["1", "2", "3", "4"];

  const MapSettings = {
    width,
    height,
    translate,
    scale,
  };

  let mapViews = Array(mapTitles.length);

  const addState = (m: MapZoom, mapNum: number) => {
    mapViews[mapNum] = m;
  };

  const stateSelector = (id: string) => {

    mapViews.forEach((m) => {
      if (id !== m.currId) {
        m.select(id);
      } else {
        m.reset();
      }
    });
  };

  return (
    <Container>
      <Row>
        <Map
          MapSettings={MapSettings}
          title={mapTitles[0]}
          map={us}
          addState={(m: MapZoom) => addState(m, 0)}
          stateSelector={stateSelector}
        />
        <Map
          MapSettings={MapSettings}
          title={mapTitles[1]}
          map={us}
          addState={(m: MapZoom) => addState(m, 1)}
          stateSelector={stateSelector}
        />
      </Row>
      <Row>
        <Map
          MapSettings={MapSettings}
          title={mapTitles[2]}
          map={us}
          addState={(m: MapZoom) => addState(m, 2)}
          stateSelector={stateSelector}
        />
        <Map
          MapSettings={MapSettings}
          title={mapTitles[3]}
          map={us}
          addState={(m: MapZoom) => addState(m, 3)}
          stateSelector={stateSelector}
        />
      </Row>
    </Container>
  );
}
