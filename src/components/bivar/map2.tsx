import React, { useRef, useEffect, useState, useContext } from "react";
import styled from "styled-components";

import * as d3 from "d3";
import * as topojson from "topojson";

import Sparse from "../../utility/sparse";
import MapZoom from "../../utility/mapZoom";

import { MapsContext } from "../../contexts/mapsContext";

import countiesMap from "us-atlas/counties-10m.json";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  margin: 10px 20px;

  @media (max-width: 830px) {
    margin: 10px 5px;
  }
  @media (max-width: 700px) {
    margin: 0;
  }
`;

const Title = styled.h3`
  margin: 0;
`;

const MapContainer = styled.svg`
  g {
    background-color: light-gray;
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
  children: any;
}

const getStateFips = (fips: number): number => {
  return Number(String(fips).slice(0, -3));
};
const Map = ({
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
  children
}: Props) => {
  const { scale, translate, width, height } = MapSettings;

  const d3Container = useRef(null);

  const { counties, states } = useContext(MapsContext);
  useEffect(() => {
    const projection = d3.geoAlbers().scale(scale).translate(translate);
    const map_path = d3.geoPath().projection(projection);

    const map_g = d3
      .select(d3Container.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

    addState(new MapZoom(map_path, map_g, width, height, selectedState[0]));

    // States:
    map_g
      .append("g")
      .style("stroke", "black")
      .style("stroke-width", "0.5px")
      .style("fill", "#ffffffff")
      .selectAll("path")
      .data(states)
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("stateFips", ({ id }) => Number(id));

    // Counties:
    map_g
      .append("g")
      .selectAll("path")
      .data(counties)
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("stateName", ({ id }) => {
        return countiesMap.objects.states.geometries.find((val) => {
          return getStateFips(id) === Number(val.id);
        }).properties.name;
      })
      .attr("id", ({ id }) => `c${Number(id)}`)
      //   .attr("countyName", ({ properties: { name } }) => name)
      .attr("class", "cboundary")
      .style("fill", "#00000000");
    // .style("stroke-width", 0)
    // .style("stroke", "#FFFFFF00")
  }, []);

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

      const sel = d3.select(d3Container.current).select(`#c${d.fips}`);
      sel.style("fill", col);
      sel.style("fill-opacity", opac);
    });
  }, [weekNum, past, selectedState]);

  useEffect(() => {
    d3.select(d3Container.current)
      .selectAll(".cboundary")
      .on("click", function ({ currentTarget }, { id }) {
        stateSelector([
          getStateFips(id),
          currentTarget.getAttribute("stateName"),
        ]);
      });
    // .style("fill-opacity", function( { id }){
    //   return getStateFips(id) === selectedState[0] || selectedState[0] === -1 ? "1" : "0.3"
    // })
  }, [selectedState]);

  return (
    <Container>
      <Title>{title}</Title>
      <MapContainer ref={d3Container} border={selectedState[0] !== -1} />
      {children}
    </Container>
  );
};

export default Map;
