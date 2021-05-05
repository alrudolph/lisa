import React, { useRef, useContext, useEffect } from "react";
import styled from "styled-components";
import { graphql, useStaticQuery } from "gatsby";

import * as d3 from "d3";

import { MapsContext } from "../../../contexts/mapsContext";

const Container = styled.div`
  width: 260px;
  padding: 5px;
`;

const Map = styled.svg`
  width: 260px;
  height: 320px;
`;

const ValueMap = () => {
  const {
    allUtahExampleCsv: { edges },
  } = useStaticQuery(graphql`
    query ValueMapQuery {
      allUtahExampleCsv {
        edges {
          node {
            sheltered_in_place_7days_rolling_avg
            fips
          }
        }
      }
    }
  `);

  const width = 260;
  const height = 320;
  const translate: [number, number] = [width * 2 + 210, (height * 13) / 16];
  const scale = 3000;

  const d3Container = useRef(null);

  const { counties } = useContext(MapsContext);

  const blues = d3.scaleSequentialPow(d3.interpolateBlues);

  useEffect(() => {
    const projection = d3.geoAlbers().scale(scale).translate(translate);
    const map_path = d3.geoPath().projection(projection);

    const map_g = d3
      .select(d3Container.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

    // Counties:
    map_g
      .append("g")
      .selectAll("path")
      .data(counties.filter(({ id }) => Math.floor(id / 1000) == 49))
      .enter()
      .append("path")
      .attr("d", map_path as any)
      .attr("id", ({ id }) => `c${Number(id)}`)
      //   .attr("countyName", ({ properties: { name } }) => name)
      .attr("class", "cboundary")
      // .style("stroke-width", 0)
      .style("stroke", "#D3D3D3")
      .style("fill", ({ id }) => {
        const { node } = edges.find(
          ({ node: { fips } }) => Number(id) === Number(fips)
        );
        return blues(1 - (node.sheltered_in_place_7days_rolling_avg - 28) / 20);
      })

      
    map_g
      .append("g")
      .selectAll("label")
      .data(counties.filter(({ id }) => Math.floor(id / 1000) == 49))
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .text(({ id }) => {
        const { node } = edges.find(
          ({ node: { fips } }) => Number(id) === Number(fips)
        );
        return node.sheltered_in_place_7days_rolling_avg + "%";
      })
      .style("fill", ({ id }) => {
        const { node } = edges.find(
          ({ node: { fips } }) => Number(id) === Number(fips)
        );
        return blues((node.sheltered_in_place_7days_rolling_avg - 10) / 25);
      })
      .style("font-size", 12)
      .attr("transform", ({ id }) => {
        const county_path = d3.select(`#c${id}`).datum();
        const [x, y] = map_path.centroid(county_path)
        return `translate(${x}, ${y + 3})`;
      })
  }, []);

  return (
    <Container>
      <Map ref={d3Container} />
      <p>
        Cuebiq % Sheltered for Utah 4/13-4/19. Darker shades of blue indicate a
        lower percentage of the population sheltering.
      </p>
    </Container>
  );
};

export default ValueMap;
