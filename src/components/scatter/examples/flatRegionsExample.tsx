import React, { useContext } from "react";
import ScatterPlot from "../scatterPlot";
import { LisaContext } from "../../../contexts/lisaContext";

import * as d3 from "d3";

export default function WeekStartExample() {
  // Only want the fourth map
  const {
    mapData: [_, map, __, ___],
    mapTitles: [_1, title, __1, ___1],
  } = useContext(LisaContext);

  // Get values only for California
  const data = map.filter(({ fips }) => Math.floor(fips / 1000) === 42);

  const label1 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 115)
      .attr("y", 180)
      .attr("dy", "0.75em")
      .text("Social Distancing,"); // week 12

  const label2 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 115)
      .attr("y", 200)
      .attr("dy", "0.75em")
      .text("Schools Close"); // week 12

  const label3 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 160)
      .attr("y", 80)
      .attr("dy", "0.75em")
      .text("Counties enter"); // week 19

  const label4 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 160)
      .attr("y", 100)
      .attr("dy", "0.75em")
      .text("Yellow Phase"); // week 19

  const label5 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 280)
      .attr("y", 30)
      .attr("dy", "0.75em")
      .text("Stay-at-home"); // week 46

  const label6 = (svg) =>
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 280)
      .attr("y", 50)
      .attr("dy", "0.75em")
      .text("advisory"); // week 46

  const arrow1 = (svg) =>
    svg
      .append("path")
      .attr(
        "d",
        d3.line()([
          [115, 220],
          [115, 275],
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
          [160, 120],
          [160, 260],
        ])
      )
      .attr("stroke", "black")
      .attr("fill", "red");

  const arrow3 = (svg) =>
    svg
      .append("path")
      .attr(
        "d",
        d3.line()([
          [280, 70],
          [300, 240],
        ])
      )
      .attr("stroke", "black")
      .attr("fill", "red");
  return (
    <ScatterPlot
      title={title}
      data={data}
      selectedState={[42, "Pennsylvania"]}
      labels={[label1, label2, label3, label4, label5, label6]}
      arrows={[arrow1, arrow2, arrow3]}
    />
  );
}
