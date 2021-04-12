import React, { useContext } from "react";
import ScatterPlot from "../scatterPlot";
import { LisaContext } from "../../../contexts/lisaContext";

export default function MultipleSamePointExample() {
  // Only want the fourth map
  const {
    mapData: [_, __, map, ___],
    mapTitles: [_1, __1, title, ___1],
  } = useContext(LisaContext);

  // Get values only for California
  const data = map.filter(({ fips }) =>
    [6031, 13303, 25023, 34029, 36083, 48227, 48431].includes(fips)
  );

  return <ScatterPlot title={title} data={data} selectedState={[-2, ""]} />;
}
