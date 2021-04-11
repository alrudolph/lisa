import React from "react";
import styled from "styled-components";

import { PlayCircleFill } from "@styled-icons/bootstrap/PlayCircleFill";
import { PauseCircleFill } from "@styled-icons/bootstrap/PauseCircleFill";
import { SkipPreviousCircle } from "@styled-icons/boxicons-solid/SkipPreviousCircle";
import { SkipNextCircle } from "@styled-icons/boxicons-solid/SkipNextCircle";
import { Restart } from "@styled-icons/remix-fill/Restart";

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

type Props = {
  week: number;
  setWeek: (number) => void;
  playing: boolean;
  setPlaying: (b: boolean) => void;
};

const Controls = ({ week, setWeek, playing, setPlaying }: Props) => {
  return (
    <ButtonArea>
      {/* LEFT BUTTON */}
      <SkipPreviousCircle
        size="30px"
        onClick={() => {
          if (week > 0) {
            setWeek(week - 1);
          }
          setPlaying(false);
        }}
      />

      {/* MIDDLE BUTTON */}
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
      
      {/* RIGHT BUTTON */}
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
  );
};

export default Controls;
