type Vec = {
    [key: number]: number
}

type Input = {
    [key: number]: number
    base: number
}

export default class Sparse {

    base: number;
    arr: Vec
    n: number
    private map: { [key: number]: string }
    fips: number

    constructor(arr: Input, nweek: number, fips: string | number) {
        this.base = arr.base;
        delete arr["base"];
        this.arr = arr;
        this.n = nweek
        this.map = { 1: 'hot', 2: 'cold', 0: 'none'}
        this.fips = Number(fips)
    }

    get(i: number) {
        return this.arr[i] ? this.arr[i] : this.base
    }

    count(s: 'hot' | 'cold', lastWeek = this.n) {
        return [...Array(lastWeek).keys()].map(i => {
            return Number(this.map[this.get(i)] === s)
        }).reduce((acc, curr) => {
            return acc + curr
        })
    }

    recent(s: 'hot' | 'cold', lastWeek = this.n) {
        return [...Array(lastWeek).keys()].map(i => {
            return Number(this.map[this.get(i)] === s)
        }).reduce((acc, curr, i) => {
            return curr ? i : acc
        })
    }

}