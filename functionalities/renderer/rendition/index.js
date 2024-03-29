import { handleAttributes } from "./attribute-handler";
import { handleCustomRendition } from "./custom-rendition";

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
    const componentNode = new DOMParser().parseFromString(componentObj.componentSpecs.template, 'text/html').body;
    handleCustomRendition(componentNode, componentObj);
    // This would need to change in future so that we can put the whole html object and insert into component
    document.querySelector(componentObj.querySelector).innerHTML = componentNode.innerHTML;
    const componentRef = document.querySelector(componentObj.querySelector);
    handleAttributes(componentRef, componentObj);
    createCustomComponents(componentObj, componentRef);
}

/**
 * Travarses through every node to find if any new custom component is found, if found, renders that
 * @param {{}} componentObj The instance of the component object
 * @param {HTMLElement} domTree The node to be travered
 */
function createCustomComponents(componentObj, domTree) {
    for (const element of domTree.children) {
        // Checking for custom elements
        let travarsingRequired = true;
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
                        travarsingRequired = false;
                    }
                } else {
                    renditionRequired = !element.hasAttribute('component');
                    if (renditionRequired) {
                        element.setAttribute('component', '');
                        const uniqueComponentId = `ezc${componentRenderCount}`;
                        element.setAttribute(uniqueComponentId, '');
                        componentRef.querySelector = `${element.localName}[${uniqueComponentId}]`;
                        componentRef.elementRef = document.querySelector(componentRef.querySelector);
                        componentRenderCount++;
                    }
                }
                if (renditionRequired) {
                    renderComponent(componentRef);
                }
            } else {
                console.error(`Selector "${element.localName}" is not a valid component selector. Make sure to include the ` +
                    `respective component class in "uses" array inside @Component decorator.`);
            }
        }
        // If has children, travarse down the line
        if (travarsingRequired && element.children.length) {
            createCustomComponents(componentObj, element);
        }
    }
}