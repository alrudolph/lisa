import React, { useEffect, useContext, useState, useRef } from "react";
import styled from "styled-components";

import * as d3 from "d3";

import { LisaContext } from "../../contexts/lisaContext";
import Sparse from "../../utility/sparse";
import Map1 from "./map1";
import TimeLine from "./timeline";
import MapZoom from "../../utility/mapZoom";

import * as topojson from "topojson";

import CreateMap from "./createMap";

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
  selectedState: [number, string];
  setSelectedState: ([a, b]: [number, string]) => void;
  MapCreator: any;
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
export default function MapView1({
  selectedCounty,
  setSelectedCounty,
  MapSettings,
  time,
  setTime,
  week,
  setWeek,
  selectedState,
  setSelectedState,
  MapCreator
}: Props) {
  const [past, setPast] = useState(false);

  const { mapData, mapTitles } = useContext(LisaContext);

  const [playing, setPlaying] = useState(false);

  const [mapZoom, setMapZoom] = useState(Array<MapZoom>(4));

  const addState = (m: MapZoom, i) => {
    mapZoom[i] = m;
    setMapZoom(mapZoom);
  };

  const stateSelector = (
    [id, name]: [number, string],
    reset: boolean = false
  ) => {
    let zooming: boolean;

    mapZoom.forEach((m) => {
      if (!reset && id !== m.currId && id !== -1) {
        m.select(id);
        zooming = true;
      } else {
        m.reset();
        zooming = false;
      }
    });

    if (zooming) {
      setSelectedState([id, name]);
      return true;
    } else {
      setSelectedState([-1, ""]);
      return false;
    }
  };

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

  console.log("WHAT")

  return (
    <Container>
      <div>
        <form>
          <input
            type="checkbox"
            id="Cumulative"
            onChange={() => setPast(!past)}
          ></input>
          <label htmlFor="Cumulative">Cumulative Map</label>
        </form>
      </div>
      <MapContainer id="root">
        {mapTitles.map((title, i) => {
          return (
            <Map1
              key={i}
              title={title}
              highlightedCounty={selectedCounty}
              countySelector={setSelectedCounty}
              selectedState={selectedState}
              stateSelector={stateSelector}
              addState={(m: MapZoom) => addState(m, i)}
              time={time}
              data={mapData ? mapData[i] : null}
              weekNum={week}
              MapSettings={MapSettings}
              past={past}
              d3Container={MapCreator}
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
    </Container>
  );
}
