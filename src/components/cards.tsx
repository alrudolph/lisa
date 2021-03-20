import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  width: 20%;
  margin: 5px;
`;

const Title = styled.h3`
  margin: 0;
`;

const Text = styled.p`
  margin: 0;
`;

type Props = {
  title: string;
  count: string;
  recent: string;
};

export default function Card({ title, count, recent }: Props) {
  return (
    <Container>
      <Title>{title}</Title>
    </Container>
  );
}
