function checkPathValidity(path, mayIncludeQueryString = false) {
    // Check if the provided path is valid at all
    if (!path || (typeof path !== 'string')) {
        throw new Error("Provided path is not valid. It has to be a valid path string defined in routes array.")
    }

    // Recognize if path includes queryString
    if (mayIncludeQueryString) {
        path = path.split('?')[0]
    } else {
        // Can not pass query string in this method
        if (path.includes('?')) {
            throw new Error("Path string can not include queryString.")
        }
    }

    const allowedCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '/']
    const pathArray = path.split('')
    // Path should always start with '/'
    if (pathArray[0] !== '/') {
        throw new Error("Pathstring should always start with '/'.")
    }
    for (let i = 0; i < pathArray; i++) {
        if (!allowedCharacters.includes(pathArray[i])) {
            throw new Error("Path string can only hold small alphabet letters and '/'.")
        }
    }
}

function getQueryParamObjectFromString(queryString) {
    const params = new URLSearchParams(queryString);
    const keys = params.keys();
    const values = params.values();
    const obj = {};
    keys.forEach((key, i) => {
        obj[key] = values[i]
    });
    return obj
}

module.exports = { checkPathValidity, getQueryParamObjectFromString }