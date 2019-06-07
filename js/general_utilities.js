function flattenArray(arr, depth = 1) {
    if (depth == 5) {
        return arr;
    }
    let flattened = [];
    arr.forEach(item => {
        if (Array.isArray(item)) {
            flattened = flattened.concat(flattenArray(item, depth+1));
        } else {
            flattened.push(item);
        }
    });
    return flattened;
}

function ensureNumericArray(value) {
    if (!Array.isArray(value)) {
        value = parseInt(value);
        if (value && !isNaN(value)) {
            return [value];
        }
        return false;
    }
    let arr = value.map(x => parseInt(x)).filter(x => !isNaN(x));
    if (arr && Array.isArray(arr) && arr.length > 0) {
        return arr;
    }
    return false;
}

export { flattenArray, ensureNumericArray };