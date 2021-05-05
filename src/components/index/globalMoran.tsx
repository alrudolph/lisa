import React, { useRef, useEffect } from "react";
import styled from "styled-components";

import * as d3 from "d3";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.h3``;

const Plot = styled.div`
  height: 250px;
  width: 370px;
`;

type Props = {
  title: string;
  data: Array<number>;
};

export default function GlobalMoran({ title, data }: Props) {
  const margin = { top: 10, right: 20, bottom: 30, left: 40 };
  const width = 370 - margin.left - margin.right;
  const height = 250 - margin.top - margin.bottom;

  const d3Container = useRef(null);

  useEffect(() => {
    const svg = d3
      .select(d3Container.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear().domain([0, 52]).range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    const maxY = Math.min(Math.max(...data.map((item) => item[1])) * 1.05, 1);
    const minY = Math.max(Math.min(...data.map((item) => item[1])) * 0.95, 0);

    const y = d3.scaleLinear().domain([minY, maxY]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    const line = d3
      .line()
      .x(({ x1 }) => x(x1))
      .y(({ y1 }) => y(Number(y1)));
    const lineWeek = 11;

    // VERTICAL LINE:
    svg
      .append("path")
      .attr(
        "d",
        line([
          { x1: lineWeek, y1: minY },
          { x1: lineWeek, y1: maxY },
        ])
      )
      .style("stroke", "gray")
      .style("stroke-width", 2);

    // LINES:
    svg
      .append("path")
      .datum(
        data.map(([x1, y1]) => {
          return { x1, y1 };
        })
      )
      .style("stroke", "gray")
      .style("stroke-width", 2)
      .style("stroke-opacity", 0.8)
      .style("stroke-dasharray", "3, 3")
      .style("fill", "none")
      .attr("d", (d) => {
        console.log(d);
        return line(d);
      });

    // SCATTER:
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]))
      .attr("r", 4.5)
      .style("fill", "blue")
      .style("fill-opacity", 0.7)
  }, []);

  return (
    <Container>
      <Title>{title}</Title>
      <Plot ref={d3Container}></Plot>
    </Container>
  );
}
