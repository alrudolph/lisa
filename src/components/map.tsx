import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import data from "../data/counties.json";

const Map = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    const map_width = 700,
        map_height = 500;

    const svg = d3.select(d3Container.current);

    const mapSvg = svg
//        .select("#plot_map")
//        .append("svg")
        .attr("width", map_width)
        .attr("height", map_height);

    const map_g = mapSvg.append("g");

    const projection = d3.geoAlbersUsa().scale(500)//.translate([1050, 300]);
    const map_path = d3.geoPath().projection(projection);

    map_g
        .append("g")
        .attr("class", "boundary")
        .selectAll("boundary")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", map_path)
        .attr("id", x => x.properties.GEOID)
        .attr("county_name", (x: any) => x.properties.NAME.replace(/\s$/g, ''))


  }, [d3Container.current])

  return <svg ref={d3Container} />;
};

export default Map;
