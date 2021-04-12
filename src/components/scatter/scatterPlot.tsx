import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import * as d3 from "d3";

import Sparse from "../../utility/sparse";

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
  height: 330px;
`;

const getData = (data) =>
  Object.values(
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

const getStateFips = (fips: number): number => {
  return Number(String(fips).slice(0, -3));
};

type Props = {
  title: string;
  selectedState: [number, string];
  data: Array<Sparse>;
  labels?: Array<any>;
  arrows?: Array<any>;
  lines?: Array<any>;
};

const average = (arr: Array<number>) => {
  return arr.reduce((a, b) => a + b) / arr.length;
};

const subset = (vals: Array<number>, sel: Array<boolean>) => {
  return vals.filter((_, i) => sel[i]);
};

export default function ScatterPlot({
  data,
  title,
  selectedState,
  labels,
  arrows,
  lines
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
      .attr("width", size - 40)
      .attr("height", size - 40)
      .append("g")
      .attr("scale", 10)
      .attr("transform", `translate(${margin[0]}, ${margin[1] - 40})`);

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
      .attr("y", height + 85 - 40)
      .text("Week Number");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", -10 - height / 2)
      .attr("y", 10)
      .attr("dy", "0.75em")
      .attr("transform", "rotate(-90)")
      .text("Count");

    const dataToPlot = getData(data);

    // console.log(
    //   dataToPlot.filter(({x , y}) => x === 52 && y === 20)
    // )

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
            hot: hot > cold,
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

    map_g
      .selectAll("dot")
      .data(dataToPlot)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", ({ x }) => xAxis(x))
      .attr("cy", ({ y }) => yAxis(y))
      .attr("r", 2);

    if (labels !== undefined) {
      labels.forEach(label => label(svg))
    }
    if (arrows !== undefined) {
      arrows.forEach(arrow => arrow(svg))
    }
    if (lines !== undefined) {
        map_g
        .selectAll("divLines")
        .data(lines)
        .enter()
        .append("path")
        // .style("stroke-dasharray", "3, 3")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 1)
        .attr("stroke", "black")
        .attr("stroke-dasharray", "1,1")
        .attr("d", d => {
          return line(d);
        })
    }
  }, []);

  useEffect(() => {
    const coldScale = d3.interpolateBlues;
    const hotScale = d3.interpolateReds;

    d3.select(d3Container.current)
      .selectAll(".point")
      .style("fill-opacity", ({ fips }) => {
        return selectedState[0] < 0 ||
          fips.find((f) => getStateFips(f) === selectedState[0]) !== undefined
          ? 1
          : 0.1;
      })
      .style("fill", ({ hot, fips }) => {
        const countiesInState = fips.map(
          (f) => selectedState[0] === -1 || getStateFips(f) === selectedState[0]
        );
        const countiesInPoint = subset(hot, countiesInState);
        const avg = average(countiesInPoint.length ? countiesInPoint : hot);
        return avg > 0.5 ? hotScale(avg) : coldScale(1 - avg); // make sure 1 - avg never is 0
      });

    d3.select(d3Container.current)
      .selectAll(".seq")
      .style("stroke", ({ fips, hot }) => {
        return selectedState[0] === -2 || getStateFips(fips) === selectedState[0]
          ? hot
            ? "#FF0000"
            : "#0000FF"
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
