import React, { useEffect, useContext, useState, useRef } from "react";
import styled from "styled-components";

import * as d3 from "d3";

import counties from "us-atlas/counties-10m.json";

import { LisaContext } from "../../contexts/lisaContext";
import { Maps } from "../../contexts/mapsContext";

import Sparse from "../../utility/sparse";
import Map2 from "./map2";
import TimeLine from "./timeline";
import TimeLineOld from "./timelineOld";
import MapZoom from "../../utility/mapZoom";

import Controls from "./controls";

type Data = Array<Sparse>;

type MapSettings = {
  width: number;
  height: number;
  translate: [number, number];
  scale: number;
};

const ControlArea = styled.div`
  display: flex;
  width: 98%;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

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
  width: number;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 98%;

  & > h1 {
    margin: 5px 5px 0 5px;
  }
`;

const Text = styled.p`
  margin: 5px;
`;

const Divider = styled.hr`
  width: 98%;
  height: 1px;
  background-color: black;
  border-radius: 1px;
  margin: 5px 10px;
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
const Button = styled.button`
  border-radius: 10px;
  height: 30px;
  width: 60px;
`;

const CheckBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 140px;
`;

const Title = styled.h3`
  margin: 0;
  white-space: nowrap;
`;
export default function MapView({
  selectedCounty,
  setSelectedCounty,
  MapSettings,
  time,
  setTime,
  week,
  setWeek,
  selectedState,
  setSelectedState,
  width,
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

  console.log("WIDTH", width);

  return (
    <Container>
      <ControlArea>
        <TextContainer>
          <Text>
            Selecting the cumulative option also includes past values. This view
            shows the the last time a county was a hot or cold spot by making
            more distant times a lighter color.
          </Text>
          {selectedState[0] === -1 ? (
            <Text>Click on a state to zoom into that state.</Text>
          ) : (
            <Title>Selected State: {selectedState[1]}</Title>
          )}
        </TextContainer>
        <ControlsContainer>
          <CheckBox>
            <form>
              <input
                type="checkbox"
                id="Cumulative"
                onChange={() => setPast(!past)}
              ></input>
              <label htmlFor="Cumulative" style={{ "white-space": "nowrap" }}>
                Cumulative Map
              </label>
            </form>
          </CheckBox>
          <Button
            onClick={() => {
              stateSelector([-1, ""]);
              setWeek(0);
              setPlaying(false);
            }}
          >
            Reset
          </Button>
        </ControlsContainer>
      </ControlArea>
      <Divider />
      <Maps>
        <MapContainer>
          {mapTitles.map((title, i) => {
            return (
              <Map2
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
              />
            );
          })}
        </MapContainer>
      </Maps>
      {width > 750 ? (
        <TimeLineOld
          width={width}
          week={week}
          setWeek={setWeek}
          playing={playing}
          setPlaying={setPlaying}
        />
      ) : (
        <Controls
          week={week}
          setWeek={setWeek}
          playing={playing}
          setPlaying={setPlaying}
        />
      )}
      <Divider />
    </Container>
  );
}
