exports.toBeData = {
    type: 'array',
    value: 'ArrayObject',
    child: [{
        type: 'number',
        value: 1
    },
    {
        type: 'boolean',
        value: true
    },
    {
        type: 'string',
        value: 'code'
    },
    {
        type: 'array',
        value: 'ArrayObject',
        child: [
            {
                type: 'number',
                value: 2
            },
            {
                type: 'number',
                value: 3
            },
        ]
    },
    {
        type: "object",
        value: "Object",
        child: [
            {
                type: "keyString",
                value: "a"
            },
            {
                type: "null",
                value: null
            }
        ]
    }
    ]
}