import { executeEvent } from "./events-handler";

const builtInAttributes = ['ezif', 'ezrepeat'];

/**
 * Handles attributes for an element
 * @param {HTMLElement} element for which attributes need to be handled
 * @param {{}} variableScope Available ariables to the element
 */
export function handleAttributes(element, variableScope) {
    for (const attribute of element.attributes) {
        if (builtInAttributes.includes(attribute.name)) {
            // Handle ezRepeat builtInAttributes
            if (attribute.name === 'ezif' && !isEzIfTruthy(variableScope, attribute.value)) {
                element.replaceWith(document.createComment(""));
                return false;
            }
        } else {
            // Handle events
            element[attribute.name] = ($event) => executeEvent(variableScope, attribute.value, $event);
        }
    }
    return true;
}

function isEzIfTruthy(variableScope, attributeValue) {
    return eval(attributeValue);
}