import React, { useRef, useEffect, useContext } from "react";
import styled from "styled-components";

import * as d3 from "d3";
import * as topojson from "topojson";
import countiesMap from "us-atlas/counties-10m.json";

import MapZoom from "../../utility/mapZoom";
import Sparse from "../../utility/sparse";
import { LisaContext } from "../../contexts/lisaContext";

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
    fill: red;
  }
  border: 1px solid black;

  .cboundary {
    stroke-width: 0px;
    fill: #ffffff00;
  }

  .bubble {
    stroke-width: 0;
  }
`;

type MapSettings = {
  width: number;
  height: number;
  translate: [number, number];
  scale: number;
};

interface Props {
  MapSettings: MapSettings;
}

const Map = ({ MapSettings }: Props) => {
  const { width, height, translate, scale } = MapSettings;

  const { mapData, mapTitles } = useContext(LisaContext);

  const data = mapData[0];
  const title = mapTitles[0];

  const d3Container = useRef(null);

  const projection = d3.geoAlbers().scale(scale).translate(translate);
  const map_path = d3.geoPath().projection(projection);

  useEffect(() => {
    const map_g = d3
      .select(d3Container.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

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
      .attr("id", ({ id }) => `c${Number(id)}`)
      //   .attr("countyName", ({ properties: { name } }) => name)
      .attr("class", "cboundary");

    // County Circles:
    map_g
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      /* 
        HAVE TO LOAD COUNTY AND STATE NAME TO BUBBLES HERE:
          MAYBE PUT THOSE AS SPARSE VECTOR INFO
      */
      .attr("countyName", ({ fips }) => {
        return countiesMap.objects.counties.geometries.filter(({ id }) => {
          return fips === Number(id);
        })[0].properties.name;
      })
      .attr("transform", ({ fips }) => {
        const county_path = d3.select(`#c${fips}`).datum();
        return `translate(${map_path.centroid(county_path)})`;
      })
      .attr("r", (d) => {
          return d.get(0) === 2 ? 8 : 0;
      })
  }, []);

  return (
    <Container>
      <Title>{title}</Title>
      <MapContainer ref={d3Container} />
    </Container>
  );
};

export default Map;
