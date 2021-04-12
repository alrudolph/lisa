import React, { useContext } from "react";
import styled from "styled-components";

import Sparse from "../../utility/sparse";
import ScatterPlot from "./scatterPlot";
import { LisaContext } from "../../contexts/lisaContext"

type Props = {
  selectedState: [number, string];
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;

  @media (max-width: 800px) {
    justify-content: center;
  }
`;

export default function ScatterView({
  selectedState
}: Props) {
  const { mapData, mapTitles } = useContext(LisaContext)
  return (
    <Container>
      {mapTitles.map((title, i) => {
        return (
          <ScatterPlot
            key={i}
            title={title}
            selectedState={selectedState}
            data={mapData ? mapData[i] : null}
          />
        );
      })}
    </Container>
  );
}
