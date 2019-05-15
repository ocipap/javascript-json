const curry = f => 
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._)

function *infinity(i = 0) {
    while(1) yield i++
}

const identity = v => v

const nagate = f => v => !f(v)

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

const reject = curry((f, iter) => go(L.filter(nagate(f), iter), takeAll))

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

const keys = obj => go(L.keys(obj), takeAll)

const values = obj => go(L.values(obj), takeAll)

const entries = obj => go(L.entries(obj), takeAll)

const takeAll = take(infinity)

const findOne = curry((f, iter) => go(L.filter(f, iter), take(1)))

const last = arr => arr[arr.length - 1]

const head = arr => arr[0]

const counts = (text, s) => {
    let count = 0
    for(const a of text) {
        if(a === s) count++
    }
    return count
}

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

L.keys = function *(obj) {
    for(const k in obj) yield k
}

L.values = function *(obj) {
    for(const k in obj) yield obj[k]
}



module.exports = {
    reduce,
    map,
    filter,
    reject,
    pipe,
    go,
    keys,
    values,
    entries,
    take,
    takeAll,
    findOne,
    checker,
    head,
    last,
    counts,
    L
}


