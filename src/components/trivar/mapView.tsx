import React, { useRef, useEffect, useState, useContext } from "react";
import styled from "styled-components";

import * as d3 from "d3";

//import us from "us-atlas/nation-10m.json"
import counties from "us-atlas/counties-10m.json";
import states from "us-atlas/states-10m.json";
//import data from "../data/counties.json";

import MapZoom from "../../utility/mapZoom";
import Sparse from "../../utility/sparse";
import Card from "./cards";
import Map from "./map";
import { LisaContext } from "../../contexts/lisaContext";

import { Maps } from "../../contexts/mapsContext";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const Divider = styled.hr`
  width: 98%;
  height: 1px;
  background-color: black;
  border-radius: 1px;
  margin: 5px 10px;
`;

const TextContainer = styled.div`
  width: 98%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const MapControls = styled.div`
  display: flex;
  flex-wrap: wrap;
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

const Row = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  flex-wrap: wrap;
`;

const Text = styled.p`
  margin: 0;
  width: 100%;
`;

const Title = styled.h3`
  margin: 0;
  white-space: nowrap;
`;

const LegendContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  @media (max-width: 770px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const Legend = styled.div`
  margin: 10px 0;
  width: 380px;
  display: flex;
  justify-content: center;
  align-itms: center;
