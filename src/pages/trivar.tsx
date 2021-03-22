import React, { useState } from "react";
import styled from "styled-components";

import MapView from "../components/trivar/mapView";
import ScatterView from "../components/trivar/scatterView";
import Card from "../components/trivar/cards";
import Page from "../components/page";

import Sparse from "../utility/sparse";

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Cards = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 70%;
`;

type Props = {
  data: [Array<Sparse>, Array<Sparse>, Array<Sparse>, Array<Sparse>];
};

const Trivariate = ({ data }: Props) => {
  const width = 380;
  const height = 250;
  const mapsTranslate: [number, number] = [width / 2, height / 2];
  const mapsScale = 500;
  const scatterTranslate: [number, number] = [width / 2, width / 2];
  const scatterScale = 1;

  const mapTitles = [
    "Cuebiq mobility index, rolling avg (Cuebiq)",
    "% sheltered in place, rolling avg (Cuebiq)",
    "Median distance traveled (Safegraph)",
    "% sheltered (Safegraph)",
  ];

  const MapSettings = {
    width,
    height,
    translate: mapsTranslate,
    scale: mapsScale,
  };

  const [selectedCounty, setSelectedCounty] = useState<[number, string]>([
    -1,
    "",
  ]);

  const [selectedState, setSelectedState] = useState<[number, string]>([
    -1,
    "",
  ]);

  // console.log(selectedCounty, selectedState)

  const cardOrder = [0, 2, 1, 3];

  return (
    <Page>
      <Container>
        <MapView
          MapData={data}
          MapSettings={MapSettings}
          selectedCounty={selectedCounty}
          mapTitles={mapTitles}
          setSelectedCounty={setSelectedCounty}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
        />
        <Cards>
          {cardOrder.map((i) => {
            const county = data
              ? data[i].filter(
                  (d) => Number(d.fips) === Number(selectedCounty[0])
                )[0]
              : false;

            return (
              <Card
                key={i}
                title={mapTitles[i]}
                hcount={county ? county.count("hot") : 0}
                ccount={county ? county.count("cold") : 0}
                hrecent={county ? county.recent("hot") : 0}
                crecent={county ? county.recent("cold") : 0}
              />
            );
          })}
        </Cards>
        <ScatterView 
          MapData={data}
          mapTitles={mapTitles}
          selectedCounty={selectedCounty}
          selectedState={selectedState}
          />
      </Container>
    </Page>
  );
};

export default Trivariate;
