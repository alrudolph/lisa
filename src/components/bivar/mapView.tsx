import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";

import * as d3 from "d3";

import counties from "us-atlas/counties-10m.json";

import { LisaContext } from "../../contexts/lisaContext";
import Sparse from "../../utility/sparse";
import Map from "./map";
import TimeLine from "./timeline";

type Data = Array<Sparse>;

type MapSettings = {
  width: number;
  height: number;
  translate: [number, number];
  scale: number;
};

type Props = {
  selectedCounty: [number, string];
  setSelectedCounty: ([s1, s2]: [number, string]) => void;
  MapSettings: MapSettings;
  time: [number, number];
  setTime: ([n1, n2]: [number, number]) => void;
  week: number;
  setWeek: (n: number) => void;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.p`
  margin: 0;
  width: 100px;
  white-space: nowrap;
`;
const MapContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  width: 100%;
  flex-wrap: wrap;

  @media (max-width: 770px) {
    flex-wrap: wrap;
  }
`;
export default function MapView({
  selectedCounty,
  setSelectedCounty,
  MapSettings,
  time,
  setTime,
  week,
  setWeek,
}: Props) {
  const [past, setPast] = useState(false);

  const { mapData, mapTitles } = useContext(LisaContext);

  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const timer = setInterval(() => {
      if (week < 51) {
        setWeek(week + 1);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [playing, week]);

  return (
    <Container>
      <MapContainer>
        {mapTitles.map((title, i) => {
          return (
            <Map
              key={i}
              title={title}
              countiesMap={counties}
              highlightedCounty={selectedCounty}
              countySelector={setSelectedCounty}
              time={time}
              data={mapData ? mapData[i] : null}
              weekNum={week}
              MapSettings={MapSettings}
              past={past}
            />
          );
        })}
      </MapContainer>
      <TimeLine
        week={week}
        setWeek={setWeek}
        playing={playing}
        setPlaying={setPlaying}
      />
      <div>
        <form>
          <input
            type="checkbox"
            id="1"
            name="here"
            value="sad"
            onChange={() => setPast(!past)}
          ></input>
          <label htmlFor="1">Show Past Values</label>
        </form>
      </div>
    </Container>
  );
}
