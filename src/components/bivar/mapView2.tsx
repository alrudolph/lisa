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
import TimeLineLegend from "./timelinelegend";

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
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 762px) {
    justify-content: center;
    width: 100%;
  }
`;

const ColdLegend = styled.p`
  //  background-color: rgba(0, 0, 255, 0.4);
  background-color: #5768acaa;
`;

const HotLegend = styled.p`
  //  background-color: rgba(255, 0, 0, 0.4);
  background-color: #fa5a50aa;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  & > * {
    margin: 5px;
    padding: 5px;
  }
`;

const LegendContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 762px) {
    justify-content: center;
  }
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
  justify-content: flex-start;
  max-width: 500px;

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
  width: 180px;
`;

const Row = styled.div`
  margin: 0 3px;
`;

const Title = styled.h3`
  margin: 0 0 0 5px;
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

  const [showWeekNumber, setShowWeekNumber] = useState(false);

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
              <Row>
                <input
                  type="checkbox"
                  id="Cumulative"
                  onChange={() => setPast(!past)}
                  checked={past}
                ></input>
                <label htmlFor="Cumulative">Cumulative Map</label>
              </Row>
              <Row>
                <input
                  type="checkbox"
                  id="ShowWeek"
                  onChange={() => setShowWeekNumber(!showWeekNumber)}
                  checked={showWeekNumber}
                ></input>
                <label htmlFor="ShowWeek">Show Week Number</label>
              </Row>
            </form>
          </CheckBox>
          <Button
            onClick={() => {
              stateSelector([-1, ""]);
              setWeek(0);
              setPast(false);
              setPlaying(false);
              setShowWeekNumber(false);
            }}
          >
            Reset
          </Button>
        </ControlsContainer>
      </ControlArea>
      <Divider />
      {past ? (
        <TimeLineLegend week={week} />
      ) : (
        <LegendContainer>
          <Legend>
            <HotLegend>Hot Spot</HotLegend>
            <ColdLegend>Cold Spot</ColdLegend>
          </Legend>
        </LegendContainer>
      )}
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
              >
                {i === 3
                  ? null
                  : // <Legend>
                    //   <HotLegend>Hot Spot</HotLegend>
                    //   <ColdLegend>Cold Spot</ColdLegend>
                    // </Legend>
                    null}
              </Map2>
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
          showWeekNumber={showWeekNumber}
        />
      ) : (
        <Controls
          showWeekNumber={showWeekNumber}
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
