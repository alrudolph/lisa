import React, { useContext } from "react";
import ScatterPlot from "../scatterPlot";
import { LisaContext } from "../../../contexts/lisaContext";

import * as d3 from "d3";

export default function WeekStartExample() {
  // Only want the fourth map
  const {
    mapData: [_, __, ___, map],
    mapTitles: [_1, __1, ___1, title],
  } = useContext(LisaContext);

  // Get values only for California
  const data = map.filter(({ fips }) => Math.floor(fips / 1000) === 6);

  const label1 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 130)
      .attr("y", 120)
      .attr("dy", "0.75em")
      .text("Mar 4, State of"); // week 10

  const label2 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 130)
      .attr("y", 140)
      .attr("dy", "0.75em")
      .text("Emergency Declared"); // week 10

  const arrow1 = (svg) =>
    svg
    .append("path")
    .attr("d", d3.line()([[125, 160], [105, 275]]))
    .attr("stroke", "black")
    .attr("fill", "red")

  return (
    <ScatterPlot
      title={title}
      data={data}
      selectedState={[6, "California"]}
      labels={[label1, label2]}
      arrows={[arrow1]}
    />
  );
}
