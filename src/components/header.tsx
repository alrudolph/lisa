import React from "react";
import { Link } from "gatsby";
import styled, { keyframes } from "styled-components";

import LogoImage from "../images/logo.png";

const Logo = styled.img`
  height: 80px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background-color: rgb(0, 54, 96);
  min-height: 115px;
`;

const NavBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 920px;

  @media (max-width: 930px) {
    width: 100%;
    justify-content: center;
  }
`;

const Nav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const HoverOver = keyframes`
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
`;

const LinkText = styled(Link)`
  font-size: 14pt;

  color: ${({ selected }: { selected: boolean }) =>
    selected ? "rgba(255, 255, 255, 0.7)" : "white"};
  user-drag: none;
  text-decoration: none;

  &:link {
    color: white;
  }

  &:visited {
    color: white;
  }
`;

const Line = styled.div`
  border-bottom: 2px solid
    ${({ selected }: { selected: boolean }) =>
      selected ? "rgba(255, 255, 255, 0.7)" : "white"};
  width: ${({ selected }: { selected: boolean }) => (selected ? "100%" : "0")};
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;

  &:hover > ${Line} {
    animation: ${HoverOver} 0.2s forwards;
    animation-timing-function: ease-in;
    color: lightgray;
  }
`;

export default function Header({ selectedPage }: { selectedPage: string }) {
  const NavItem = ({ text, to }: { text: string; to: string }) => {
    return (
      <LinkContainer>
        <LinkText to={`/${to}`} selected={selectedPage === text}>
          {text}
        </LinkText>
        <Line selected={selectedPage === text} />
      </LinkContainer>
    );
  };

  return (
    <Container>
      <NavBar>
        <a href="https://move.geog.ucsb.edu/">
          <Logo alt="Move Lav Logo" src={LogoImage} />
        </a>
        <Nav>
          <NavItem text="About" to="" />
          <NavItem text="Animation" to="bivar" />
          <NavItem text="Static" to="trivar" />
          <NavItem text="Static1" to="trivar1" />
          <NavItem text="Scatter" to="scatter" />
        </Nav>
      </NavBar>
    </Container>
  );
}
