import React, { useRef, useEffect } from "react";
import styled from "styled-components";

import * as d3 from "d3";
import * as topojson from "topojson";
import MapZoom from "../../utility/mapZoom";

import countiesMap from "us-atlas/counties-10m.json";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 10px;
`;

const MapContainer = styled.svg`
  g {
    background-color: light-gray;
    fill: red;
  }

  &:hover {
    cursor: pointer;
  }
`;

type Props = {
  highlightedState: [number, string];
  stateSelector: ([a, b]: [number, string]) => void;
  addState: (m: MapZoom) => void;
};

export default function StateSelection({
  highlightedState,
  stateSelector,
  addState,
}: Props) {
  const width = 380 - 10;
  const height = 250;
  const translate: [number, number] = [width / 2, height / 2];
  const scale = 500;

  const d3Container = useRef(null);

  const projection = d3.geoAlbers().scale(scale).translate(translate);
  const map_path = d3.geoPath().projection(projection);

  useEffect(() => {
    const map_g = d3
      .select(d3Container.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

    // addState(new MapZoom(map_path, map_g, width, height, highlightedState[0]));

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
      .attr("stateFips", ({ id }) => Number(id))
      .attr("stateName", ({ properties: { name } }) => name)
  }, []);

  useEffect(() => {
    d3.select(d3Container.current)
      .selectAll("path")
      .on("click", function () {
        stateSelector([
          Number(this.getAttribute("stateFips")),
          this.getAttribute("stateName"),
        ]);
      })
      .style("fill", function () {
        return Number(this.getAttribute("stateFips")) === highlightedState[0]
          ? "rgb(0,54,96)"
          : "#ffffffff";
      });
  }, [highlightedState]);

  return (
    <Container>
      <MapContainer ref={d3Container} />
    </Container>
  );
}
