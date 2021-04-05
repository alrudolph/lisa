import React from "react";
import styled from "styled-components";

import statesMap from "us-atlas/states-10m.json";
const DropDownContainer = styled.div`
  width: 400px;
  padding: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

type Props = {
  selectedState: [number, string];
  stateSelector: ([a, b]: [number, string]) => void;
};

const Button = styled.button`
  border-radius: 10px;
  height: 30px;
  width: 60px;
`;

export default function DropDown({ stateSelector, selectedState }: Props) {
  const statevals = [
    ...statesMap.objects.states.geometries.filter(
      ({ properties: { name } }) =>
        ![
          "Alaska",
          "Hawaii",
          "Guam",
          "Puerto Rico",
          "American Samoa",
          "United States Virgin Islands",
          "Commonwealth of the Northern Mariana Islands",
          "District of Columbia",
        ].includes(name)
    ),
    { id: -1, properties: { name: "United States" } },
  ].sort((a, b) => {
    if (a.id === -1) {
      return -1;
    } else if (b.id === -1) {
      return 1;
    }
    return a.properties.name.localeCompare(b.properties.name);
  });
  return (
    <DropDownContainer>
      <p>Select a state from the drop down or by clicking on the map.</p>
      <ButtonContainer>
        <div>
          {" "}
          <label htmlFor="states">Choose a State:</label>
          {""}
          <select
            id="states"
            onChange={({
              currentTarget: { value },
              target: { selectedOptions },
            }) => {
              stateSelector([Number(value), selectedOptions[0].text]);
            }}
            value={selectedState[0]}
          >
            {statevals.map(({ id, properties: { name } }) => {
              return (
                <option value={Number(id)} key={id}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
        <Button onClick={() => stateSelector([-1, ""])}>Reset</Button>
      </ButtonContainer>
      <p>Selecting a state will highlight that states' counties in the scatter plot below and show the cumulative trajectory over the year.</p>
    </DropDownContainer>
  );
}
