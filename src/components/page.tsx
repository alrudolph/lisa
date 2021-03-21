import React from "react";
import styled from "styled-components";
import Header from "./header";

const Centered = styled.div`
  width: 60%;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default function Page({ children }) {
  return (
    <Container>
      <Centered>
        <Header />
        {children}
      </Centered>
    </Container>
  );
}
