import * as d3 from "d3"

export default class MapZoom {
    active = d3.select(null);
    path = null
    g = null
    width = 0
    height = 0
    currId = -1

    constructor(path, g, width, height, id) {
        this.path = path
        this.g = g;
        this.width = width
        this.height = height
        this.currId = id
    }

    /*
        Zoom in from id
    */
    select(id: number) {
        this.currId = id;

        const clicked = this.g.select(`[stateFips='${id}']`);

        // // this.active.classed("active", false);
        // // this.active = clicked.classed("active", true);

        let d;
        clicked.attr('x', (_d, i) => {
            d = _d
        })

        const [[x0, y0], [x1, y1]] = this.path.bounds(d);

        const dx = x1 - x0;
        const dy = y1 - y0;
        const x = (x0 + x1) / 2;
        const y = (y0 + y1) / 2;

        // const box = d.node().getBBox()

        // const dx = box.width
        // const dy = box.height
        // const x = box.x + box.width / 2
        // const y = box.y + box.height / 2

        // console.log(x, y, dx, dy)

        const scaleNew = 0.8 / Math.max(dx / this.width, dy / this.height);
        const translateNew = [this.width / 2 - scaleNew * x, this.height / 2 - scaleNew * y]

        this.g
            .transition()
            .duration(650)
            .attr("transform", `translate(${translateNew}) scale(${scaleNew})`)

        return scaleNew
    }

    /*
        On click event handler,


        not used, WON'T WORK ANYMORE
    */
    clicked(clicked, d) {
        const stateId = clicked.getAttribute("id")
        // const states = d3.selectAll(`[id='${stateId}']`)

        if (this.active.node() === clicked) {
            return this.reset();
        }

        this.active.classed("active", false);
        this.active = d3.select(clicked).classed("active", true);

        const [[x0, y0], [x1, y1]] = this.path.bounds(d);

        const dx = x1 - x0;
        const dy = y1 - y0;
        const x = (x0 + x1) / 2;
        const y = (y0 + y1) / 2;

        const scaleNew = 0.7 / Math.max(dx / this.width, dy / this.height);
        const translateNew = [this.width / 2 - scaleNew * x, this.height / 2 - scaleNew * y]

        this.g
            .transition()
            .duration(650)
            .attr("transform", `translate(${translateNew}) scale(${scaleNew})`)

        return stateId
    }

    /*
        Reset map view
    */
    reset() {
        this.currId = ""
        this.active.classed("active", false);
        this.active = d3.select(null);

        this.g
            .transition()
            .duration(500)
            .attr("transform", `translate(0)`)
    }
}