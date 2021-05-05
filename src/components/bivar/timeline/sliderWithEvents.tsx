import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import * as d3 from "d3";

import { DatesContext } from "../../../contexts/datesContext";

const Slider = styled.svg`
  width: 760px;
  height: 150px;
`;

type Props = {
  week: number;
  setWeek: (number) => void;
  setPlaying: (b: boolean) => void;
  showWeekNumber: boolean;
  events: Array<{ date: string; lab: string }>;
};

const convertDate = (d: string): Date => {
  const [year, month, day] = d.split('-')
  return new Date(+year, month - 1, +day);
};
const nextDate = (initial: Date, n: number) => {
  return new Date(initial.getTime() + 24 * 60 * 60 * 1000 * n);
};

const SliderWithEvents = ({
  week,
  setWeek,
  setPlaying,
  events,
  showWeekNumber,
}: Props) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dates = useContext(DatesContext).map((d) => convertDate(d));

  // 2020 was a leap year...
  const labels = [...Array(365).keys()]
    .map((i) => {
      return { d: nextDate(dates[0], i), i };
    })
    .filter(({ d }) => {
      return d.getDate() === 1;
    });

  const d3Container = useRef(null);

  const x = d3
    .scaleTime()
    .domain([dates[0], dates[dates.length - 1]])
    .range([0, 600])
    .clamp(true);

  const update = (val: Date | number) => {
    let i: number;

    if (val instanceof Date) {
      i = [...Array(dates.length).keys()].find((i) => {
        return (
          dates[i] > val ||
          i === dates.length - 1 ||
          (dates[i] >= val && i === 0)
        );
      });
      setWeek(i);
    } else {
      i = val;
    }

    const newDate = dates[i];
    const endDate =
      i + 1 < dates.length
        ? nextDate(dates[i + 1], -1)
        : convertDate("2020-12-27");

    d3.select(d3Container.current).select("#handle").attr("cx", x(newDate));
    d3.select(d3Container.current)
      .select("#label")
      .attr("x", x(newDate))
      .text(
        `${newDate.getMonth() + 1}/${newDate.getDate()} - ${
          endDate.getMonth() + 1
        }/${endDate.getDate()}`
      );
  };

  useEffect(() => {
    const svg = d3
      .select(d3Container.current)
      .append("svg")
      .attr("width", 760)
      .attr("height", 150);

    const slider = svg
      .append("g")
      .attr("transform", "translate(80, 100)")
      .attr("id", "slider");

    slider
      .insert("g")
      .selectAll("text")
      .data(labels)
      .enter()
      .append("text")
      .attr("x", ({ d }) => x(d))
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .text(({ d }) => months[d.getMonth()]);

    slider.append("g").attr("id", "eventTitles");
    slider.append("g").attr("id", "eventConnectors");

    slider
      .append("text")
      .attr("x", x(x.invert(600)))
      .attr("y", 30)
      .text("2020");

    slider
      .append("text")
      .attr("id", "weekLabel")
      .attr("x", -75)
      .attr("y", 0)
      .text("Week");

    slider
      .append("text")
      .attr("x", -55)
      .attr("y", 15)
      .attr("id", "weekCounter")
      .text("0/52")
      .attr("text-anchor", "middle");

    const handle = slider.insert("circle").attr("id", "handle").attr("r", 9);

    const label = slider
      .append("text")
      .attr("id", "label")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(0,-20)");

    const labelBackground = slider.append("rect").attr("id", "labelBackground");

    slider
      .append("line")
      .attr("stroke", "black")
      .attr("stroke-width", "10px")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-linecap", "round")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
      .select(function () {
        return this.parentNode.appendChild(this.cloneNode(true));
      })
      .attr("stroke-width", "100px") // want this to overlap the text
      .attr("stroke", "transparent")
      .call(
        d3
          .drag()
          .on("start.interrupt", () => slider.interrupt())
          .on("start drag", (event) => {
            setPlaying(false);
            update(x.invert(event.x));
          })
      );
  }, []);

  useEffect(() => {
    d3.select(d3Container.current)
      .select("#eventTitles")
      .selectAll("text")
      .remove();

    d3.select(d3Container.current)
      .select("#eventConnectors")
      .selectAll("line")
      .remove();

    events.forEach(({ date, lab }) => {
      d3.select(d3Container.current)
        .select("#eventTitles")
        .append("text")
        .attr("fill-opacity", convertDate(date) < dates[week] ? 1 : 0.2)
        .attr("x", x(convertDate(date)))
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text(lab);

      d3.select(d3Container.current)
        .select("#eventConnectors")
        .append("line")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr(
          "stroke-opacity",
          convertDate(date) < dates[week]
            ? nextDate(convertDate(date), 21) < dates[week]
              ? 1
              : 0.3
            : 0.2
        )
        .attr("x1", x(convertDate(date)))
        .attr("x2", x(convertDate(date)))
        .attr("y1", -15)
        .attr("y2", -40);
    });
  }, [week]);

  useEffect(() => {
    update(week);
    d3.select(d3Container.current)
      .select("#weekCounter")
      .text(`${week + 1}/52`);
  }, [week]);

  useEffect(() => {
    d3.select(d3Container.current)
      .select("#weekCounter")
      .style("fill-opacity", showWeekNumber ? 1 : 0);
    d3.select(d3Container.current)
      .select("#weekLabel")
      .style("fill-opacity", showWeekNumber ? 1 : 0);
  }, [showWeekNumber]);
  return <Slider ref={d3Container} />;
};

export default SliderWithEvents;
