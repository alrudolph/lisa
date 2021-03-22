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
    fips: number

    constructor(arr: Input, nweek: number, fips: string | number) {
        this.base = arr.base;
        delete arr["base"];
        this.arr = arr;
        this.n = nweek
        this.fips = Number(fips)
    }

    get(i: number) {
        return (i in this.arr) ? this.arr[i] : this.base
    }

    count(lastWeek = this.n) {
        return [...Array(lastWeek).keys()].map(i => {
            const val = this.get(i)
            return [Number(val === 1), Number(val === 2)]
        }).reduce((acc, curr) => {
            return [acc[0] + curr[0], acc[1] + curr[1]]
        }, [0, 0])
    }

    recent(lastWeek = this.n) {
        return [...Array(lastWeek).keys()].map(i => {
            const val = this.get(i)
            return [Number(val === 1), Number(val === 2)]
        }).reduce((acc, curr, i) => {
            return [curr[0] ? i : acc[0], curr[1] ? i : acc[1]]
        }, [0, 0])
    }

}