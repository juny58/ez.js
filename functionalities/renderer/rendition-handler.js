/**
 * Start component rendition process
 * @param componentObj Holds the data for each component
 */
export function renderComponent(componentObj) {
    // Call the eznit method if available. Html is not yet available.
    if (componentObj.ezInit) {
        componentObj.ezInit()
    }
    // Compile and render the html
    compileHtml(componentObj);
    // Call the azAfterViewInit method if available. Html is now available.
    if (componentObj.azAfterInit) {
        componentObj.azAfterViewInit()
    }
}

/**
 * This is reusable compiler function that can be called while initialization of a component or during every change detection
 * @param componentObj Holds the data for each component
 */
function compileHtml(componentObj) {
    assignVariablesToHtml(componentObj);
}

/**
 * Assigns variables available in component class to the corresponding html
 * @param componentObj Holds the data for each component
 */
function assignVariablesToHtml(componentObj) {
    const currentHtml = componentObj.currentHtml || componentObj.componentSpecs.template;
    const htmlToInsert = currentHtml.replaceAll(/{{(.*?)}}/g, (match) => {
        return componentObj[match.split(/{{|}}/).filter(Boolean)[0]] || '';
    });
    document.querySelector(componentObj.querySelector).innerHTML = htmlToInsert;
    componentObj.currentHtml = htmlToInsert;
}