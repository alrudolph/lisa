import React, { useEffect, useRef } from "react";
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

const getStateFips = (fips: number): number => {
  return Number(String(fips).slice(0, -3));
};

type Props = {
  title: string;
  selectedCounty: [number, string];
  selectedState: [number, string];
  data: Array<Sparse>;
};

const average = (arr: Array<number>) => {
  return arr.reduce((a, b) => a + b) / arr.length;
};

export default function ScatterPlot({
  data,
  title,
  selectedState,
  selectedCounty,
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
      .attr("transform", `translate(${margin})`);

    const xAxis = d3.scaleLinear().domain([0, 52]).range([0, width]);

    map_g
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xAxis));

    const yAxis = d3.scaleLinear().domain([0, 52]).range([height, 0]);

    map_g.append("g").call(d3.axisLeft(yAxis));

    const dataToPlot = Object.values(
      data
        .map((d) => {
          const [hot, cold] = d.count();
          return {
            x: hot > cold ? d.recent()[0] : d.recent()[1],
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
        return avg > 0.5 ? hotScale(avg) : coldScale(avg);
      });
  }, []);
  useEffect(() => {
    d3.selectAll(".point").style("fill-opacity", ({ fips }) => {
      return selectedState[0] === -1 ||
        fips.find((f) => getStateFips(f) === selectedState[0]) !== undefined
        ? 1
        : 0.1;
    });
  }, [selectedState]);

  return (
    <Container>
      <Title>{title}</Title>
      <MapContainer ref={d3Container} />
    </Container>
  );
}
