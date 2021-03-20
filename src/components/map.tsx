import React, { useRef, useEffect } from "react";
import styled from "styled-components";

import * as d3 from "d3";
import * as topojson from "topojson";
import MapZoom from "../utility/mapZoom";

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
  background-color: white;
  border: 1px solid black;

  .state .active {
    display: none;
  }

  #c${({ county }) => county}.cboundary {
    stroke: black;
    stroke-width: 0.25px;
  }

  .cboundary {
    stroke-width: 0px;
    fill: white;
  }

  .state {
    stroke: black;
    stroke-width: 0.5px;
    fill: #FFFFFF00;
  }

  .nation {
    fill: white;
    stroke: black;
    stroke-width: 0.75px;
  }
`;

type MapSettings = {
  width: number;
  height: number;
  translate: [number, number];
  scale: number;
};

interface Props {
  title: string;
  MapSettings: MapSettings;
  countiesMap: any;
  highlightedCounty: string;
  addState: (m: MapZoom) => void;
  stateSelector: (s: string) => void;
  countySelector: ([s, s1]: Array<string>) => void;
}

const Map = ({
  title,
  MapSettings,
  countiesMap,
  highlightedCounty,
  addState,
  stateSelector,
  countySelector
}: Props) => {
  const { width, height, translate, scale } = MapSettings;

  const d3Container = useRef(null);

  const projection = d3.geoAlbers().scale(scale).translate(translate);
  const map_path = d3.geoPath().projection(projection);

  useEffect(() => {
    const svg = d3.select(d3Container.current);

    const map_g = svg.attr("width", width).attr("height", height).append("g");

    addState(new MapZoom(map_path, map_g, width, height));

    map_g
      .append("g")
      .selectAll("path")
      .data(
        topojson.feature(countiesMap, countiesMap.objects.nation).features
      )
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("class", "nation")
      
    map_g
      .append("g")
      .selectAll("path")
      .data(
        topojson.feature(countiesMap, countiesMap.objects.counties).features
      )
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("id", ({ id }) => `c${id}`)
      .attr("countyName", ({ properties: { name }}) => name)
      .attr("class", "cboundary")
      .on("mouseover", function (event, { id, properties: { name } }) {
        console.log(id, name)
        countySelector([id, name]);
      })
      .on("mouseout", (event, { id }) => {
        
      })

    map_g
      .append("g")
       .attr("class", "state")
      .selectAll("path")
      .data(topojson.feature(countiesMap, countiesMap.objects.states).features)
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("stateName", ({ properties: { name }}) => name)
      .on("click", function () {
        stateSelector(this.getAttribute("stateName"));
      })

  }, []);

  return (
    <Container>
      <Title>{title}</Title>
      <MapContainer ref={d3Container} county={highlightedCounty}/>
    </Container>
  );
};

export default Map;
