import React from "react";
import { Link } from "gatsby";
import styled, { keyframes } from "styled-components";

import SVGImage from "../images/MOVE2.svg";
import LogoImage from "../images/logo.png";

const fadeIn = keyframes`
  0% {
    fill: rgba(255, 255, 255, 0);
  }
  100% {
    fill: rgba(255, 255, 255, 1);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LogoPng = styled.img`
  height: 80px;
  width: auto;
`;

const Logo = styled(SVGImage)`
  height: 80px;
  width: auto;

  #MOVE_CIRC {
    transform-box: fill-box;
    transform-origin: center;
  }

  &:hover #MOVE_CIRC {
    animation: ${rotate} 0.2s linear !important;
  }

  #MOVE_PATH1 {
    animation: ${fadeIn} 1s forwards !important;
  }
  #MOVE_PATH2 {
    animation: ${fadeIn} 1.5s forwards !important;
  }
  #MOVE_PATH3 {
    animation: ${fadeIn} 2s forwards !important;
  }
  #MOVE_PATH4 {
    animation: ${fadeIn} 2.5s forwards !important;
  }
  #MOVE_PATH5 {
    animation: ${fadeIn} 3s forwards !important;
  }
  #MOVE_PATH6 {
    animation: ${fadeIn} 3.5s forwards !important;
  }
  #MOVE_PATH7 {
    animation: ${fadeIn} 4s forwards !important;
  }
  #MOVE_PATH8 {
    animation: ${fadeIn} 4.5s forwards !important;
  }
  #MOVE_PATH9 {
    animation: ${fadeIn} 5s forwards !important;
  }
  #MOVE_PATH10 {
    animation: ${fadeIn} 5.5s forwards !important;
  }
  #MOVE_PATH11 {
    animation: ${fadeIn} 6s forwards !important;
  }
  #MOVE_PATH12 {
    animation: ${fadeIn} 6.5s forwards !important;
  }
  #MOVE_PATH13 {
    animation: ${fadeIn} 7s forwards !important;
  }
  #MOVE_PATH14 {
    animation: ${fadeIn} 7.5s forwards !important;
  }
  #MOVE_PATH15 {
    animation: ${fadeIn} 8s forwards !important;
  }
  #MOVE_PATH16 {
    animation: ${fadeIn} 8.5s forwards !important;
  }
  #MOVE_PATH17 {
    animation: ${fadeIn} 9s forwards !important;
  }
  #MOVE_PATH18 {
    animation: ${fadeIn} 9.5s forwards !important;
  }
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

  width: 960px;
  @media (max-width: 960px) {
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
  to {
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
    animation: ${HoverOver} 0.2s forwards ease-in;
    color: lightgray;
  }
`;

console.log(
  "%cMOVE@UCSB",
  "background-color: rgb(0, 54, 96); color: white; padding: 10px; font-size: 30px;"
);

console.log(
  "%cThis website was made by Alex Rudolph for the MOVE Lab at UCSB. See the source code at: https://github.com/alrudolph/lisa.",
  "color: rgb(0, 54, 96); font-weight: thin; font-size: 15px; background-color: #D3D3D3; padding: 5px;"
);

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
          {/*<Logo />*/}
          <LogoPng alt="Move Logo" src={LogoImage} />
        </a>
        <Nav>
          <NavItem text="About" to="" />
          <NavItem text="Animation" to="animated" />
          <NavItem text="Interactive" to="interactive" />
          {/*<NavItem text="Static1" to="trivar1" />*/}
          <NavItem text="Scatter" to="scatter" />
        </Nav>
      </NavBar>
    </Container>
  );
}
