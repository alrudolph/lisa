import React, { useState } from "react";
import styled from "styled-components";

import MapView from "../components/trivar/mapView";
import ScatterView from "../components/trivar/scatterView";
import Card from "../components/trivar/cards";
import Slider from "../components/trivar/slider";
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

  const [time, setTime] = useState<[number, number]>([0, 52])

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
          time={time}
          setTime={setTime}
        />
        {/*<Slider time={time} setTime={setTime}/>*/}
        <Cards>
          {cardOrder.map((i) => {
            const county = data
              ? data[i].filter(
                  (d) => Number(d.fips) === Number(selectedCounty[0])
                )[0]
              : false;

            const [hcount, ccount] = county ? county.count(...time) : [0, 0];
            const [hrecent, crecent] = county ? county.recent(...time) : [0, 0];

            return (
              <Card
                key={i}
                title={mapTitles[i]}
                hcount={hcount}
                ccount={ccount}
                hrecent={hrecent}
                crecent={crecent}
              />
            );
          })}
        </Cards>
        <ScatterView 
          MapData={data}
          mapTitles={mapTitles}
          selectedCounty={selectedCounty}
          selectedState={selectedState}
          time={time}
          />
      </Container>
    </Page>
  );
};

export default Trivariate;
