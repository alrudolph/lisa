import React from "react";
import styled from "styled-components";
import Header from "./header";

import GlobalStyle from "../styles/globalStyles";

import { LisaData } from "../contexts/lisaContext";
import { DatesData } from "../contexts/datesContext";
import { GlobalData } from "../contexts/globalContext";

import Sidebar from "./sidebar";

const Centered = styled.div`
  width: 930px;
  @media (max-width: 930px) {
    width: 100%;
  }
  margin-top: 5px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 80px;
`;

const SidebarContainer = styled.div`
  width: 100%;
`;

export default function Page({ children, selectedPage }) {
  return (
    <Container>
      <GlobalStyle />
      <Header selectedPage={selectedPage} />
      {/*<SidebarContainer>
        <Sidebar />
      </SidebarContainer>*/}
      <Centered>
        <GlobalData>
          <LisaData>
            <DatesData>{children}</DatesData>
          </LisaData>
        </GlobalData>
      </Centered>
    </Container>
  );
}
