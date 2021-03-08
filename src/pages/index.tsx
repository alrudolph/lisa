import * as React from "react";
import  styled from "styled-components";

import Map from "../components/map";

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const Index = () => {
  return (
  <div>
    <Row>
      <Map />
      <Map />
    </Row>
    <Row>
      <Map />
      <Map />
    </Row>
  </div>
  );
};

export default Index;
