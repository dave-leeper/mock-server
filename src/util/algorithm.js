oneTruthyReduce = (accumulator, currentValue) => {
    if (accumulator) return accumulator;
    return currentValue;
};
manyTruthyReduce = (accumulator, currentValue) => {
    if (!Array.isArray(accumulator)) {
        let x = accumulator;
        accumulator = [ ];
        if (x) accumulator.push(x);
    }
    if (currentValue) accumulator.push(currentValue);
    return accumulator;
};
uniqueReduce = (accumulator, currentValue) => {
    if (!Array.isArray(accumulator)) accumulator = [ accumulator ];
    if (arrayContainsObject(accumulator, currentValue)) return accumulator;
    accumulator.push(currentValue);
    return accumulator;
};
mapAllExecept = (keep, replacement) => {
    return ( item ) => { if (item === keep) return item; return replacement; };
};
arrayContainsObject = (array, object) => {
    if (!array || !Array.isArray(array) || !array.length) return false;
    for (let loop = 0; loop < array.length; loop++) {
        if (array[loop] === object) return true;
    }
    return false;
};

module.exports.oneTruthyReduce = oneTruthyReduce;
module.exports.manyTruthyReduce = manyTruthyReduce;
module.exports.uniqueReduce = uniqueReduce;
module.exports.mapAllExecept = mapAllExecept;
module.exports.arrayContainsObject = arrayContainsObject;
