const { checkPathValidity, getQueryParamObjectFromString } = require("./router-util");
/**
 * Route map object holding data for each valid path
 */
let routeMap = {};

/**
 * This function creates a mapping of all the paths including the children to identify and route;
 * and help render respective views
 * @param routeArray Is the array of routes configuration
 */
function setRouteMap(routeArray) {
    let routeId = 1;
    const createRouteMap = (routes, trailingPath = '') => {
        for (let i = 0; i < routes.length; i++) {
            // Check if the provided path is valid at all
            checkPathValidity(routes[i].path)
            routes[i].id = routeId;
            const routeObj = {
                ...routes[i],
                id: routeId,
            }
            const fullPath = trailingPath + routes[i].path;
            routeMap[fullPath] = routeObj;
            routeId++;
            if (routes[i].childRoutes) {
                // Every path can have children paths. In that case asssign their objct as path of individual path too.
                createRouteMap(routes[i].childRoutes, fullPath)
            }
        }
    }
    // Making this a copy will keep original unhampered
    createRouteMap([...routeArray])
}

/**
 * This function routes to the given path accomodating the specs provided
 * @param path is the path to navigate to, queryStrings can not be passed here
 * @param routeSpecObj holds the queryParams object and other routing specifics
 */
function route(path, routeSpecObj = {}) {
    path = path || '';

    // Check path validity
    if (path) {
        // Check if the provided path is valid at all
        checkPathValidity(path)
    }

    routeSpecObj = routeSpecObj || {}

    if (routeSpecObj.isRelative) {
        // This specifies if the path to be navigated to is relative to current
        path = window.location.pathname + path;
    }

    // Throw error for non-existing path
    if (!routeMap[path]) {
        throw new Error(`Error: Path not found => "${path}". If updating only queryParams, pass {isRelative: true} ` +
            `in the second argument.`)
    }

    const state = { id: routeMap[path].id };

    // Update fullpath for js to use
    path = window.location.origin + path;
    const url = new URL(path)

    if (routeSpecObj.queryParams?.params && Object.keys(routeSpecObj.queryParams.params).length) {
        const queryParams = routeSpecObj.queryParams;
        const currentParamObj = getQueryParamObjectFromString(window.location.search.substring(1))
        if (queryParams.merge) {
            // This means new params should merge with previous one, resulting in updating new values and
            // keep other keys and their values if not changed or not provided
            url.search = new URLSearchParams({ ...currentParamObj, ...queryParams.params })
        } else {
            // This means new query params can be provided which are passed and older be removed
            url.search = new URLSearchParams(queryParams.params)
        }
    }

    // Do routing only when url actually changes
    if (window.location.href !== url.toString()) {
        try {
            if (routeSpecObj.replaceUrl) {
                // This replaces the url with new one and can not be navigated with browser back or forward
                history.replaceState(state, '', url)
            } else {
                // This pushes the new url in the history stack, so can be navigated with browser back or forward
                history.pushState(state, '', url)
            }
        } catch (err) {
            throw err
        }
    }
}

/**
 * This function routes to the given path accomodating the specs provided
 * This does not support additional queryParams and the path has to be including the queryParams if needed
 * @param path is the path to navigate to
 * @param routeSpecObj holds the routing specifics without the queryParams. That has to be with path string if needed
 */
function routeTo(path, routeSpecObj = {}) {
    checkPathValidity(path, true);

    // Throw error for non-existing path
    const pathWithoutParams = path.split('?')[0];
    if (!routeMap[pathWithoutParams]) {
        throw new Error(`Error: Path not found => "${path}"`)
    }

    if (routeSpecObj.isRelative) {
        path = window.location.pathname.split('?')[0] + path;
    }

    path = window.origin + path;
    const state = { id: routeMap[pathWithoutParams].id }
    routeSpecObj = routeSpecObj || {}

    // Do routing only when url actually changes
    if (window.location.href !== path) {
        try {
            if (routeSpecObj.replaceUrl) {
                // This replaces the url with new one and can not be navigated with browser back or forward
                history.replaceState(state, '', path)
            } else {
                // This pushes the new url in the history stack, so can be navigated with browser back or forward
                history.pushState(state, '', path)
            }
        } catch (err) {
            throw err
        }
    }
}

module.exports = { setRouteMap, route, routeTo }