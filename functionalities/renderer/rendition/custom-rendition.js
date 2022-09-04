const builtInAttributes = ['ezif', 'ezrepeat'];
/**
 * This function handles all custom rendition by looking into ezIf and ezRepeat
 * @param {HTMLElement} htmlNode The container element
 * @param {{}} componentObject The variable container object
 */
export function handleCustomRendition(htmlNode, componentObject) {
    for (const node of htmlNode.childNodes) {
        if (!node.scopedVariables) {
            node.scopedVariables = node.parentNode.scopedVariables ? { ...node.parentNode.scopedVariables } : {};
        }
        if (node.nodeName !== '#text') {
            handleCustomRenditionForElement(node, componentObject);
            if (node.hide) {
                node.replaceWith(document.createComment(''));
            } else {
                if (node.childNodes) {
                    handleCustomRendition(node, componentObject);
                }
            }
        } else {
            if (node.nodeValue?.trim()) {
                node.nodeValue = assignVariablesToHtml(componentObject, node.scopedVariables, node.nodeValue);
            }
        }
    }
}

function handleCustomRenditionForElement(element, componentObject) {
    for (const attribute of element.attributes) {
        if (builtInAttributes.includes(attribute.name)) {
            // Handle builtInAttributes
            switch (attribute.name) {
                case 'ezif': {
                    element.hide = !isEzIfTruthy(componentObject, attribute, element.scopedVariables);
                    return;
                };
                case 'ezrepeat': {
                    handleEzRepeat(element, componentObject, attribute.value);
                    return;
                }
            }
        }
    }
}

function isEzIfTruthy(componentObj, attribute, scopedVars) {
    let val = attribute.value.replaceAll(/\$\w+/g, match => {
        return eval(`componentObj.${match.substring(1)}`) ? `componentObj.${match.substring(1)}`
            : `scopedVars.${match.substring(1)}`;
    });
    return eval(val);
}

function handleEzRepeat(element, componentObj, attributeValue) {
    const iteratingEl = attributeValue.split(';')[0].split('of')[0].trim();
    const iterable = eval(attributeValue.split(';')[0].split('of')[1].replaceAll(/\$\w+/g, match => {
        return eval(`componentObj.${match.substring(1)}`) ? `componentObj.${match.substring(1)}`
            : `element.scopedVariables.${match.substring(1)}`;
    }));
    const indexIterator = attributeValue.split(';')[1]?.trim();
    let previousEl = element;
    iterable.forEach((el, i) => {
        let newEl;
        if (i === 0) {
            newEl = element;
        } else {
            newEl = element.cloneNode(true);
            previousEl.after(newEl);
        }
        newEl.removeAttribute('ezrepeat');
        newEl.scopedVariables = newEl.parentNode.scopedVariables ? { ...newEl.parentNode.scopedVariables } : {};
        newEl.scopedVariables[iteratingEl] = el;
        if (indexIterator) {
            newEl.scopedVariables[indexIterator] = i;
        }
        previousEl = newEl;
    });
}

/**
 * Assigns variables available in component class to the corresponding html
 * @param componentObj Holds the data for each component for which the parsing is concerned
 * @param scopedVars Is the container of the scoped variables to this node
 * @param rawHtml Is the raw html string passed to be parsed
 */
function assignVariablesToHtml(componentObj, scopedVars, rawHtml) {
    return rawHtml.replaceAll(/{{(.*?)}}/g, (match) => {
        const matchingVar = match.split(/{{|}}/).filter(Boolean)[0];
        const val = matchingVar.replaceAll(/\$\w+/g, match => {
            return eval(`componentObj.${match.substring(1)}`) ?
                `componentObj.${match.substring(1)}` : `scopedVars.${match.substring(1)}`;
        });
        return eval(val);
    });
}