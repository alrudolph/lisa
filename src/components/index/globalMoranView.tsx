import React, { useContext } from "react";
import styled from "styled-components";

import GlobalMoran from "./globalMoran";
import { GlobalContext } from "../../contexts/globalContext";
import { LisaContext } from "../../contexts/lisaContext";

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-around;
    @media (max-width: 900px) {
      justify-content: center;
    }
`;

export default function GlobalMoranView() {
  const globalData = useContext(GlobalContext);
  const { mapTitles } = useContext(LisaContext);

  const colTitles = ["cm", "cs", "sm", "ss"];

  return (
    <Container>
      {colTitles.map((col, i) => {
        return (
          <GlobalMoran
            key={i}
            title={mapTitles[i]}
            data={globalData.map((item, i) => [i, item[col]])}
          />
        );
      })}
    </Container>
  );
}
