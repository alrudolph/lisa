import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import * as d3 from "d3";

import { DatesContext } from "../../contexts/datesContext";

import { PlayCircleFill } from "@styled-icons/bootstrap/PlayCircleFill";
import { PauseCircleFill } from "@styled-icons/bootstrap/PauseCircleFill";
import { SkipPreviousCircle } from "@styled-icons/boxicons-solid/SkipPreviousCircle";
import { SkipNextCircle } from "@styled-icons/boxicons-solid/SkipNextCircle";
import { Restart } from "@styled-icons/remix-fill/Restart";

const Container = styled.div`
  width: 760px;
  height: 150px;
`;

const Slider = styled.svg`
  width: 760px;
  height: 100px;
`;

const ButtonArea = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;

  * {
    margin: 5px 10px;
  }

  & > *:hover {
    cursor: pointer;
  }
`;

const Button = styled.button`
  border-radius: 10px;
`;

type Props = {
  week: number;
  setWeek: (number) => void;
  playing: boolean;
  setPlaying: (b: boolean) => void;
  width: number;
};

const convertDate = (d: string): Date => {
  return new Date(`${d} PST`);
};

const nextDate = (initial: Date, n: number) => {
  // return new Date(
  //   initial.getFullYear(),
  //   initial.getMonth(),
  //   initial.getDate() + n
  // );

  return new Date(initial.getTime() + 24 * 60 * 60 * 1000 * n);
};

const TimeLine = ({ week, setWeek, playing, setPlaying, width }: Props) => {
  console.log(width)

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
      .attr("height", 100);

    const slider = svg
      .append("g")
      .attr("transform", "translate(80, 50)")
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

    slider.append("text").attr("x", -75).attr("y", 0).text("Week");

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
  }, [width]);

  useEffect(() => {
    update(week);
    d3.select(d3Container.current)
      .select("#weekCounter")
      .text(`${week + 1}/52`);
  }, [week, width]);

  return (
    <Container>
      <Slider ref={d3Container} />
      <ButtonArea>
        <SkipPreviousCircle
          size="30px"
          onClick={() => {
            if (week > 0) {
              setWeek(week - 1);
            }
            setPlaying(false);
          }}
        />
        {week === 51 ? (
          <Restart
            size="30px"
            onClick={() => {
              setWeek(0);
              setPlaying(false);
            }}
          />
        ) : playing ? (
          <PauseCircleFill
            size="30px"
            onClick={() => {
              setPlaying(false);
            }}
          />
        ) : (
          <PlayCircleFill
            size="30px"
            onClick={() => {
              setPlaying(true);
            }}
          />
        )}
        <SkipNextCircle
          size="30px"
          onClick={() => {
            if (week < 51) {
              setWeek(week + 1);
            }
            setPlaying(false);
          }}
        />
      </ButtonArea>
    </Container>
  );
};

export default TimeLine;
