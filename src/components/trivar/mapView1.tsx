import React, { useRef, useEffect, useState, useContext } from "react";
import styled from "styled-components";

import * as d3 from "d3";

import counties from "us-atlas/counties-10m.json";

import MapZoom from "../../utility/mapZoom";
import Sparse from "../../utility/sparse";
import Card from "./cards";
import Map1 from "./map1";
import { LisaContext } from "../../contexts/lisaContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;

  width: 100%;
  flex-wrap: wrap;
`;

const Text = styled.p`
  margin: 0;
  width: 100px;
  white-space: nowrap;
`;

const Button = styled.button`
  width: 50px;
`;

const LegendContainer = styled.div`
  width: 800px;
  display: flex;
  height: auto;
`;

const Legend = styled.div`
  margin: 10px;
  width: 390px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Cards = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 70%;
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

export default function MapView1({
  MapSettings,
  selectedCounty,
  setSelectedCounty,
  selectedState,
  setSelectedState,
  time,
  setTime,
}: Props) {
  const { mapData, mapTitles } = useContext(LisaContext)

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
    .scaleSequential(d3.interpolateBlues)
    .domain([-0.5, 1]);
  const hotScale = d3.scaleSequential(d3.interpolateReds).domain([-0.5, 1]);

  const getRadius = (d: Sparse | number) => {
    const val = d instanceof Sparse ? d.count(...time) : [d];
    const n = d instanceof Sparse ? d.n : time[1];
    return (30 + Math.max(...val)) / n;
  };

  const countContainer = useRef(null);

  const maxHeight = 100;
  const maxWidth = 380;
  const margin = [20, 20];

  useEffect(() => {
    const width = Math.min(maxWidth, 100 + zoomScale * 10) - 4 * margin[0];
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

    const xAxis = d3.scaleLinear().domain([1, pointData[pointData.length - 1].x]).range([0, width]);
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
      .attr("x", -leftMargin)
      .attr("y", maxHeight / 2 - 5)
      .text("Hotspots");

    map_g
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", -leftMargin)
      .attr("y", maxHeight / 4)
      .text("Coldspots");
  }, [time, zoomScale]);

  // useEffect(() => {
  //   d3
  //     .select(d3Container.current)
  //     .selectAll(".point")
  //     .attr("r", ({ r }) => getRadius(r) * zoomScale)
  // }, [time, zoomScale])

  return (
    <Container>
      <Text>Selected State: {selectedState[1]}</Text>
      <MapContainer>
        {mapTitles.map((title, i) => {
          return (
            <Map1
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
      <Text>{selectedCounty[1] ? `Selected County: ${selectedCounty[1]} County` : ""}</Text>
      <Cards>
        {selectedCounty[0] !== -1
          ? [0, 1, 2, 3].map((i) => {
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
      <Row>
        <Button
          onClick={() => {
            stateSelector([-1, ""], true);
          }}
        >
          Reset
        </Button>
      </Row>
    </Container>
  );
}
