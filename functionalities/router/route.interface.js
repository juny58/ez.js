export class Route {
    /**
     * Class for creating each oute object
     * @param {string} path path string starting with '/'
     * @param {Class} component Component class
     * @param {Route[]} childRoutes Route[]
     * @todo Add Redirect to
     */
    constructor(path, component = undefined, childRoutes = undefined) {
        this.path = path;
        this.component = component;
        this.childRoutes = childRoutes;
    }
}

export class RouteSpec {
    /**
     * The spec to be sent as parameter for route method
     * @param {boolean} isRelative Indicates if the routing to be done is relative to current url
     * @param {{params: {}; merge: boolean}} queryParams Contains 'params' object and 'meerge' indicating whether
     * or not to be merged with existing queryString
     * @param {string} hash The hash string to be included in url
     * @param {boolean} replaceUrl Indicates if we need to delete current url from history, resulting in going back in history,
     * previous stored state will load
     */
    constructor(isRelative = undefined, queryParams = undefined, hash = undefined, replaceUrl = false) {
        this.isRelative = isRelative;
        this.queryParams = queryParams;
        this.hash = hash;
        this.replaceUrl = replaceUrl;
    }
}

export class RouteToSpec {
    /**
     * The spec to be sent as parameter for routeTo method
     * @param {boolean} isRelative Indicates if the routing to be done is relative to current url
     * @param {boolean} replaceUrl Indicates if we need to delete current url from history, resulting in going back in history,
     * previous stored state will load
     */
    constructor(isRelative = undefined, replaceUrl = false) {
        this.isRelative = isRelative;
        this.replaceUrl = replaceUrl;
    }
}