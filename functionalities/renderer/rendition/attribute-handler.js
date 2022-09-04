import { executeEvent } from "./events-handler";

const builtInAttributes = ['ezif', 'ezrepeat'];

/**
 * This function handles all custom rendition by looking into ezIf and ezRepeat
 * @param {HTMLElement} htmlNode The container element
 * @param {{}} variableScope The variable container object
 */
export function handleCustomRendition(htmlNode, variableScope) {
    for (const element of htmlNode.children) {
        handleCustomRenditionForElement(element, variableScope);
        if (element.hide) {
            element.replaceWith(document.createComment(''));
        }
        if (!element.hide && element.children) {
            handleCustomRendition(element, variableScope);
        }
    }
}

function handleCustomRenditionForElement(element, variableScope) {
    for (const attribute of element.attributes) {
        if (builtInAttributes.includes(attribute.name)) {
            // Handle ezIf builtInAttribute
            if (attribute.name === 'ezif') {
                element.hide = !isEzIfTruthy(variableScope, attribute);
            }
        }
    }
}

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

function isEzIfTruthy(scopedVars, attribute) {
    let val = attribute.value.replaceAll(/\$\w+/g, match => {
        return `scopedVars.${match.substring(1)}`;
    });
    return eval(val);
}