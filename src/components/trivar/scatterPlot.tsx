import React, { useEffect, useRef } from "react"
import styled from "styled-components"

import * as d3 from "d3"

import Sparse from "../../utility/sparse"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 10px;
`;

const Title = styled.h3`
  margin: 0;
`;

const MapContainer = styled.svg``

const getStateFips = (fips: number): number => {
    return Number(String(fips).slice(0, -3));
  };

type Props = {
    title: string;
    selectedCounty: [number, string];
    selectedState: [number, string];
    data: Array<Sparse>;
};

export default function ScatterPlot({data, title, selectedState, selectedCounty}: Props) {
    const size = 380;
    const scale = 1;
    const margin = [50, 50]

    const height = size - 2 * 50;
    const width = size - 2 * 50

    const d3Container = useRef(null);

    useEffect(() => {
        const svg = d3.select(d3Container.current);

        const map_g = svg.attr("width", size).attr("height", size).append("g").attr("transform", `translate(${margin})`);

        const x = d3.scaleLinear()
            .domain([0, 52])
            .range([0, width])

        map_g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x))

        const y = d3.scaleLinear()
            .domain([0, 52])
            .range([height, 0])

        map_g.append("g").call(d3.axisLeft(y))

        map_g
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "point")
            .attr("cx", (d) => x(Math.abs(d.recent("cold") - d.recent("hot"))))
            .attr("cy", d => {
                const hot = d.count("hot")
                if (hot) {
                    return y(hot);
                }
                else {
                    return y(d.count("cold"))
                }
            })
            .attr("r", 2)
            .style("fill", "red")

    }, [])

    useEffect(() => {
        d3.selectAll(".point")
        .style("fill-opacity", ({ fips }) => {
            return (selectedState[0] === -1) || (getStateFips(fips) === selectedState[0]) ? 1 : 0
        })
    }, [selectedState])

    return (
        
    <Container>
        <Title>{title}</Title>
        <MapContainer ref={d3Container} />
    </Container>
    )

}