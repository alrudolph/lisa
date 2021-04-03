import React from "react";
import styled from "styled-components";

import statesMap from "us-atlas/states-10m.json";
const DropDownContainer = styled.div`
  width: 400px;
`;

type Props = {
  selectedState: [number, string];
  stateSelector: ([a, b]: [number, string]) => void;
};

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
      <p>Select a state from the drop down or by clicking on the map</p>
      <button onClick={() => stateSelector([-1, ""])}>Reset</button>
    </DropDownContainer>
  );
}
