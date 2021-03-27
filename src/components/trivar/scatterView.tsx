import React, { useContext } from "react";
import styled from "styled-components";

import Sparse from "../../utility/sparse";
import ScatterPlot from "./scatterPlot";
import { LisaContext } from "../../contexts/lisaContext"

type Data = Array<Sparse>;

type Props = {
  selectedCounty: [number, string];
  selectedState: [number, string];
  time: [number, number];
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export default function ScatterView({
  selectedState,
  selectedCounty,
  time,
}: Props) {
  const { mapData, mapTitles } = useContext(LisaContext)
  return (

    <Container>
      {mapTitles.map((title, i) => {
        return (
          <ScatterPlot
            key={i}
            title={title}
            selectedCounty={selectedCounty}
            selectedState={selectedState}
            data={mapData ? mapData[i] : null}
            time={time}
          />
        );
      })}
    </Container>
  );
}
