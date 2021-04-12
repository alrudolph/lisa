import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import * as d3 from "d3";

import Controls from "./controls";
import Slider from "./slider";
import SliderWithEvents from "./sliderWithEvents";
import MobileDisplay from "./mobileDisplay";

const Container = styled.div<{ width: string, height: number }>`
  width: ${({ width }: { width: string }) => width};
  height: ${({ height }: { height: number }) => height}px;
`;

type Props = {
  week: number;
  setWeek: (number) => void;
  playing: boolean;
  setPlaying: (b: boolean) => void;
  showWeekNumber: boolean;
  showEvents: boolean;
  mobileMode: boolean;
};

const TimeLine = ({
  week,
  setWeek,
  playing,
  setPlaying,
  showWeekNumber,
  showEvents,
  mobileMode,
}: Props) => {
  const nationalEvents = [
    {
      date: "2020-03-13",
      lab: "National Emergency",
    },
    {
      date: "2020-05-28",
      lab: "100k Deaths",
    },
  ];

  return (
    <Container width={mobileMode ? "100%" : "760px"} height={mobileMode ? 115 : (showEvents ? 200 : 150)}>
      {mobileMode ? (
        <MobileDisplay week={week} showWeekNumber={showWeekNumber} />
      ) : showEvents ? (
        <SliderWithEvents
          week={week}
          setWeek={setWeek}
          setPlaying={setPlaying}
          showWeekNumber={showWeekNumber}
          events={nationalEvents}
        />
      ) : (
        <Slider
          week={week}
          setWeek={setWeek}
          setPlaying={setPlaying}
          showWeekNumber={showWeekNumber}
          events={nationalEvents}
        />
      )}
      <Controls
        week={week}
        setWeek={setWeek}
        playing={playing}
        setPlaying={setPlaying}
      />
    </Container>
  );
};

export default TimeLine;
