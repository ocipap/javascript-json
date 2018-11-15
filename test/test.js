const test = (str, fn) => {
    console.log(`${str} : `);
    fn();
}

exports.test = test;