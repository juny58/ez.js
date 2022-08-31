const renderedSelectors = {};

/**
 * Component decorator for a given component where all the magic happens to make it EZ
 * @param {{selector: string; template: string; style: string; isScoped: boolean = true}} componentSpecs Object containing
 * the details to create component
 */
export function Component(componentSpecs) {
    componentSpecs = { isScoped: true, uses: [], ...componentSpecs };
    componentSpecs.selectorMap = {};
    componentSpecs.uses.forEach(componentRef => {
        componentSpecs.selectorMap[componentRef.componentSpecs.selector] = componentRef
    });
    
    // Actual decorator function
    return (TargetClass) => {
        let tc = new TargetClass();
        prepareAndAppendScopedStyle(componentSpecs);
        tc.componentSpecs = componentSpecs;
        return tc;
    };
}

/**
 * Prepares style to be appended for scoped components
 * @param {{selector: string; template: string; style: string; isScoped: boolean = true}} componentSpecs Object containing
 * the details to create component
 */
function prepareAndAppendScopedStyle(componentSpecs) {
    componentSpecs.style = componentSpecs.style[0][1];
    if (componentSpecs.isScoped) {
        componentSpecs.style = componentSpecs.style.replaceAll('replaceWithScopedSelector', componentSpecs.selector);
    } else {
        componentSpecs.style = componentSpecs.style.replaceAll('replaceWithScopedSelector > ', '');
    }
    componentSpecs.style = componentSpecs.style.replaceAll(':host', componentSpecs.selector);
    if (!renderedSelectors[componentSpecs.selector]) {
        const globalStyleElId = "ez-singleton";
        let styleEl = document.getElementById(globalStyleElId);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = globalStyleElId;
            document.head.append(styleEl);
        }
        styleEl.append(componentSpecs.style);
        renderedSelectors[componentSpecs.selector] = true;
    }
}