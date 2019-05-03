const curry = (f) => {
    return (a, b) => b !== undefined ? f(a, b) : b => f(a, b)
}

const map = curry((f, iter) => {
    let res = []
    for (let a of iter) {
        res.push(f(a))
    }
    return res
})

const filter = curry((f, iter) => {
    let res = []
    for (let a of iter) {
        if (f(a)) res.push(a)
    }
    return res
})

const inArray = (s, iter) => {
    for (let a of iter) {
        if (s === a) {
            return true
        }
    }
    return false
}

const reduce = (f, acc, iter) => {
    if (iter === undefined) {
        iter = acc
        acc = iter.shift()
    }
    for (const a of iter) {
        acc = f(acc, a)
    }
    return acc
}

const go = (...args) => reduce((a, f) => f(a), args)

module.exports = {
    map,
    filter,
    inArray,
    reduce,
    go
}