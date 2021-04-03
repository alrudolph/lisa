import React, { useState } from "react";
import styled from "styled-components";

import MapView from "../components/trivar/mapView";
import ScatterView from "../components/trivar/scatterView";
import Slider from "../components/trivar/slider";
import Page from "../components/page";

import MapZoom from "../utility/mapZoom";

import StateSelection from "../components/scatter/stateSelection";
import DropDown from "../components/scatter/dropdown";

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const SelectionContainer = styled.div`
  display: flex;
`;

export default function Scatter() {
  const [selectedState, setSelectedState] = useState<[number, string]>([
    -1,
    "",
  ]);

  const [mapZoom, setMapZoom] = useState(Array<MapZoom>(1));

  const addState = (m: MapZoom) => {
    mapZoom[0] = m;
    setMapZoom(mapZoom);
  };

  const stateSelector = (
    [id, name]: [number, string],
    reset: boolean = false
  ) => {
    const m = mapZoom[0];

    if (!reset && id !== m.currId && id !== -1) {
      m.select(id);
      setSelectedState([id, name]);
      return true;
    } else {
      m.reset();
      setSelectedState([-1, ""]);
      return false;
    }
  };

  return (
    <Page selectedPage="Scatter">
      <Container>
        <SelectionContainer>
          <DropDown stateSelector={stateSelector} selectedState={selectedState}/>
          <StateSelection
            highlightedState={selectedState}
            stateSelector={stateSelector}
            addState={addState}
          />
        </SelectionContainer>
        <ScatterView selectedState={selectedState} />
      </Container>
    </Page>
  );
}
