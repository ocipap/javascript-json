const curry = f => 
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._)

function *infinity(i = 0) {
    while(1) yield i++
}

const reduce = curry((f, acc, iter) => {
    if(!iter) {
        iter = acc[Symbol.iterator]()
        acc = iter.next().value
    }
    for(const a of iter) {
        acc = f(acc, a)
    }
    return acc
})

const go = (...args) => reduce((a, f) => f(a), args)

const pipe = (f, ...fs) => (...args) => go(f(...args), ...fs)

const map = curry((f, iter) => go(L.map(f, iter), takeAll))

const filter = curry((f, iter) => go(L.filter(f, iter), takeAll))

const take = curry((l, iter) => {
    let res = []
    for(const a of iter) {
        res.push(a)
        if(res.length === l) return res
    }
    return res
})

const checker = (...func) => {
    return s => {
        for(const f of func) {
            if(f(s)) return true
        }
        return false
    } 
}

const takeAll = take(infinity)

const findOne = curry((f, iter) => go(L.filter(f, iter), take(1)))

const last = arr => arr[arr.length - 1]

const head = arr => arr[0]

const L = {}

L.range = function *(l) {
    let i = -1
    while (++i < l) yield i
}

L.map = curry(function *(f, iter) {
    for(const a of iter) yield f(a)
})

L.filter = curry(function *(f, iter) {
    for(const a of iter) {
        if(f(a)) yield a
    }
})

L.entries = function *(obj) {
    for(const k in obj) yield [k, obj[k]]
}

module.exports = {
    reduce,
    map,
    filter,
    pipe,
    go,
    take,
    takeAll,
    findOne,
    checker,
    head,
    last,
    L
}


