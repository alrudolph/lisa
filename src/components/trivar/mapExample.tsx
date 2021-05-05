import React, { useRef, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { graphql, useStaticQuery } from "gatsby";

import * as d3 from "d3";

import { MapsContext } from "../../contexts/mapsContext";
import { LisaContext } from "../../contexts/lisaContext";
import Sparse from "../../utility/sparse";

const Container = styled.div``;

const Map = styled.svg`
  width: 350px;
  height: 250px;
`;

const getRandomX = () => 10 * (Math.random() - 0.5);
const getRandomY = () => 50 * (Math.random() - 0.5);

const width = 280;
const height = 250;

const xAxis = d3.scaleLinear().domain([1, 52]).range([0, 200]);
const yAxis = d3
  .scaleLinear()
  .domain([0, 2])
  .range([height / 4, 0]);

const time = [0, 52];
const coldScale = d3.scaleSequentialPow(d3.interpolateBlues).domain([...time]);
const hotScale = d3.scaleSequentialPow(d3.interpolateReds).domain([...time]);

const state1 = (container, map_path) => {
  d3.select(container.current).select("#xaxis").attr("visibility", "hidden");
  d3.select(container.current)
    .selectAll(".cboundary")
    .style("stroke-opacity", 1);
  d3.select(container.current)
    .selectAll(".bubble")
    .transition()
    .attr("transform", ({ fips }) => {
      const county_path = d3.select(`#c${fips}`).datum();
      return `translate(${map_path.centroid(county_path)})`;
    })
    .style("fill", "#d3d3d3")
    .attr("r", 4)
    .duration(2000);

  d3.select(container.current).select("#axistitle").attr("display", "none");
};

const state2 = (container, map_path) => {
  d3.select(container.current).select("#xaxis").attr("visibility", "hidden");
  d3.select(container.current)
    .selectAll(".cboundary")
    .style("stroke-opacity", 1);

  d3.select(container.current)
    .selectAll(".bubble")
    .transition()
    .style("fill", (sparse) => {
      const [hot, cold] = sparse.recent(...time);
      return hot > cold ? "red" : "blue";
    })
    .attr("r", 4)
    .attr("transform", ({ fips }) => {
      const county_path = d3.select(`#c${fips}`).datum();
      return `translate(${map_path.centroid(county_path)})`;
    })
    .duration(1000);
  d3.select(container.current).select("#axistitle").attr("display", "none");
};

const state3 = (container, map_path) => {
  d3.select(container.current)
    .selectAll(".cboundary")
    .style("stroke-opacity", 0);

  d3.select(container.current).select("#xaxis").attr("visibility", "visible");

  d3.select(container.current)
    .selectAll(".bubble")
    .transition()
    .style("fill", (sparse) => {
      const [hot, cold] = sparse.recent(...time);
      return hot > cold ? hotScale(hot) : coldScale(cold);
    })
    .attr("transform", (d) => {
      const [hot, cold] = d.recent(...time);
      return `translate(${xAxis(Math.max(hot, cold)) + width / 5 + 25}, ${
        yAxis(hot > cold ? 1 : 2) + height / 4
      })`;
    })
    .attr("r", 4)
    .duration(2000);

  d3.select(container.current).select("#axistitle").attr("display", "block");
};

const getRadius = (d: Sparse) => {
  const val = d.count();
  const n = d.n;
  return ((10 + Math.max(...val)) / n) * 12;
};

const state4 = (container, map_path) => {
  d3.select(container.current).select("#xaxis").attr("visibility", "visible");
  d3.select(container.current)
    .selectAll(".cboundary")
    .style("stroke-opacity", 0);
  d3.select(container.current)
    .selectAll(".bubble")
    .transition()
    .style("fill", (sparse) => {
      const [hot, cold] = sparse.recent(...time);
      return hot > cold ? hotScale(hot) : coldScale(cold);
    })
    .attr("r", getRadius)
    .attr("transform", (d) => {
      const [hot, cold] = d.recent(...time);
      return `translate(${xAxis(hot > cold ? hot : cold) + width / 5 + 25}, ${
        yAxis(hot > cold ? 1 : 2) + height / 4
      })`;
    })
    .duration(2000);
  d3.select(container.current).select("#axistitle").attr("display", "block");
};

const state5 = (container, map_path) => {
  d3.select(container.current)
    .selectAll(".cboundary")
    .style("stroke-opacity", 1);
  d3.select(container.current).select("#xaxis").attr("visibility", "hidden");
  d3.select(container.current)
    .selectAll(".bubble")
    .transition()
    .style("fill", (sparse) => {
      const [hot, cold] = sparse.recent(...time);
      return hot > cold ? hotScale(hot) : coldScale(cold);
    })
    .attr("r", getRadius)
    .attr("transform", ({ fips }) => {
      const county_path = d3.select(`#c${fips}`).datum();
      return `translate(${map_path.centroid(county_path)})`;
    })
    .duration(2000);
  d3.select(container.current).select("#axistitle").attr("display", "none");
};

const steps = [state1, state2, state3, state4, state5];

type Props = {
  step: number;
};

const MapExample = ({ step }: Props) => {
  const translate: [number, number] = [width + 10 + 25, (height * 7) / 4 - 10];
  const scale = 3000;

  const d3Container = useRef(null);

  const { counties } = useContext(MapsContext);
  const { mapData, mapTitles } = useContext(LisaContext);

  const data = mapData[3].filter(({ fips }) => Math.floor(fips / 1000) == 46);

  const time = [0, 52];

  const getRadius = (d: Sparse) => {
    const val = d.count();
    const n = d.n;
    return ((10 + Math.max(...val)) / n) * 12;
  };

  const projection = d3.geoAlbers().scale(scale).translate(translate);
  const map_path = d3.geoPath().projection(projection);

  useEffect(() => {
    const map_g = d3
      .select(d3Container.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");
    map_g
      .append("g")
      .attr("transform", `translate(${width / 5 + 25},${height / 2})`)
      .attr("id", "xaxis")
      .call(
        d3
          .axisBottom(xAxis)
          //   .ticks(5)
          .tickFormat((i) => String(i))
      );
    // .attr("display", "none");

    map_g
      .append("g")
      .attr("transform", `translate(${width / 5 + 25},${height / 4})`)
      .call(d3.axisLeft(yAxis))
      .attr("display", "none");

    map_g
      .append("g")
      .append("text")
      .attr("id", "axistitle")
      .attr("text-anchor", "middle")
      .attr("x", xAxis(26) + width / 5 + 25)
      .attr("y", yAxis(-3.25))
      .text("Week Number")
      .attr("display", "none");
    // Counties:
    map_g
      .append("g")
      .selectAll("path")
      .data(counties.filter(({ id }) => Math.floor(id / 1000) == 46))
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("id", ({ id }) => `c${Number(id)}`)
      //   .attr("countyName", ({ properties: { name } }) => name)
      .attr("class", "cboundary")
      // .style("stroke-width", 0)
      .style("stroke", "#D3D3D3")
      .style("fill", "#FFFFFF00");

    map_g
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("transform", ({ fips }) => {
        const county_path = d3.select(`#c${fips}`).datum();
        return `translate(${map_path.centroid(county_path)})`;
      });
  }, []);

  useEffect(() => {
    steps[step - 1](d3Container, map_path);
  }, [step]);

  return (
    <Container>
      <Map ref={d3Container} />
    </Container>
  );
};

export default MapExample;
