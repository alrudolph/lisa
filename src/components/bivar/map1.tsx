import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";

import * as d3 from "d3";
import * as topojson from "topojson";

import Sparse from "../../utility/sparse";
import MapZoom from "../../utility/mapZoom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 10px;
`;

const Title = styled.h3`
  margin: 0;
`;

const MapContainer = styled.svg`
  g {
    background-color: light-gray;
    fill: red; // sjakldjsakldjsakljdsklajdkl <----------------------------------
  }
  border: 1px solid
    ${({ border }: { border: boolean }) => (border ? "black" : "white")};
  // background-color: #f5f5f5;
`;

type MapData = Array<Sparse>;

type MapSettings = {
  width: number;
  height: number;
  translate: [number, number];
  scale: number;
};

interface Props {
  title: string;
  highlightedCounty: [number, string];
  countySelector: ([s, s1]: [number, string]) => void;
  data: MapData;
  time: [number, number];
  MapSettings: MapSettings;
  weekNum: number;
  past: boolean;
  addState: (m: MapZoom) => void;
  stateSelector: ([a, b]: [number, string]) => void;
  selectedState: [number, string];
  d3Container: any;
}

const getStateFips = (fips: number): number => {
  return Number(String(fips).slice(0, -3));
};
const Map1 = ({
  title,
  highlightedCounty,
  countySelector,
  data,
  time,
  MapSettings,
  weekNum,
  past,
  addState,
  stateSelector,
  selectedState,
  d3Container,
}: Props) => {
  const map_svg = useRef(null);

  const { height, width } = MapSettings;

  useEffect(() => {
    if (map_svg && map_svg.current) {
      console.log("COPYING");
      const { elem, path, svg } = d3Container.copy();

      map_svg.current.appendChild(elem);

      const g = d3.select(map_svg.current).select("#states")
      addState(new MapZoom(path, g, width, height, -1));
    }
  }, [map_svg]);

  useEffect(() => {
    data.forEach((d) => {
      const { curr, last, weeks } = d.getLast(weekNum);

      let col = "#00000000",
        opac = 1;

      if (!past && curr !== 0) {
        col = curr === 1 ? "#fa5a50" : "#5768ac";
      } else if (past) {
        col = (curr !== 0 && curr === 1) || last === 1 ? "#fa5a50" : "#5768ac";

        // this is just the last week number, not number since last weeks so we can change calculation back
        opac = curr
          ? 1
          : ((weekNum - weeks + 1) / (weekNum + 1)) * Number(last !== -1);
      }

      // Reduce opacity for states taht aren't selected
      opac *= Math.pow(
        1 / 4,
        1 -
          Number(
            getStateFips(d.fips) === selectedState[0] || selectedState[0] === -1
          )
      );

      const sel = d3.select(map_svg.current).select(`#c${d.fips}`);
      sel.style("fill", col);
      sel.style("fill-opacity", opac);
    });
  }, [weekNum, past, selectedState]);

  useEffect(() => {
    d3.select(map_svg.current.childNodes[0])
      .selectAll(".cboundary")
      .on("click", function ({ target: { id, attributes }}) {
        stateSelector([
          getStateFips(id.substr(1)),
          attributes[1].value,
        ]);
      });
    // // .style("fill-opacity", function( { id }){
    // //   return getStateFips(id) === selectedState[0] || selectedState[0] === -1 ? "1" : "0.3"
    // // })
  }, [selectedState]);

  return (
    <Container>
      <Title>{title}</Title>
      <div ref={map_svg} />
    </Container>
  );
};

export default Map1;
