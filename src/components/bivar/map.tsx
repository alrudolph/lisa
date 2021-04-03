import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

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
  border: 1px solid ${({ border }: { border: boolean }) => border ? "black" : "white"};
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
  countiesMap: any;
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
}

const getStateFips = (fips: number): number => {
  return Number(String(fips).slice(0, -3));
};
const Map = ({
  title,
  countiesMap,
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
}: Props) => {
  const { scale, translate, width, height } = MapSettings;

  const d3Container = useRef(null);

  const projection = d3.geoAlbers().scale(scale).translate(translate);
  const map_path = d3.geoPath().projection(projection);

  useEffect(() => {
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
      .data(topojson.feature(countiesMap, countiesMap.objects.states).features)
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("stateFips", ({ id }) => Number(id));

    // Counties:
    map_g
      .append("g")
      .selectAll("path")
      .data(
        topojson.feature(countiesMap, countiesMap.objects.counties).features
      )
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("stateName", ({ id }) => {
        return countiesMap.objects.states.geometries.filter((val) => {
          return getStateFips(id) === Number(val.id);
        })[0].properties.name;
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

      let col, opac;

      if (curr && curr !== 0) {
        col = curr === 1 ? "#fa5a50" : "#5768ac";
        opac = 1;
      } else {
        col = "#00000000";
        if (last === 1) {
          col = "#ff0000";
        } else if (last === 2) {
          col = "#0000ff";
        }
        opac = past ? (last > 0 && weeks > 0 ? Math.pow(4, -weeks) : 0) : 0;
      }
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
      <MapContainer ref={d3Container} border={selectedState[0] !== -1}/>
    </Container>
  );
};

export default Map;
