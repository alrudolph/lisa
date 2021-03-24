import React from "react";
import styled from "styled-components";

import Sparse from "../../utility/sparse";
import ScatterPlot from "./scatterPlot";

type Data = Array<Sparse>;

type Props = {
  mapTitles: Array<string>;
  selectedCounty: [number, string];
  selectedState: [number, string];
  MapData: [Data, Data, Data, Data];
  time: [number, number];
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export default function ScatterView({
  MapData,
  mapTitles,
  selectedState,
  selectedCounty,
  time,
}: Props) {
  return (
    <Container>
      {mapTitles.map((title, i) => {
        return (
          <ScatterPlot
            key={i}
            title={title}
            selectedCounty={selectedCounty}
            selectedState={selectedState}
            data={MapData ? MapData[i] : null}
            time={time}
          />
        );
      })}
    </Container>
  );
}
