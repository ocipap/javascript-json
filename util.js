const curry = (f) => {
    return (a, b) => b !== undefined ? f(a, b) : b => f(a, b)
}

function *infinity(i = 0) {
    while(1) yield i++
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

const findOne = (f, iter) => {
    for (let a of iter) {
        if(f(a)) return a
    }
    return undefined
}

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

const pipe = (...func) => (val) => go(val, ...func)

const take = curry((l, iter) => {
    let res = []
    iter = iter[Symbol.iterator]()
    let cur
    while(!(cur= iter.next()).done) {
        const a = cur.value
        res.push(a)
        if(res.length == l) return res
    }
    return res
})

const takeAll = take(infinity)

const it = {
    isNumber: s => {
        s = Number(s)
        return typeof s === "number" && isFinite(s) && Math.floor(s) === s
    },
    isNull: s => {
        return s === "null"
    },
    isBoolean: s => {
        return ["false", "true"].some(v => v === s)
    },
    isString: s => {
        return typeof s === "string" && s.startsWith("'") && s.endsWith("'")
    }
}

const checker = (...func) => {
    return v => {
        const current = findOne(f => f(v), func)
        return current !== undefined ? true : false
    }
}

const validator = (type, fun) => {
    const f = (args) => fun(args)
    f["type"] = type
    return f
}

const errorValidator = (e, fun) => {
    const f = args => fun(args)
    f["error"] = e
    return f
}

const equals = (v1, v2) => v1 === v2

const L = {}

L.map = curry(function*(f, iter){
    for(const a of iter){
        yield f(a)
    }
})

L.filter = curry(function*(f, iter) {
    for(const a of iter) {
        if(f(a)) yield a
    }
})

module.exports = {
    map,
    filter,
    inArray,
    reduce,
    go,
    pipe,
    take,
    takeAll,
    equals,
    findOne,
    it,
    checker,
    validator,
    errorValidator,
    L
}