import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import * as d3 from "d3";

const Container = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
`

type Props = {
  week: number;
};

export default function TimeLineLegend({ week }: Props) {
  const d3Container = useRef(null);

  const maxHeight = 60;
  const maxWidth = 370;
  const margin = [20, 20];

  const width = maxWidth;
  const height = maxHeight;
  useEffect(() => {
    d3.select(d3Container.current).selectAll("*").remove();

    const leftMargin = 30;

    const map_g = d3
      .select(d3Container.current)
      .style("width", maxWidth)
      .style("height", maxHeight + 15)
      // .style("background-color", "lightgray")
      .append("g")
      .attr("transform", `translate(${leftMargin + margin[0]},0)`);

    const xAxis = d3
      .scaleLinear()
      .domain([1, 52])
      .range([0, maxWidth - 2 * margin[0] - leftMargin]);
    const yAxis = d3
      .scaleLinear()
      .domain([0, 2])
      .range([maxHeight - margin[1], 0]);

    const pointData = [...Array(52 * 4).keys()].map((i) => {
      return {
        w: i / 4,
        c: i % 2,
      };
    });
    map_g
      .append("g")
      .attr("transform", `translate(0,${margin[1] + (maxHeight * 5) / 12})`)
      .call(
        d3.axisBottom(xAxis).ticks(5)
        //   .tickFormat((i) => String(pointData[i - 1].w))
      )
      .style("display", "none");

    map_g
      .append("g")
      .attr("transform", `translate(${0},0)`)
      .call(d3.axisLeft(yAxis))
      .style("display", "none");

    map_g
      .selectAll("rect")
      .remove()
      .data(pointData)
      .enter()
      .append("rect")
      .attr("class", "point")
      .attr("x", ({ w }) => xAxis(w))
      .attr("y", ({ c }) => yAxis(c) - 5)
      .attr("width", 3)
      .attr("height", 15)
      .attr("stroke", "none") //({ c }) => (c === 1 ? "#fa5a50" : "#5768ac"))
      // .attr("stroke-opacity", ({ w }) => w / 52)
      // .attr("stroke-width", 0)
      .attr("fill", ({ c }) => (c === 1 ? "#fa5a50" : "#5768ac"))
      .attr("fill-opacity", ({ w }) => w / 52);

    // map_g
    //   .append("text")
    //   .attr("text-anchor", "end")
    //   .attr("x", maxWidth / 2 + leftMargin)
    //   .attr("y", (maxHeight + margin[1] / 2))
    //   .text("Week Number");

    map_g
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", xAxis(1))
      .attr("y", maxHeight + margin[1] / 2)
      .text("Past");

    map_g
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", xAxis(50))
      .attr("y", maxHeight + margin[1] / 2)
      .text("Recent");

    map_g
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", -leftMargin / 2)
      .attr("y", maxHeight / 3 + margin[1] / 4)
      .text("Hot");

    map_g
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", -leftMargin / 2)
      .attr("y", (maxHeight * 2) / 3 + margin[1] / 4)
      .text("Cold");
  }, []);

  return (
    <Container>
      <svg ref={d3Container}></svg>
    </Container>
  );
}
