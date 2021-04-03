import React, { useContext } from "react";
import styled from "styled-components";
import { LisaContext } from "../../contexts/lisaContext";

import { graphql, StaticQuery } from "gatsby";
import counties from "us-atlas/counties-10m.json";
import { rgb } from "d3-color";

const MainTable = styled.table`
  border-collapse: collapse;
  width: 760px;
`;

const THead = styled.thead``;

const THGroup = styled.th`
  text-align: center;
  ${({ underLine }: { underLine: boolean }) => {
    return underLine
      ? "border-bottom: 1px solid black; border-left: 20px solid white; border-right: 20px solid white;"
      : null;
  }}
`;

const TH = styled.th`
  text-align: center;
  border-bottom: 1px solid black;
`;

const TData = styled.td`
  background-color: ${({ highlight }: { highlight: string }) => {
    if (highlight === "hot") {
      return "#5768acAA";
    } else if (highlight === "cold") {
      return "#fa5a50AA";
    }
    return "#FFFFFF00";
  }};
  padding: 0;
  margin: 0;
`;

const TRow = styled.tr``;

const TBody = styled.tbody`
  ${TRow} > *:nth-child(2n+1) {
    width: 10px;
    padding: 2px;
  }

  ${TRow} > * {
    text-align: right;
  }

  & > ${TRow}:hover {
    background-color: #d3d3d3;
  }

  ${TRow} > *:nth-child(2n) {
    width: 100px;
  }

  ${TRow} > *:nth-child(1) {
    width: 130px;
    text-align: left;
    border-right: 1px solid black;
  }

  ${TRow} > *:nth-child(3) {
    // secondary line
    // border-right: 1px solid lightgray;
  }

  ${TRow} > *:nth-child(7) {
    // secondary line
    // border-right: 1px solid lightgray;
  }

  ${TRow} > *:nth-child(5) {
    border-right: 1px solid black;
  }

  ${TRow} {
    border-bottom: 1px solid rgb(205, 205, 205);
  }

  ${TRow}:last-child {
    border-bottom: 1px solid black;
  }
`;

const ColdLegend = styled.p`
//  background-color: rgba(0, 0, 255, 0.4);
  background-color: #fa5a50AA;
`;

const HotLegend = styled.p`
//  background-color: rgba(255, 0, 0, 0.4);
  background-color: #5768acAA;
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Legend = styled.div`
  display: flex;
  & > * {
    margin: 5px;
    padding: 5px;
  }
`;

type Props = {
  selectedState: [number, string];
  week: number;
};

const getStateFips = (fips: number): number => {
  return Number(String(fips).slice(0, -3));
};

export default function Table({ selectedState, week }: Props) {
  const { mapData, mapTitles } = useContext(LisaContext);

  return (
    <div>
      <MainTable>
        <THead>
          <TRow>
            <THGroup underLine={false}>Counties of</THGroup>
            <THGroup colSpan={4} underLine={true}>
              Mobility
            </THGroup>
            <THGroup colSpan={4} underLine={true}>
              Sheltered
            </THGroup>
          </TRow>
          <TRow>
            <TH>{selectedState[1]}</TH>
            <TH colSpan={2}>Cuebiq*</TH>
            <TH colSpan={2}>SafeGraph</TH>
            <TH colSpan={2}>Cuebiq</TH>
            <TH colSpan={2}>SafeGraph</TH>
          </TRow>
        </THead>
        <TBody>
          <StaticQuery
            query={graphql`
              {
                allRawCsv {
                  nodes {
                    cm
                    cs
                    fips
                    sm
                    ss
                    week
                  }
                }
              }
            `}
            render={({ allRawCsv: { nodes } }) => {
              return nodes
                .filter(
                  (node) =>
                    Number(node.week) - 1 === week &&
                    getStateFips(node.fips) === selectedState[0]
                )
                .map(({ fips, cm, cs, sm, ss }, i) => {
                  const cmVec = mapData[0].find((d) => d.fips === Number(fips));
                  const cmVal = cmVec !== undefined ? cmVec.get(week) : 0;

                  const csVec = mapData[1].find((d) => d.fips === Number(fips));
                  const csVal = csVec !== undefined ? csVec.get(week) : 0;

                  const smVec = mapData[2].find((d) => d.fips === Number(fips));
                  const smVal = smVec !== undefined ? smVec.get(week) : 0;

                  const ssVec = mapData[3].find((d) => d.fips === Number(fips));
                  const ssVal = ssVec !== undefined ? ssVec.get(week) : 0;

                  return (
                    <TRow key={fips}>
                      <TData highlight="none">
                        {
                          counties.objects.counties.geometries.find(
                            ({ id }) => Number(id) === Number(fips)
                          ).properties.name
                        }
                      </TData>
                      <TData
                        highlight={
                          cmVal === 1 ? "hot" : cmVal === 2 ? "cold" : "none"
                        }
                      >
                        {cm}
                      </TData>
                      <TData
                        highlight={
                          cmVal === 1 ? "hot" : cmVal === 2 ? "cold" : "none"
                        }
                      ></TData>
                      <TData
                        highlight={
                          smVal === 1 ? "hot" : smVal === 2 ? "cold" : "none"
                        }
                      >
                        {Number(sm) / 1000}
                      </TData>

                      <TData
                        highlight={
                          smVal === 1 ? "hot" : smVal === 2 ? "cold" : "none"
                        }
                      >
                        {i === 0 ? "km" : ""}
                      </TData>
                      <TData
                        highlight={
                          csVal === 1 ? "hot" : csVal === 2 ? "cold" : "none"
                        }
                      >
                        {cs}
                      </TData>

                      <TData
                        highlight={
                          csVal === 1 ? "hot" : csVal === 2 ? "cold" : "none"
                        }
                      >
                        {i === 0 ? "%" : ""}
                      </TData>
                      <TData
                        highlight={
                          ssVal === 1 ? "hot" : ssVal === 2 ? "cold" : "none"
                        }
                      >
                        {ss}
                      </TData>

                      <TData
                        highlight={
                          ssVal === 1 ? "hot" : ssVal === 2 ? "cold" : "none"
                        }
                      >
                        {i === 0 ? "%" : ""}
                      </TData>
                    </TRow>
                  );
                });
            }}
          />
        </TBody>
      </MainTable>
      <LegendContainer>
        <p>* have own custom metric</p>
        <Legend>
          <HotLegend>Hot Spot</HotLegend>
          <ColdLegend>Cold Spot</ColdLegend>
        </Legend>
      </LegendContainer>
    </div>
  );
}
