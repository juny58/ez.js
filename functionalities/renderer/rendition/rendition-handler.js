import { getTemplateVariableValue } from "./template-variable-parser";

/**
 * A variable that keeps track of number of components rendered. It helps in creating unique id of every rendered component
 */
let componentRenderCount = 0;
let hasRouterOutletInitiated = false;

/**
 * Start component rendition process
 * @param componentObj Holds the data for each component
 */
export function renderComponent(componentObj) {
    // Call the eznit method if available. Html is not yet available.
    if (componentObj.ezInit) {
        componentObj.ezInit();
    }
    // Compile and render the html
    compileHtml(componentObj);
    // Call the azAfterViewInit method if available. Html is now available.
    if (componentObj.ezAfterViewInit) {
        componentObj.ezAfterViewInit();
    }
}

/**
 * This is reusable compiler function that can be called while initialization of a component or during every change detection
 * @param componentObj Holds the data for each component
 */
function compileHtml(componentObj) {
    assignVariablesToHtml(componentObj);
    travarseNodes(componentObj, document.querySelector(componentObj.querySelector));
}

/**
 * Assigns variables available in component class to the corresponding html
 * @param componentObj Holds the data for each component
 */
function assignVariablesToHtml(componentObj) {
    const currentHtml = componentObj.currentHtml || componentObj.componentSpecs.template;
    const htmlToInsert = currentHtml.replaceAll(/{{(.*?)}}/g, (match) => {
        const matchingVar = match.split(/{{|}}/).filter(Boolean)[0];
        return getTemplateVariableValue(componentObj, matchingVar)
    });
    document.querySelector(componentObj.querySelector).innerHTML = htmlToInsert;
    componentObj.currentHtml = htmlToInsert;
}

function travarseNodes(componentObj, domTree) {
    for (const element of domTree.children) {
        if (element.nodeName.split('-')[0] && element.nodeName.split('-')[1]) {
            // Means this node is a custom component
            const componentRef = componentObj.componentSpecs.selectorMap[element.localName];
            if (componentRef) {
                // Means it is existing
                let renditionRequired;
                if (element.localName === 'router-outlet') {
                    componentRef.querySelector = "router-outlet";
                    renditionRequired = !hasRouterOutletInitiated;
                    if (renditionRequired) {
                        hasRouterOutletInitiated = true;
                    }
                } else {
                    renditionRequired = !element.hasAttribute('component');
                    if (renditionRequired) {
                        element.setAttribute('component', '');
                        const uniqueComponentId = `ezc${componentRenderCount}`;
                        element.setAttribute(uniqueComponentId, '');
                        componentRef.querySelector = `${element.localName}[${uniqueComponentId}]`;
                        componentRef.elementRef = document.querySelector(componentRef.querySelector)
                        componentRenderCount++;
                    }
                }
                if (renditionRequired) {
                    renderComponent(componentRef);
                }
            } else {
                console.error(`Selector "${element.localName}" is not a valid component selector. Make sure to include the ` +
                `respective component class in "uses" array inside @Component decorator.`)
            }
        }
        if (element.children.lenth) {
            travarseNodes(componentObj, element.children);
        }
    }
}