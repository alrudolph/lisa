import React, { useRef, useContext, useEffect } from "react";
import styled from "styled-components";
import { graphql, useStaticQuery } from "gatsby";

import * as d3 from "d3";

import { MapsContext } from "../../contexts/mapsContext";

const Container = styled.div``;

const Map = styled.svg`
  width: 260px;
  height: 320px;
`;

type Props = {
  showFDR: boolean;
};

const CenterMap = ({ showFDR }: Props) => {
  const {
    allUtahExampleCsv: { edges },
  } = useStaticQuery(graphql`
    query CenterMapQuery {
      allUtahExampleCsv {
        edges {
          node {
            class
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
        return Number(node.class) === 0 ? "#FFFFFF00" : "#5768ac";
      })
      .style("fill-opacity", ({ id }) => {
        const { node } = edges.find(
          ({ node: { fips } }) => Number(id) === Number(fips) // have to convert to numbers for decimal
        );
        return node.class !== "0" ? 0.5 : 0
      });
  }, []);

  useEffect(() => {
    d3.select(d3Container.current)
      .selectAll(".cboundary")
      .transition()
      .duration(1000)
      .style("fill-opacity", ({ id }) => {
        const { node } = edges.find(
          ({ node: { fips } }) => Number(id) === Number(fips) // have to convert to numbers for decimal
        );
        return showFDR
          ? [0, 0.5, 1][Number(node.class) / 2]
          : Number(node.class !== "0") * 0.5;
      });
  }, [showFDR]);

  return (
    <Container>
      <Map ref={d3Container} />
      <p>Utah FDR and Simulated cold spot</p>
    </Container>
  );
};

export default CenterMap;
