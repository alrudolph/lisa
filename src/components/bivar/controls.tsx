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
  width: 100%;
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

const TextArea = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin: 5px 0;
`;

const Text = styled.p`
  margin: 5px 0;
`;

export default function Controls({
  week,
  setWeek,
  playing,
  setPlaying,
}: Props) {
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

  const newDate = dates[week];
  const endDate =
  week + 1 < dates.length
      ? nextDate(dates[week + 1], -1)
      : convertDate("2020-12-27");
  return (
    <Container>
      <TextArea>
        <Text>Week {week + 1}/52</Text>
        <Text>
          {months[newDate.getMonth()]} {newDate.getDate()} - {months[endDate.getMonth()]} {endDate.getDate()}
        </Text>
      </TextArea>
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
}
