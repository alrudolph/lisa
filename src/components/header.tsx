import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Nav = styled.div`
  width: 70%;
  display: flex;
`;

const LinkText = styled(Link)`
    margin: 10px;
    margin-left: 0;
    font-size: 14pt;
`

export default function Header() {
  return (
    <Container>
      <Nav>
        <LinkText to="/">Home</LinkText>
        <LinkText to="/bivar">Bivar</LinkText>
        <LinkText to="/trivar">Trivariate</LinkText>
        <LinkText to="/trivar1">Trivariate1</LinkText>
        <LinkText to="/scatter">Scatter</LinkText>
      </Nav>
    </Container>
  );
}
