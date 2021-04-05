import React, { useRef, useEffect, useState, useContext } from "react";
import styled from "styled-components";

import * as d3 from "d3";
import * as topojson from "topojson";

import { MapsContext } from "../../contexts/mapsContext";
import MapZoom from "../../utility/mapZoom";
import Sparse from "../../utility/sparse";

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
    fill: red;
  }

  #c${({ county }: { county: number }) => county}.cboundary {
    stroke: black;
    stroke-width: 0.25px;
  }

  .cboundary {
    stroke-width: 0px;
    fill: #ffffff00;
  }

  .bubble {
    stroke-width: 0;
  }

  border: 1px solid
    ${({ border }: { border: boolean }) => (border ? "black" : "white")};
`;

const getStateFips = (fips: number): number => {
  return Number(String(fips).slice(0, -3));
};

type MapSettings = {
  width: number;
  height: number;
  translate: [number, number];
  scale: number;
};

type Data = Array<Sparse>;

interface Props {
  title: string;
  MapSettings: MapSettings;
  countiesMap: any;
  highlightedState: [number, string];
  highlightedCounty: [number, string];
  addState: (m: MapZoom) => void;
  stateSelector: ([s, s1]: [number, string], b?: boolean) => boolean;
  countySelector: ([s, s1]: [number, string]) => void;
  data: Data;
  time: [number, number];
  colorScales: [any, any];
  getRadius: (g: Sparse) => number;
}

const Map = ({
  title,
  MapSettings,
  countiesMap,
  highlightedState,
  highlightedCounty,
  addState,
  stateSelector,
  countySelector,
  data,
  time,
  colorScales: [hotScale, coldScale],
  getRadius,
}: Props) => {
  const { width, height, translate, scale } = MapSettings;

  const d3Container = useRef(null);

  const projection = d3.geoAlbers().scale(scale).translate(translate);
  const map_path = d3.geoPath().projection(projection);

  const { counties, states } = useContext(MapsContext);

  useEffect(() => {
    const map_g = d3
      .select(d3Container.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

    addState(new MapZoom(map_path, map_g, width, height, highlightedState[0]));

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
        return countiesMap.objects.states.geometries.filter((val) => {
          return getStateFips(id) === Number(val.id);
        })[0].properties.name;
      })
      .attr("id", ({ id }) => `c${Number(id)}`)
      //   .attr("countyName", ({ properties: { name } }) => name)
      .attr("class", "cboundary")
      .on("mouseout", () => {
        countySelector([-1, ""]);
      });

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
      .attr("stateName", ({ fips }) => {
        return countiesMap.objects.states.geometries.filter(({ id }) => {
          return getStateFips(fips) === Number(id);
        })[0].properties.name;
      })
      .attr("transform", ({ fips }) => {
        const county_path = d3.select(`#c${fips}`).datum();
        return `translate(${map_path.centroid(county_path)})`;
      })
      .on("mouseout", () => {
        countySelector([-1, ""]);
      });
  }, []);

  useEffect(() => {
    d3.selectAll(".bubble")
      .attr("r", getRadius)
      .style("fill", (sparse) => {
        const [hot, cold] = sparse.recent(...time);
        return hot > cold ? hotScale(hot) : coldScale(cold);
      });
  }, [time]);

  useEffect(() => {
    d3.selectAll(".cboundary").on("click", function (event, { id }) {
      stateSelector([getStateFips(id), this.getAttribute("stateName")]);
    });

    d3.selectAll(".cboundary").on(
      "mouseover",
      function (event, { id, properties: { name } }) {
        if (highlightedState[1] !== "") {
          countySelector([Number(id), name]);
        }
      }
    );

    d3.selectAll(".bubble")
      .on("mouseover", function (_, { fips }) {
        if (!highlightedState) {
          return;
        }
        // console.log(getStateFips(d.fips), highlightedState[0])
        if (highlightedState[1] !== "") {
          countySelector([fips, this.getAttribute("countyName")]);
        }
      })
      .on("click", function (event, { fips }) {
        stateSelector([getStateFips(fips), this.getAttribute("stateName")]);
      })
      .style("fill-opacity", ({ fips }) => {
        return highlightedState[0] === -1 ||
          getStateFips(fips) === highlightedState[0]
          ? 1
          : 0.2;
      });
  }, [highlightedState]);

  return (
    <Container>
      <Title>{title}</Title>
      <MapContainer
        ref={d3Container}
        county={highlightedCounty[0]}
        border={highlightedState[0] !== -1}
      />
    </Container>
  );
};

export default Map;
