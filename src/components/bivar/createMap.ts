import * as d3 from "d3"
import { svg } from "d3";
import * as topojson from "topojson"

import countiesMap from "us-atlas/counties-10m.json";

const getStateFips = (fips: number): number => {
    return Number(String(fips).slice(0, -3));
  };

class CreateMap {

    static svg;
    static g;
    static path;

    constructor() {
        if (CreateMap.svg !== undefined && CreateMap.g !== undefined) {
            return;
        }

        console.log("\n\nCREATING MAP\n\n")

        const width = 380;
        const height = 250;
        const translate: [number, number] = [width / 2, height / 2];
        const scale = 500;
        
        const projection = d3.geoAlbers().scale(scale).translate(translate);
        const map_path = d3.geoPath().projection(projection);
      
        CreateMap.path = map_path

        const svg = d3.create("MAP").append("svg");
        const map_g = svg.attr("width", width).attr("height", height).append("g");
      
        // addState(new MapZoom(map_path, map_g, width, height, selectedState[0]));
      
        // States:
        map_g
          .append("g")
          .attr("id", "states")
          .style("stroke", "black")
          .style("stroke-width", "0.5px")
          .style("fill", "#ffffffff")
          .selectAll("path")
          .data(topojson.feature(countiesMap, countiesMap.objects.states).features)
          .enter()
          .append("path")
          .attr("d", map_path as any)
          .attr("stateFips", ({ id }) => Number(id));
      
        // Counties:
        map_g
          .append("g")
          .selectAll("path")
          .data(topojson.feature(countiesMap, countiesMap.objects.counties).features)
          .enter()
          .append("path")
          .attr("d", map_path as any)
          .attr("stateName", ({ id }) => {
            return countiesMap.objects.states.geometries.filter((val) => {
              return getStateFips(id) === Number(val.id);
            })[0].properties.name;
          })
          .attr("id", ({ id }) => `c${Number(id)}`)
          //   .attr("countyName", ({ properties: { name } }) => name)
          .attr("class", "cboundary")
          .style("fill", "#00000000");
        // .style("stroke-width", 0)
        // .style("stroke", "#FFFFFF00")

        CreateMap.svg = svg;
        CreateMap.g = map_g;
    }

    copy () {
        
        const elem =  CreateMap.svg.node().cloneNode(true);
        return {
            elem,
            svg,
            path: CreateMap.path,
        }
    }
}

export default CreateMap;