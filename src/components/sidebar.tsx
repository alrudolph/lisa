import React from "react";
import styled from "styled-components";

const Container = styled.div`
    position: fixed;
    height: 100%;
    z-index: 1000;
    width: 300px;
`;

const Section = styled.div`
    margin: 5px;
    padding: 300px 10px;
    color: gray;
`;

const SectionHeader = styled.h4`
    margin: 0;
`;

const SectionItem = styled.p`
    margin: 0;
`;

export default function Sidebar() {
  return (
    <Container>
      <Section>
        <SectionHeader>Recency & Consistency</SectionHeader>
        <SectionItem>County scatter paths</SectionItem>
        <SectionItem>Graduated centroid map</SectionItem>
      </Section>
    </Container>
  );
}
