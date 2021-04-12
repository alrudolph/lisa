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

  const label = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 105)
      .attr("y", 100)
      .attr("dy", "0.75em")
      .text("March 4, State"); // week 10

  const label1 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 105)
      .attr("y", 120)
      .attr("dy", "0.75em")
      .text("of Emergency"); // week 10

  const label2 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 105)
      .attr("y", 140)
      .attr("dy", "0.75em")
      .text("Declared"); // week 10

  const label3 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 190)
      .attr("y", 40)
      .attr("dy", "0.75em")
      .text("March 19, Stay"); // week 10

  const label4 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 190)
      .attr("y", 60)
      .attr("dy", "0.75em")
      .text("At Home Order"); // week 10

  const arrow1 = (svg) =>
    svg
      .append("path")
      .attr(
        "d",
        d3.line()([
          [105, 160],
          [105, 275],
        ])
      )
      .attr("stroke", "black")
      .attr("fill", "red");
  const arrow2 = (svg) =>
    svg
      .append("path")
      .attr(
        "d",
        d3.line()([
          [190, 80],
          [118, 275],
        ])
      )
      .attr("stroke", "black")
      .attr("fill", "red");

  return (
    <ScatterPlot
      title={title}
      data={data}
      selectedState={[6, "California"]}
      labels={[label, label1, label2, label3, label4]}
      arrows={[arrow1, arrow2]}
    />
  );
}
