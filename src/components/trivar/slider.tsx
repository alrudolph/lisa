import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import * as d3 from "d3";

const Container = styled.div`
  width: 100%;

  .ticks {
    font: 10px sans-serif;
  }

  .track,
  .track-inset,
  .track-overlay {
    stroke-linecap: round;
  }

  .track {
    stroke: #000;
    stroke-opacity: 0.3;
    stroke-width: 10px;
  }

  .track-inset {
    stroke: #ddd;
    stroke-width: 8px;
  }

  .track-overlay {
    pointer-events: stroke;
    stroke-width: 50px;
    stroke: transparent;
    cursor: crosshair;
  }

  .handle {
    fill: #fff;
    stroke: #000;
    stroke-opacity: 0.5;
    stroke-width: 1.25px;
  }
`;

type Props = {
  time: [number, number];
  setTime: ([n1, n2]: [number, number]) => void;
};

export default function Slider({ time, setTime }: Props) {
  const d3Container = useRef(null);

  const width = 600;
  const height = 100;

  useEffect(() => {
    let currentValue = 0;

    const svg = d3
      .select(d3Container.current)
      .attr("width", width)
      .attr("height", height)
    //   .append("g");

    const x = d3.scaleLinear().domain([0, 52]).range([0, width]).clamp(true);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + 10 + "," + height / 2 + ")");

    slider
      .append("line")
      .attr("class", "track")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
      .select(function () {
        return this.parentNode.appendChild(this.cloneNode(true));
      })
      .attr("class", "track-inset")
      .select(function () {
        return this.parentNode.appendChild(this.cloneNode(true));
      })
      .attr("class", "track-overlay")
      .call(
        d3
          .drag()
          .on("start.interrupt", function () {
            slider.interrupt();
          })
          .on("start drag", function () {
            // hue(x.invert(d3.event.x));
          })
      );

    slider
      .insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter()
      .append("text")
      .attr("x", x)
      .attr("text-anchor", "middle")
      .text(d => d);

    var handle = slider
      .insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);
  }, [time]);

  return (
    <Container>
      <svg ref={d3Container} />
    </Container>
  );
}
