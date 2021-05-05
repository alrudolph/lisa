import React, { useState, useEffect } from "react";
import styled from "styled-components";

import MapExample from "./mapExample";
import Controls from "../global/controls";

import { Maps } from "../../contexts/mapsContext";
import { LisaData } from "../../contexts/lisaContext";

const Container = styled.div`
  width: 100%;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > h1 {
    margin: 10px 15px 0 15px;
  }

  & > h2 {
    margin: 5px 15px 0 15px;
  }

  margin: 5px 0;
`;

const Divider = styled.hr`
  width: 98%;
  height: 1px;
  background-color: black;
  border-radius: 1px;
  margin: 5px 10px;
`;

const Text = styled.p`
  margin: 0 15px;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const ListMapContainer = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 770px) {
    flex-wrap: wrap;
    justify-content: center;
  }

  margin-bottom: 5px;
`;

const Button = styled.button``;

const StepList = styled.ol<{ step: number }>`
  max-width: 500px;
  @media (max-width: 550px) {
    width: 85%;
  }
  li:nth-child(${({ step }) => step}) {
    background-color: #d3d3d3;
  }

  & > * {
    margin: 2px 0;
    padding: 3px;
    cursor: pointer;
  }
`;

type Props = {
  step: number;
  setLegendStep: (i: number) => void;
};

export default function LegendDescription({ step, setLegendStep }: Props) {
  const [playing, setPlaying] = useState(false);
  const [clicked, setClicked] = useState(false);

  const setStep = (step) => {
    setClicked(true);
    setLegendStep(step);
  };

  useEffect(() => {
    if (!playing) {
      return;
    }
    setStep(step);
    const timer = setInterval(() => {
      if (step < 5) {
        setStep(step + 1);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [playing, step]);

  return (
    <Maps>
      <LisaData>
        <Container>
          <ListMapContainer>
            <TextContainer>
              <Text>
                The following list describes the steps that were taken to make
                the bubble plots on this page. An accompanying map of South
                Dakota using Safegraph % sheltered is provided to show these
                steps.
              </Text>
              <StepList step={clicked ? step : 0}>
                <li
                  onClick={() => {
                    setPlaying(false);
                    setStep(1);
                  }}
                >
                  Counties with significant values have circles placed over
                  their centroids.
                </li>
                <li
                  onClick={() => {
                    setPlaying(false);
                    setStep(2);
                  }}
                >
                  Counties are classified as hotspots (red) or coldspots (blue).
                </li>
                <li
                  onClick={() => {
                    setPlaying(false);
                    setStep(3);
                  }}
                >
                  The color intensity of circles is determined by the last week
                  the county was a significant value.
                </li>
                <li
                  onClick={() => {
                    setPlaying(false);
                    setStep(4);
                  }}
                >
                  The size of the circles are determined by the total number of
                  weeks a county was a significant value in 2020.
                </li>
                <li
                  onClick={() => {
                    setPlaying(false);
                    setStep(5);
                  }}
                >
                  The circles are placed back over the county.
                </li>
              </StepList>
              <Text>
                Use the controls under the map to play through these steps. You
                can also click on the text of steps to display them.
              </Text>
            </TextContainer>
            <ControlsContainer>
              <MapExample step={step} />
              <Controls
                week={step}
                setWeek={setStep}
                min={1}
                max={5}
                setPlaying={setPlaying}
                playing={playing}
              />
            </ControlsContainer>
          </ListMapContainer>
        </Container>
      </LisaData>
    </Maps>
  );
}
