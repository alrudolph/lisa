import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: lightgray;
  width: 170px;
  margin: 5px;
  padding: 5px;
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
`;

const Text = styled.p`
  margin: 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

type Props = {
  title: string;
  hcount: number;
  ccount: number;
  hrecent: number;
  crecent: number;
};
 
export default function Card({
  title,
  hcount,
  ccount,
  hrecent,
  crecent,
}: Props) {
  return (
    <Container>
      <Title>{title}</Title>
      <Row>
        <Text># Hot Spots:</Text> <Text>{hcount}</Text>
      </Row>
      <Row>
        <Text># Cold Spots:</Text><Text>{ccount}</Text>
      </Row>
      <Row>
        <Text>Last Hot Spot:</Text><Text>{hrecent}</Text>
      </Row>
      <Row>
        <Text>Last Cold Spot:</Text><Text>{crecent}</Text>
      </Row>
    </Container>
  );
}
