import React, { useContext } from "react";
import ScatterPlot from "../scatterPlot";
import { LisaContext } from "../../../contexts/lisaContext";

import * as d3 from "d3";

export default function ExplanationExample() {
  // Only want the fourth map
  const {
    mapData: [map, _, __, ___],
    mapTitles: [title, _1, __1, ___1],
  } = useContext(LisaContext);

  // Get values only for California
  const data = map.find(({ fips }) => fips === 56029);

  const label1 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 90)
      .attr("y", 270)
      .attr("dy", "0.75em")
      .text("(1)"); // week 10

  const label2 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 145)
      .attr("y", 270)
      .attr("dy", "0.75em")
      .text("(2)"); // week 10

  const label3 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 220)
      .attr("y", 270)
      .attr("dy", "0.75em")
      .text("(3)"); // week 10
  const label4 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 300)
      .attr("y", 270)
      .attr("dy", "0.75em")
      .text("(1)"); // week 10
  const lines = data
    .sequential(2)
    .map(({ x, y }) => {
      return [
        { x, y: 0 },
        { x, y },
      ];
    })
    .filter(([{ x }, _]) => {
      return [0, 12, 23, 40, 52].includes(x);
    });
  return (
    <ScatterPlot
      title={title}
      data={[data]}
      selectedState={[56, "Wyoming"]}
      labels={[label1, label2, label3, label4]}
      lines={lines}
    />
  );
}
