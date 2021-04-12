import React from "react";
import styled from "styled-components";
import Header from "./header";

import GlobalStyle from "../styles/globalStyles"

import { LisaData } from "../contexts/lisaContext";
import { DatesData } from "../contexts/datesContext";

const Centered = styled.div`
  width: 930px;
  @media (max-width: 930px) {
    width: 100%;
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default function Page({ children, selectedPage }) {
  return (
    <Container>
      <GlobalStyle />
      <Header selectedPage={selectedPage}/>
      <Centered>
        <LisaData>
          <DatesData>{children}</DatesData>
        </LisaData>
      </Centered>
    </Container>
  );
}
