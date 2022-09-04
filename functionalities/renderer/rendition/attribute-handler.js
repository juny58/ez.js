import { executeEvent } from "./events-handler";

const builtInAttributes = ['ezif', 'ezrepeat'];

/**
 * Handles attributes for an component elements
 * @param {HTMLElement} htmlNode for which attributes need to be handled
 * @param {{}} variableScope Available ariables to the node
 */
export function handleAttributes(htmlNode, variableScope) {
    for (const element of htmlNode.children) {
        handleAttributesForElement(element, variableScope);
        if (element.children) {
            handleAttributes(element, variableScope);
        }
    }
}

function handleAttributesForElement(element, variableScope) {
    for (const attribute of element.attributes) {
        if (!builtInAttributes.includes(attribute.name) && attribute.value) {
            // Handle events
            element[attribute.name] = ($event) => executeEvent(variableScope, attribute.value, $event);
        }
    }
}