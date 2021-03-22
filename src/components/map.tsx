import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

import * as d3 from "d3";
import * as topojson from "topojson";

import MapZoom from "../utility/mapZoom";
import Sparse from "../utility/sparse";

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

  #c${({ county }: { county: number }) => county}.cboundary {
    stroke: black;
    stroke-width: 0.25px;
  }

  .cboundary {
    stroke-width: 0px;
    fill: #ffffff00;
  }

  .state {
    stroke: black;
    stroke-width: 0.5px;
    fill: #ffffff00;
  }

  .bubble {
    fill: blue;
    fill-opacity: 0.6;
    stroke-width: 0;
  }
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
}: Props) => {
  const { width, height, translate, scale } = MapSettings;

  const d3Container = useRef(null);

  const projection = d3.geoAlbers().scale(scale).translate(translate);
  const map_path = d3.geoPath().projection(projection);

  useEffect(() => {
    const svg = d3.select(d3Container.current);

    const map_g = svg.attr("width", width).attr("height", height).append("g");

    addState(new MapZoom(map_path, map_g, width, height, highlightedState[0]));

    // Counties:
    const counties = map_g
      .append("g")
      .attr("class", "county")
      .selectAll("path")
      .data(
        topojson.feature(countiesMap, countiesMap.objects.counties).features
      )
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("id", ({ id }) => `c${Number(id)}`)
      //   .attr("countyName", ({ properties: { name } }) => name)
      .attr("class", "cboundary")

    // States:
    map_g
      .append("g")
      .attr("class", "state")
      .selectAll("path")
      .data(topojson.feature(countiesMap, countiesMap.objects.states).features)
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("stateName", ({ properties: { name } }) => name)
      .attr("stateFips", ({ id }) => Number(id))
      .attr("class", "sboundary")
  }, []);
  // make the circles highlightable ahhhhhhhhhh

  useEffect(() => {
    d3.selectAll(".sboundary")
      .on("click", function () {
        const state = this.getAttribute("stateName");
        const id = Number(this.getAttribute("stateFips"));
        stateSelector([id, state]);
        d3.selectAll(".state").lower();
      });

    d3.selectAll(".cboundary")
      .on("click", function (event, { id }) {

        if (!stateSelector([getStateFips(id), ""])) {
          d3.selectAll(".state").raise();
        }
      });
  }, [stateSelector])

  useEffect(() => {
    d3.selectAll(".cboundary")
      .on("mouseover", function (event, { id, properties: { name } }) {
        countySelector([Number(id), name]);
      })
      .on("mouseout", () => {
        countySelector([-1, ""]);
      })
  }, [countySelector])

  useEffect(() => {
    const counties = d3.select(".county").enter()

    // d3.selectAll("")
    //   .selectAll("circle")
    //   .data(data)
    //   .enter()
    //   .append("circle")
    //   .attr("class", "bubble")
    //   .attr(
    //     "r",
    //     (d) => (Math.abs(d.count("hot") - d.count("cold")) / d.n) * 1.5
    //   )
    //   .attr("transform", ({ fips }) => {
    //     let output: string;
    //     // this is much faster than for loop with break ??
    //     counties.data().forEach((p) => {
    //       if (Number(p.id) === Number(fips)) {
    //         const t = map_path.centroid(p);
    //         output = `translate(${t})`;
    //         //            ughhhhhhhhhhhh
    //         //            break;
    //       }
    //     });
    //     return output;
    //   });
    // .on("mouseout", () => {
    //   countySelector([-1, ""]);
    // })
    // .on("click", (_, d) => {
    //   const stateId = getStateFips(d.fips);

    //   console.log("CLICKED STATE GETTING NAME")
    //   // const { properties: { name } } = states.data().find(({ id }) => {
    //   //   return Number(id) === stateId;
    //   // });

    //   const name = "NAME 2"

    //   if (name && stateId) {
    //     console.log(name, stateId)
    //     if (stateSelector([stateId, name])) {

    //       d3.selectAll(".state").raise()
    //     }
    //   }

    // })
    // .on("mouseover", (_, d) => {
    //   if (!highlightedState) {
    //     return;
    //   }

    //   // const {
    //   //   properties: { name },
    //   // } = counties.data().find(({ id }) => {
    //   //   return Number(id) === d.fips;
    //   // });

    //   const name = "NAME 3"

    //   console.log(getStateFips(d.fips), highlightedState[0])

    //   if (getStateFips(d.fips) === highlightedState[0]) {
    //     countySelector([d.fips, name]);
    //   }
    // })
  }, []);

  return (
    <Container>
      <Title>{title}</Title>
      <MapContainer ref={d3Container} county={highlightedCounty[0]} />
    </Container>
  );
};

export default Map;
