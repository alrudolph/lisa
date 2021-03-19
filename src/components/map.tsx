import React, { useRef, useEffect } from "react";
import styled from "styled-components"

import * as d3 from "d3";
import * as topojson from "topojson"
import MapZoom from "../utility/mapZoom"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h3`
  margin: 0;
`

const MapContainer = styled.svg`
  background-color: white;
`

type MapSettings = {
  width: number,
  height: number,
  translate: [number, number],
  scale: number
}

interface Props  {
  title: string,
  MapSettings: MapSettings,
  map: any,
  addState: (m: MapZoom) => void,
  stateSelector: (s: string) => void
}

const Map = ({ title, MapSettings, map, addState, stateSelector }: Props) => {
  const { width, height, translate, scale } = MapSettings

  const d3Container = useRef(null);

  const data = topojson.feature(map, map.objects.states)

  useEffect(() => {
    const svg = d3.select(d3Container.current);

    const mapSvg = svg
        .attr("width", width)
        .attr("height", height);

    const map_g = mapSvg.append("g");

    //const projection = d3.geoAlbersUsa().scale(500).translate([190, 120]);
    const projection = d3.geoAlbers().scale(scale).translate(translate);
    const map_path = d3.geoPath().projection(projection);

    addState(new MapZoom(map_path, map_g, width, height))

    map_g
        .append("g")  
        .attr("class", "boundary")
        .selectAll("boundary")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", (map_path as any))
        .attr("id", x => x.id)
        .style("fill", "white")
        .style("stroke-width", "0.5px")
        .style("stroke", "black")
        .on("click", function(clicked, d) {
          stateSelector(this.getAttribute("id"))
        })


  }, [d3Container.current])

  return (
    <Container>
      <Title>{title}</Title>
      <MapContainer ref={d3Container} />
    </Container>
  );
};

export default Map;
