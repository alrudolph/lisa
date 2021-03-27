import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

import * as d3 from "d3";
import * as topojson from "topojson";

import Sparse from "../../utility/sparse";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 10px;
`;

const Title = styled.h3`
  margin: 0;
`;

const MapContainer = styled.svg`
  g {
    background-color: light-gray;
    fill: red;
  }
  border: 1px solid black;

  .cboundary {
    stroke-width: 0px;
  }
`;

type MapData = Array<Sparse>;

type MapSettings = {
    width: number;
    height: number;
    translate: [number, number];
    scale: number;
  };

interface Props {
  title: string;
  countiesMap: any;
  highlightedCounty: [number, string];
  countySelector: ([s, s1]: [number, string]) => void;
  data: MapData;
  time: [number, number];
  MapSettings: MapSettings;
  weekNum: number;
  past: boolean;
}

const Map = ({
  title,
  countiesMap,
  highlightedCounty,
  countySelector,
  data,
  time,
  MapSettings,
  weekNum,
  past
}: Props) => {

    const { scale, translate, width, height } = MapSettings

    const d3Container = useRef(null);

    const projection = d3.geoAlbers().scale(scale).translate(translate);
    const map_path = d3.geoPath().projection(projection);
  
    useEffect(() => {
        const map_g = d3
        .select(d3Container.current)
        .attr("width", width)
        .attr("height", height)
        .append("g");
  
      // States:
      map_g
        .append("g")
        .style("stroke", "black")
        .style("stroke-width", "0.5px")
        .style("fill", "#ffffffff")
        .selectAll("path")
        .data(topojson.feature(countiesMap, countiesMap.objects.states).features)
        .enter()
        .append("path")
        .attr("d", map_path as any)
        .attr("stateFips", ({ id }) => Number(id));
  
      // Counties:
      map_g
        .append("g")
        .selectAll("path")
        .data(
          topojson.feature(countiesMap, countiesMap.objects.counties).features
        )
        .enter()
        .append("path")
        .attr("d", map_path as any)
        .attr("id", ({ id }) => `c${Number(id)}`)
        //   .attr("countyName", ({ properties: { name } }) => name)
        .attr("class", "cboundary")
        .style("fill", "#00000000")
        .on("mouseout", () => {
          countySelector([-1, ""]);
        });
    }, [])
    
    useEffect(() => {
        data.forEach(d => {
            const { curr, last, weeks } = d.getLast(weekNum);

            let col, opac;

            if (curr && curr !== 0) {
                col = curr === 1 ? "#ff0000" : "#0000ff"
                opac = 1
            }
            else { 
                col = "#00000000"
                if (last === 1) {
                    col = "#ff0000"
                }
                else if (last === 2) {
                    col = "#0000ff"
                }
                 opac = past ? ((last > 0 && weeks > 0) ? Math.pow(4, -weeks) : 0) : 0
            }

            const sel = d3.select(d3Container.current).select(`#c${d.fips}`)
            sel.style("fill", col)
            sel.style("fill-opacity", opac)
        })

    }, [weekNum, past])

    return (
        <Container>
          <Title>{title}</Title>
          <MapContainer ref={d3Container} />
        </Container>
      );

};

export default Map;
