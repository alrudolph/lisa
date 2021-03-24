import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import * as d3 from "d3";

import Sparse from "../../utility/sparse";
import { index } from "d3";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 10px;
`;

const Title = styled.h3`
  margin: 0;
`;

const MapContainer = styled.svg``;

const getData = (data, time) =>
  Object.values(
    data
      .map((d) => {
        const [hot, cold] = d.count(...time);
        return {
          x:
            (hot > cold ? d.recent(...time)[0] : d.recent(...time)[1]) +
            time[0],
          y: hot > cold ? hot : cold,
          hot: hot > cold,
          fips: d.fips,
        };
      })
      .reduce((result, { x, y, fips, hot }) => {
        const key = `${x},${y}`;

        if (key in result) {
          result[key].fips.push(fips);
          result[key].hot.push(hot);
        } else {
          result[key] = {
            x,
            y,
            fips: [fips],
            hot: [hot],
          };
        }
        return result;
      }, {})
  );

const getStateFips = (fips: number): number => {
  return Number(String(fips).slice(0, -3));
};

type Props = {
  title: string;
  selectedCounty: [number, string];
  selectedState: [number, string];
  data: Array<Sparse>;
  time: [number, number];
};

const average = (arr: Array<number>) => {
  return arr.reduce((a, b) => a + b) / arr.length;
};

export default function ScatterPlot({
  data,
  title,
  selectedState,
  selectedCounty,
  time,
}: Props) {
  const size = 380;
  const scale = 1;
  const margin = [50, 50];

  const height = size - 2 * 50;
  const width = size - 2 * 50;

  const d3Container = useRef(null);

  useEffect(() => {
    const svg = d3.select(d3Container.current);

    const map_g = svg
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("scale", 10)
      .attr("transform", `translate(${margin})`);

    const xAxis = d3.scaleLinear().domain([0, 52]).range([0, width]);

    map_g
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xAxis));

    const yAxis = d3.scaleLinear().domain([0, 52]).range([height, 0]);

    map_g.append("g").call(d3.axisLeft(yAxis));

    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + 100)
      .attr("y", height + 85)
      .text("Week Number");

    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", -35 - height / 2)
      .attr("y", 10)
      .attr("dy", "0.75em")
      .attr("transform", "rotate(-90)")
      .text("Count");

    const dataToPlot = getData(data, time);

    const coldScale = d3.interpolateBlues;
    const hotScale = d3.interpolateReds;

    map_g
      .selectAll("dot")
      .data(dataToPlot)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", ({ x }) => xAxis(x))
      .attr("cy", ({ y }) => yAxis(y))
      .attr("r", 2)
      .style("fill", ({ hot }) => {
        const avg = average(hot);
        return avg > 0.5 ? hotScale(avg) : coldScale(1 - avg); // make sure 1 - avg never is 0
      });

    const line = d3
      .line()
      .x(({ x }) => xAxis(x))
      .y(({ y }) => yAxis(y));

    // lines
    // does all calculations at once then turns on later
    map_g
      .selectAll("myLines")
      .data(
        data.map((d) => {
          const [hot, cold] = d.count();
          return {
            data: hot > cold ? d.sequential(1) : d.sequential(2),
            fips: d.fips,
          };
        })
      )
      .enter()
      .append("path")
      .attr("class", "seq")
      .attr("stroke", "none")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.15)
      .attr("d", (d) => line(d.data));
  }, [time]);

  useEffect(() => {
    d3.select(d3Container.current)
      .selectAll(".point")
      .style("fill-opacity", ({ fips }) => {
        return selectedState[0] === -1 ||
          fips.find((f) => getStateFips(f) === selectedState[0]) !== undefined
          ? 1
          : 0.07;
      });

    d3.select(d3Container.current)
      .selectAll(".seq")
      .style("stroke", ({ fips }) => {
        return getStateFips(fips) === selectedState[0]
          ? "black"
          : "none";
      });
  }, [selectedState]);

  return (
    <Container>
      <Title>{title}</Title>
      <MapContainer ref={d3Container} />
    </Container>
  );
}
