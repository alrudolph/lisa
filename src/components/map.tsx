import React, { useRef, useEffect } from "react";
import styled from "styled-components";

import * as d3 from "d3";
import * as topojson from "topojson";
import MapZoom from "../utility/mapZoom";
import Sparse from "../utility/sparse"

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
  background-color: white;
  border: 1px solid black;

  .state .active {
    display: none;
  }

  #c${({ county }) => county}.cboundary {
    stroke: black;
    stroke-width: 0.25px;
  }

  .cboundary {
    stroke-width: 0px;
    fill: white;
  }

  .state {
    stroke: black;
    stroke-width: 0.5px;
    fill: #FFFFFF00;
  }

  .nation {
    fill: white;
    stroke: black;
    stroke-width: 0.75px;
  }

  .bubble {
    fill: blue;
    fill-opacity: 0.5;  
    stroke: blue;
    stroke-opacity: 0.5;
    stroke-width: 1px;
  }
`;

type MapSettings = {
  width: number;
  height: number;
  translate: [number, number];
  scale: number;
};

type Data = Array<Sparse>;

interface Props {
  title: string;
  MapSettings: MapSettings;
  countiesMap: any;
  highlightedCounty: string;
  addState: (m: MapZoom) => void;
  stateSelector: (s: string, b?: boolean) => void;
  countySelector: ([s, s1]: Array<string>) => void;
  data: Data;
}

const Map = ({
  title,
  MapSettings,
  countiesMap,
  highlightedCounty,
  addState,
  stateSelector,
  countySelector,
  data
}: Props) => {
  const { width, height, translate, scale } = MapSettings;

  const d3Container = useRef(null);

  const projection = d3.geoAlbers().scale(scale).translate(translate);
  const map_path = d3.geoPath().projection(projection);

  useEffect(() => {
    const svg = d3.select(d3Container.current);

    const map_g = svg.attr("width", width).attr("height", height).append("g");

    addState(new MapZoom(map_path, map_g, width, height));

    // USA Outline:
    map_g
      .append("g")
      .selectAll("path")
      .data(
        topojson.feature(countiesMap, countiesMap.objects.nation).features
      )
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("class", "nation")
      
    // Counties:
    const paths = map_g
      .append("g")
      .selectAll("path")
      .data(
        topojson.feature(countiesMap, countiesMap.objects.counties).features
      )
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("id", ({ id }) => `c${id}`)
      .attr("countyName", ({ properties: { name }}) => name)
      .attr("class", "cboundary")
      .on("mouseover", function (event, { id, properties: { name } }) {
        countySelector([id, name]);
      })
      .on("mouseout", () => {
        countySelector(["", ""]);
      })
      .on("click", () => {
        // Unselect State
        stateSelector("", false)
      })

    // States:
    map_g
      .append("g")
       .attr("class", "state")
      .selectAll("path")
      .data(topojson.feature(countiesMap, countiesMap.objects.states).features)
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("stateName", ({ properties: { name }}) => name)
      .on("click", function () {
        // Select State
        stateSelector(this.getAttribute("stateName"));
      })

      console.log(data)

    // make the circles highlightable ahhhhhhhhhh
    map_g
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("r", d => Math.abs(d.count("hot") - d.count("cold")) / d.n * 1.5)
      .attr("transform", ({ fips }) => {
        let output: string;
        // this is much faster than for loop with break ??
        paths.data().forEach(p => {
          if (Number(p.id) === Number(fips)) {
            const t = map_path.centroid(p);
            output = `translate(${t})`;
//            ughhhhhhhhhhhh
//            break;
          }
        })
        return output
      })

//       .attr("transform", function ({ fips, Value})  {
//         let output: string;

//         // this is much faster than for loop with break ??
//         paths.data().forEach(p => {
//           if (Number(p.id) === fips) {
//             const t = map_path.centroid(p);
//             output = `translate(${t})`;
// //            ughhhhhhhhhhhh
// //            break;
//           }
//         })
//         return output
//       })

  }, []);

  return (
    <Container>
      <Title>{title}</Title>
      <MapContainer ref={d3Container} county={highlightedCounty}/>
    </Container>
  );
};

export default Map;
