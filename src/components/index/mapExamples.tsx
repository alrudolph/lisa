import React from "react";
import styled from "styled-components";

import CenterMap from "./examples/centerMap";
import ValueMap from "./examples/valueMap";
import { Maps } from "../../contexts/mapsContext";

interface Props {
  showFDR: boolean;
  setShowFDR: (b: boolean) => {};
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 800px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const MapContainer = styled.div`
  display: flex;

  @media (max-width: 900px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;

  & > h1 {
    margin: 10px 15px 0 15px;
  }
`;

const Text = styled.p`
  margin: 5px 15px;
`;
const MapExamples = ({ showFDR, setShowFDR }: Props) => {
  return (
    <Container>
      <Maps>
        <MapContainer>
          <TextContainer>
            <Text>
              Since we have determined that there is spatial association
              (hotspots and coldspots) we can now use Local Moran’s I to find
              which counties are the hotspots and coldspots.{" "}
            </Text>
            <Text>
              The first accompanying figure shows %-sheltered Cuebiq measure for
              Utah for the week 4/13-4/19. The percentage value is placed above
              each county and counties are colored according to this value.
              Counties with a lower value are colored a darker blue while
              counties with greater values are lighter. This plot shows what it
              means to be a cold spot; in the center of the state, we see lower
              percentages (darker counties) clustered together.
            </Text>
            <Text>
              The next plot of Utah shows the results after running the Local
              Moran test. Counties that are significant coldspots after running
              the Local Moran test are given a color. The significance test that
              is used to determine whether the counties are coldspots is based
              on permutations of values that result in simulated p-values. We
              then use the False Discovery Rate (FDR) in order to reduce the
              number of false positives from this simulation. The counties that
              are significant after the FDR are colored a darker purple and
              these counties represent the centers of our coldspots.
            </Text>
          </TextContainer>
          <ValueMap />
          <CenterMap showFDR={showFDR} setShowFDR={setShowFDR} />
        </MapContainer>
      </Maps>
    </Container>
  );
};

export default MapExamples;
