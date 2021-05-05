import React, { useState } from "react";
import styled from "styled-components";

import ScatterView from "../components/scatter/scatterView";
import Page from "../components/page";

import MapZoom from "../utility/mapZoom";

import ExplanationExample from "../components/scatter/examples/explanationExample";
import WeekStartExample from "../components/scatter/examples/weekStartExample";
import FlatRegionsExample from "../components/scatter/examples/flatRegionsExample";
import MultipleSamePointExample from "../components/scatter/examples/multipleSamePointExample";

import StateSelection from "../components/scatter/stateSelection";
import DropDown from "../components/scatter/dropdown";
import { Link } from "gatsby";

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Descriptions = styled.div`
  margin: 0 10px;
`;

const DescriptionContainer = styled.div`
  margin: 10px 0 30px 0;
`;

const SelectionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;

  @media (max-width: 800px) {
    justify-content: center;
  }
`;

const ExampleContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 630px) {
    flex-wrap: wrap-reverse;
  }

  * > {
    width: 50%;
  }
`;

const ExampleContainerReverse = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  @media (max-width: 630px) {
    flex-wrap: wrap;
  }

  * > {
    width: 50%;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;

  & > h1 {
    margin: 10px 5px 0 5px;
  }

  & > h2 {
    margin: 5px 5px 0 5px;
  }
`;

const Text = styled.p`
  margin: 5px;
`;

const Divider = styled.hr`
  width: 98%;
  height: 1px;
  background-color: black;
  border-radius: 1px;
  margin: 5px 10px;
`;

const PathList = styled.ol`
  counter-reset: list;
  list-style-position: outside;
  margin: 10px;
`;

const PathSegment = styled.li`
  list-style: none;
  position: relative;
  margin: 0 0 5px 0;
  &:before {
    left: -30px;
    position: absolute;
    content: "(" counter(list) ")";
    counter-increment: list;
  }
`;

const Red = styled.i`
  color: #ff0000;
`;

const Blue = styled.i`
  color: #0000ff;
`;

export default function Scatter() {
  const [selectedState, setSelectedState] = useState<[number, string]>([
    -1,
    "",
  ]);

  const [mapZoom, setMapZoom] = useState(Array<MapZoom>(1));


  const [currId, setCurrId] = useState(-1)

  const addState = (m: MapZoom) => {
    mapZoom[0] = m;
    setMapZoom(mapZoom);
  };
  const stateSelector = (
    [id, name]: [number, string],
    reset: boolean = false
  ) => {
    // const m = mapZoom[0];

    // if (!reset && id !== m.currId && id !== -1) {
      if (!reset && id !== currId && id !== -1) {
      // m.select(id);
      setSelectedState([id, name]);
      setCurrId(id)
      return true;
    } else {
      // m.reset();
      setSelectedState([-1, ""]);
      setCurrId(-1)
      return false;
    }
  };

  return (
    <Page selectedPage="Scatter">
      <Container>
        <Descriptions>
          <TextContainer>
            <h1>County Paths</h1>
            <Text>
              This page provides an alternative view to the
              <Link to="/interactive">Interactive Maps</Link>  page.
              Each week a county can be a hotspot, coldspot, or not a
              significant value. Over the year of 2020, the total number of
              weeks a county was a hotspot or coldspot and the last week the
              county was a significant value were calculated and are shown in
              the scatter plots below. In these scatter plots, each point
              represents a county with <Blue>blue</Blue> points representing
              coldspots and <Red>red</Red> points representing hotspots.
            </Text>
          </TextContainer>
        </Descriptions>
        <Divider />
        <ScatterView selectedState={selectedState} />
        <Divider />
        <SelectionContainer>
          <DropDown
            stateSelector={stateSelector}
            selectedState={selectedState}
          />
          <StateSelection
            highlightedState={selectedState}
            stateSelector={stateSelector}
            addState={addState}
          />
        </SelectionContainer>
        <Divider />
        <Descriptions>
          <DescriptionContainer>
            <TextContainer>
              <h2>Paths</h2>
            </TextContainer>
            <ExampleContainer>
              <TextContainer>
                <Text>
                  When selecting a state, the scatter plots above will highlight
                  that state's counties and show each counties' cumulative path.{" "}
                  <b>
                    These paths show, at each week, the total number of times a
                    county was a hotspot or coldspot up to that week
                  </b>
                  . <Red>Red</Red> lines indicate the county was a hot pot
                  while <Blue>blue</Blue> lines indicate that the county was a
                  coldspot. These paths end in a point that shows the total
                  number of times a county was a hotspot or coldspot, on the
                  last week it was a hotspot or coldspot. This final value is shown
                  in the national view of the scatter plots above and in the{" "}
                  <Link to="/interactive">interactive maps</Link>.
                </Text>
                <Text>
                  The accompanying figure shows the path for Park County,
                  Wyoming (the county that contains the majority of Yellowstone
                  National Park). This path is colored blue, indicating that
                  whenever the county was a significant value, it was a cold spot. This
                  path can be broken into three types of regions:
                </Text>
                <PathList>
                  <PathSegment>
                    In these segments the line has a slope of 1. This means that
                    for each week in the segment, the county was a coldspot.
                  </PathSegment>
                  <PathSegment>
                    Between week 13 and 22, Park County was neither a hot spot
                    nor cold spot. Flat line segments such as the one in this
                    region indicate a period of not being significant.
                  </PathSegment>
                  <PathSegment>
                    This segment shows a general upwards trend. Although there
                    are a few flat regions, Park County was mostly a cold spot
                    in this region.
                  </PathSegment>
                </PathList>
              </TextContainer>
              <ExplanationExample />
            </ExampleContainer>
          </DescriptionContainer>
          <DescriptionContainer>
            <TextContainer>
              <h2>Point Color</h2>
            </TextContainer>
            <ExampleContainerReverse>
              <MultipleSamePointExample />
              <TextContainer>
                <Text>
                  Each point on the scatter plot represents a county. However,
                  multiple counties can be located at the same end value. In
                  these cases, the point color is based off of the proportion of
                  counties that were hotspots or cold pots. <Red>Red</Red>{" "}
                  points signify a majority of hotspots while <Blue>blue</Blue>{" "}
                  points signify a majority of coldspots. Darker values
                  indicate a higher proportion of counties being hotspots or
                  coldspots.
                </Text>
                <Text>
                  In the accompanying figure, we can see all of the counties in
                  the entire United States that have their 20th significant
                  value on the last week of the year. There are 7 of these
                  counties with 3 being hotspots and 4 being coldspots as
                  indicated by the color of the paths (note that two of the hot
                  spots overlap the entire time). Since the majority of the
                  counties are coldspots, the point color is a light blue. This
                  is the same point that is shown on the national level view on
                  the interactive scatter plots above.
                </Text>
              </TextContainer>
            </ExampleContainerReverse>
          </DescriptionContainer>
          <DescriptionContainer>
            <TextContainer>
              <h2>Patterns Starting in March</h2>
            </TextContainer>
            <ExampleContainer>
              <TextContainer>
                <Text>
                  The accompanying plot shows the counties in <b>California</b>{" "}
                  for Safegraph's % sheltered. We can see at once that all of
                  the lines are <Red>red</Red> which indicates that these
                  counties were hot spots. This means that compared to counties
                  in the nation, these counties had a higher percentage of
                  people sheltered at home.
                </Text>
                <Text>
                  An interesting pattern occurs on week 10 and the immediately
                  following weeks that corresponds to the Governor declaring a
                  State of Emergency on March 4th and a stay at home order on
                  March 19. In this time period, multiple counties become hot
                  spots and remain being hot spots each week until the end of
                  2020, as shown by these lines having a slope of 1. We can see
                  that multiple counties follow this pattern by the lines being
                  colored a brighter red.
                </Text>
              </TextContainer>
              <WeekStartExample />
            </ExampleContainer>
          </DescriptionContainer>
          <DescriptionContainer>
            <TextContainer>
              <h2>Paths With Flat Regions</h2>
            </TextContainer>
            <ExampleContainerReverse>
              <FlatRegionsExample />
              <TextContainer>
                <Text>
                  The accompanying plot shows counties in <b>Pennsylvania</b> for
                  Cuebiq's % sheltered. All of the lines shown are <Red>red</Red>{" "}
                  which indicates that all of these counties were hot spots.
                  This means that compared to counties in the nation, these
                  counties had higher percentages of people sheltering in their
                  home.
                </Text>
                <Text>
                  Similar to California, starting on week 12, the Governor
                  implemented social distancing measures and ordered schools to
                  close. This corresponds to counties becoming hot spots and
                  staying as hot spots for multiple weeks, meaning that compared
                  to counties in the nation, these counties had a higher
                  percentage of people sheltered in their homes.
                </Text>
                <Text>
                  Then starting on week 19, many counties in the state's Red
                  tier moved up to the Yellow tier, allowing certain business to
                  reopen. This corresponds to flat regions of the counties' path
                  where, compared to counties in the nation, the counties no
                  longer have a high percentage of people sheltered in their
                  homes.
                </Text>
                <Text>
                  Towards the end of 2020, cases in Pennsylvania began to rise
                  again. On November 23, the Health Secretary announced a stay at
                  home advisory and in December the Governor tested positive for
                  COVID-19. This corresponds to certain counties becoming hot
                  spots again.
                </Text>
              </TextContainer>
            </ExampleContainerReverse>
          </DescriptionContainer>
        </Descriptions>
      </Container>
    </Page>
  );
}
