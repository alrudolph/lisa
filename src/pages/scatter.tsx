import React, { useState } from "react";
import styled from "styled-components";

import MapView from "../components/trivar/mapView";
import ScatterView from "../components/trivar/scatterView";
import Slider from "../components/trivar/slider";
import Page from "../components/page";

import MapZoom from "../utility/mapZoom";

import StateSelection from "../components/scatter/stateSelection";
import DropDown from "../components/scatter/dropdown";
import { Link } from "gatsby";

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const SelectionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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

const Text = styled.p`
  margin: 5px;
`;
const Divider = styled.hr`
  width: 98%;
  height: 1px;
  background-color: black;
  border-radius: 1px;
  margin: 5px 10px;
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
        <TextContainer>
          <h1>Scatter Plots</h1>
          <Text>
            This page provides an alternative view to{" "}
            <Link to="/static">the static choropleth plots page</Link>.
          </Text>
          <Text>
            The scatter plots below show the number of times a county was a hot
            spot or cold spot vs the last week number it was a significant
            value. Each point on the scatter plot represents the counties at the
            specified count and week number. Since multiple counties can be at
            the same location, the point is color blue if the majority of the
            counties were cold spots and red if the majority were hot spots. A
            darker colored point shows a higher proportion of counties being hot
            or cold spots.
          </Text>
        </TextContainer>
        <Divider />
        <SelectionContainer>
          <DropDown
            stateSelector={stateSelector}
            selectedState={selectedState}
          />
          <StateSelection
            highlightedState={selectedState}
            stateSelector={stateSelector}
            addState={addState}
          />
        </SelectionContainer>
        <Divider />
        <ScatterView selectedState={selectedState} />
        <Divider />
        <TextContainer>
          <Text></Text>
        </TextContainer>
      </Container>
    </Page>
  );
}
