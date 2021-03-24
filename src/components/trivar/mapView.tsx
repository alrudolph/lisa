import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

import * as d3 from "d3";

//import us from "us-atlas/nation-10m.json"
import counties from "us-atlas/counties-10m.json";
import states from "us-atlas/states-10m.json";
//import data from "../data/counties.json";

import MapZoom from "../../utility/mapZoom";
import Sparse from "../../utility/sparse";
import Map from "./map";

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
  mapTitles: Array<string>;
  selectedCounty: [number, string];
  setSelectedCounty: ([s1, s2]: [number, string]) => void;
  selectedState: [number, string];
  setSelectedState: ([s1, s2]: [number, string]) => void;
  MapData: [Data, Data, Data, Data];
  time: [number, number];
  setTime: ([n1, n2]: [number, number]) => void;
};

const getStateFips = (fips: number): number => {
  return Number(String(fips).slice(0, -3));
};

export default function MapView({
  MapSettings,
  mapTitles,
  selectedCounty,
  setSelectedCounty,
  selectedState,
  setSelectedState,
  MapData,
  time,
  setTime,
}: Props) {
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
  const maxWidth = 380;
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

    const xAxis = d3.scaleLinear().domain([1, 5]).range([0, width]);

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

    const width = Math.min(maxWidth, 100 + zoomScale * 10) - 2 * margin[0];
    const height = Math.min(maxHeight, 40 + zoomScale * 2);

    const map_g = d3
      .select(recentContainer.current)
      .style("width", width + (7 / 2) * margin[0])
      .style("height", height + 2 * margin[1])
      .append("g")
      .attr("transform", `translate(${margin[0]},0)`);
  }, [time, zoomScale])

  // useEffect(() => {
  //   d3
  //     .select(d3Container.current)
  //     .selectAll(".point")
  //     .attr("r", ({ r }) => getRadius(r) * zoomScale)
  // }, [time, zoomScale])

  return (
    <Container>
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
              data={MapData ? MapData[i] : null}
              colorScales={[hotScale, coldScale]}
              getRadius={getRadius}
            />
          );
        })}
      </MapContainer>
      <LegendContainer>
        <Legend>
          <svg ref={recentContainer} />
        </Legend>
        <Legend>
          <svg ref={countContainer} />
        </Legend>
      </LegendContainer>
      <Row>
        <Button
          onClick={() => {
            stateSelector([-1, ""], true);
            //  setTime([0, 52])
          }}
        >
          Reset
        </Button>
        <Text>{selectedState[1]}</Text>
        <Text>{selectedCounty[1] ? selectedCounty[1] + " County" : ""}</Text>
      </Row>
    </Container>
  );
}