`;

const Cards = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

type MapSettings = {
  width: number;
  height: number;
  translate: [number, number];
  scale: number;
};

type Data = Array<Sparse>;

type Props = {
  MapSettings: MapSettings;
  selectedCounty: [number, string];
  setSelectedCounty: ([s1, s2]: [number, string]) => void;
  selectedState: [number, string];
  setSelectedState: ([s1, s2]: [number, string]) => void;
  time: [number, number];
  setTime: ([n1, n2]: [number, number]) => void;
};

const getStateFips = (fips: number): number => {
  return Number(String(fips).slice(0, -3));
};

export default function MapView({
  MapSettings,
  selectedCounty,
  setSelectedCounty,
  selectedState,
  setSelectedState,
  time,
  setTime,
}: Props) {
  const { mapData, mapTitles } = useContext(LisaContext);

  const [mapZoom, setMapZoom] = useState(Array<MapZoom>(mapTitles.length));

  const addState = (m: MapZoom, mapNum: number) => {
    mapZoom[mapNum] = m;
    setMapZoom(mapZoom);
  };

  const [zoomScale, setZoomScale] = useState(1);

  const stateSelector = (
    [id, name]: [number, string],
    reset: boolean = false
  ) => {
    let zooming: boolean;

    mapZoom.forEach((m) => {
      if (!reset && id !== m.currId && id !== -1) {
        setZoomScale(m.select(id));
        zooming = true;
      } else {
        m.reset();
        setZoomScale(1);
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

  const countySelector = ([id, name]: [number, string]) => {
    if (id === -1 || getStateFips(id) === selectedState[0]) {
      setSelectedCounty([id, name]);
    }
  };

  const coldScale = d3
    .scaleSequentialPow(d3.interpolateBlues)
    .domain([...time]);
  const hotScale = d3.scaleSequentialPow(d3.interpolateReds).domain([...time]);

  const getRadius = (d: Sparse | number) => {
    const val = d instanceof Sparse ? d.count(...time) : [d];
    const n = d instanceof Sparse ? d.n : time[1];
    return (30 + Math.max(...val)) / n;
  };

  const countContainer = useRef(null);

  const maxHeight = 100;
  const maxWidth = 370;
  const margin = [20, 20];

  useEffect(() => {
    const width = Math.min(maxWidth, 100 + zoomScale * 10) - 2 * margin[0];
    const height = Math.min(maxHeight, 40 + zoomScale * 2);

    const pointData = [
      { x: 1, r: 1 },
      { x: 2, r: 5 },
      { x: 3, r: 10 },
      { x: 4, r: 20 },
      { x: 5, r: 52 },
    ];

    d3.select(countContainer.current).selectAll("*").remove();

    const map_g = d3
      .select(countContainer.current)
      .style("width", width + (7 / 2) * margin[0])
      .style("height", height + 2 * margin[1])
      .append("g")
      .attr("transform", `translate(${margin[0]},0)`);

    const xAxis = d3
      .scaleLinear()
      .domain([1, pointData[pointData.length - 1].x])
      .range([0, width]);
    const yAxis = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    map_g
      .append("g")
      .attr(
        "transform",
        `translate(0,${(margin[1] * 3) / 2 + (zoomScale * 5) / 2})`
      )
      .call(
        d3
          .axisBottom(xAxis)
          .ticks(5)
          .tickFormat((i) => String(pointData[i - 1].r))
      );

    map_g
      .append("g")
      .attr("transform", `translate(${margin[0]},0)`)
      .call(d3.axisLeft(yAxis))
      .style("display", "none");

    map_g
      .selectAll("dot")
      .remove()
      .data(pointData)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", ({ x }) => xAxis(x))
      .attr("cy", () => yAxis(0.5))
      .attr("r", ({ r }) => getRadius(r) * zoomScale)
      .style("fill", "black");

    map_g
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + margin[0])
      .attr("y", height + (margin[1] * 3) / 2 + zoomScale / 4)
      .text("Count");
  }, [time, zoomScale]);

  const recentContainer = useRef(null);

  useEffect(() => {
    d3.select(recentContainer.current).selectAll("*").remove();

    const leftMargin = 30;

    const map_g = d3
      .select(recentContainer.current)
      .style("width", maxWidth)
      .style("height", maxHeight)
      // .style("background-color", "lightgray")
      .append("g")
      .attr("transform", `translate(${leftMargin + margin[0]},0)`);

    const weekValues = [1, 5, 10, 15, 20, 25, 30, 40, 46, 52];

    const pointData = [...Array(weekValues.length * 2).keys()].map((i) => {
      return {
        x: (i % weekValues.length) + 1,
        w: weekValues[i % weekValues.length],
        c: i < weekValues.length ? 1 : 2,
      };
    });

    const xAxis = d3
      .scaleLinear()
      .domain([1, weekValues.length])
      .range([0, maxWidth - 2 * margin[0] - leftMargin]);
    const yAxis = d3
      .scaleLinear()
      .domain([0, 3])
      .range([maxHeight - 2 * margin[1], 0]);

    map_g
      .append("g")
      .attr("transform", `translate(0,${margin[1] + (maxHeight * 5) / 12})`)
      .call(
        d3
          .axisBottom(xAxis)
          .ticks(5)
          .tickFormat((i) => String(pointData[i - 1].w))
      );

    map_g
      .append("g")
      .attr("transform", `translate(${margin[0]},0)`)
      .call(d3.axisLeft(yAxis))
      .style("display", "none");

    map_g
      .selectAll("dot")
      .remove()
      .data(pointData)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", ({ x }) => xAxis(x))
      .attr("cy", ({ c }) => yAxis(c))
      .attr("r", () => 9)
      .style("fill", ({ c, w }) => (c === 1 ? hotScale(w) : coldScale(w)));

    map_g
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", maxWidth / 2 + leftMargin)
      .attr("y", (maxHeight * 19) / 20)
      .text("Week Number");

    map_g
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", -leftMargin / 2)
      .attr("y", maxHeight / 2 - 5)
      .text("Hot");

    map_g
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", -leftMargin / 2)
      .attr("y", maxHeight / 4)
      .text("Cold");
  }, [time, zoomScale]);

  // useEffect(() => {
  //   d3
  //     .select(d3Container.current)
  //     .selectAll(".point")
  //     .attr("r", ({ r }) => getRadius(r) * zoomScale)
  // }, [time, zoomScale])

  return (
    <Container>
      <TextContainer>
        {selectedState[0] !== -1 ? (
          <MapControls>
            <Title>Selected State: {selectedState[1]}</Title>
            <Text>Highlight over a county to read its specific values.</Text>
          </MapControls>
        ) : (
          <Text>
            Click a state on the map to zoom in and see county specific
            information.
          </Text>
        )}
        {selectedState[0] !== -1 ? (
          <Button
            onClick={() => {
              stateSelector([-1, ""], true);
            }}
          >
            Reset
          </Button>
        ) : null}
      </TextContainer>
      <Divider />
      <Maps>
        <MapContainer>
          {mapTitles.map((title, i) => {
            return (
              <Map
                key={i}
                MapSettings={MapSettings}
                title={title}
                countiesMap={counties}
                highlightedCounty={selectedCounty}
                highlightedState={selectedState}
                addState={(m: MapZoom) => addState(m, i)}
                stateSelector={stateSelector}
                countySelector={countySelector}
                time={time}
                data={mapData ? mapData[i] : null}
                colorScales={[hotScale, coldScale]}
                getRadius={getRadius}
              />
            );
          })}
        </MapContainer>
      </Maps>
      <Row>
        {selectedCounty[1] ? (
          <Title>Selected County: {selectedCounty[1]} County</Title>
        ) : null}
      </Row>
      <Cards>
        {selectedCounty[0] !== -1
          ? [0, 2, 1, 3].map((i) => {
              const county = mapData
                ? mapData[i].filter(
                    (d) => Number(d.fips) === Number(selectedCounty[0])
                  )[0]
                : false;

              const [hcount, ccount] = county ? county.count(...time) : [0, 0];
              const [hrecent, crecent] = county
                ? county.recent(...time)
                : [0, 0];

              return (
                <Card
                  key={i}
                  title={mapTitles[i]}
                  hcount={hcount}
                  ccount={ccount}
                  hrecent={hrecent}
                  crecent={crecent}
                />
              );
            })
          : null}
      </Cards>
      <LegendContainer>
        <Legend>
          <svg ref={recentContainer} />
        </Legend>
        <Legend>
          <svg ref={countContainer} />
        </Legend>
      </LegendContainer>
    </Container>
  );
}
