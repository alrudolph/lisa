import * as React from "react";
import styled from "styled-components";

import MapView from "../components/mapView";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Index = () => {
  console.log("hello");

  return (
    <Container>
      <MapView />
    </Container>
  );
};

export default Index;
