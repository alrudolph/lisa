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

    /* INSTEAD OF STORING N, STORE LAST AND FIRST WEEK */

    constructor(arr: Input, nweek: number, fips: string | number) {

        // if (arr.base != 0 && arr.base != 1 && arr.base != 2) {console.log(Object.keys(arr))}

        this.base = arr.base;
        delete arr["base"];
        this.arr = arr;
        this.n = nweek
        this.fips = Number(fips)
    }

    get(i: number) {
        return (i in this.arr) ? this.arr[i] : this.base
    }

    getLast(i: number) {
        const curr = this.get(i);

        if (curr === undefined) {
            console.log(i, this.base)
        }

        const last = curr === 0 ? [...Array(i).keys()].reduce((acc, curr) => {
            const last = this.get(curr)
            return last !== 0 ? { last, weeks: i - curr } : acc
        }, { last: -1, weeks: 0 }) : { last: curr, weeks: 0 }

        return {
            curr,
            ...last
        }
    }

    count(firstWeek = 0, lastWeek = this.n) {
        this.n = lastWeek - firstWeek

        return [...Array(this.n).keys()].map(i => {
            const val = this.get(i + firstWeek)
            return [Number(val === 1), Number(val === 2)]
        }).reduce((acc, curr) => {
            return [acc[0] + curr[0], acc[1] + curr[1]]
        }, [0, 0])
    }

    recent(firstWeek = 0, lastWeek = this.n) {
        this.n = lastWeek - firstWeek

        return [...Array(this.n).keys()].map(i => {
            const val = this.get(i + firstWeek)
            return [Number(val === 1), Number(val === 2)]
        }).reduce((acc, curr, i) => {
            return [curr[0] ? i + 1 : acc[0], curr[1] ? i + 1 : acc[1]]
        }, [0, 0])
    }

    changes(firstWeek = 0, lastWeek = this.n) {
        return [...Array(this.n).keys()].map(i => {
            return { last: this.get(i + firstWeek), changes: 0 }
        }).reduce((acc, curr) => {
            if (acc.last !== curr.last) {
                acc.changes += 1;
            }
            return { ...curr, changes: acc.changes }
        }).changes;
    }

    sequential(which: 1 | 2, firstWeek = 0, lastWeek = this.n) {
        this.n = lastWeek - firstWeek

        let sum = 0;

        return [...Array(this.n).keys()].map(i => {
            const val = this.get(i + firstWeek)
            const incl = val === which
            sum += Number(incl)
            return incl ? {
                y: sum,
                x: i + firstWeek + 1
            } : 0
        }).filter(val => val !== 0)
    }

}