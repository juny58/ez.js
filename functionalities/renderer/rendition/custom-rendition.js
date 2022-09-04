const builtInAttributes = ['ezif', 'ezrepeat'];

/**
 * This function handles all custom rendition by looking into ezIf and ezRepeat
 * @param {HTMLElement} htmlNode The container element
 * @param {{}} variableScope The variable container object
 */
 export function handleCustomRendition(htmlNode, variableScope) {
    for (const element of htmlNode.childNodes) {
        if (element.nodeName !== '#text') {
            handleCustomRenditionForElement(element, variableScope);
            if (element.hide) {
                element.replaceWith(document.createComment(''));
            } else {
                if (element.children) {
                    handleCustomRendition(element, variableScope);
                }
            }
        }
    }
}

function handleCustomRenditionForElement(element, variableScope) {
    for (const attribute of element.attributes) {
        if (builtInAttributes.includes(attribute.name)) {
            // Handle builtInAttributes
            switch (attribute.name) {
                case 'ezif': {
                    element.hide = !isEzIfTruthy(variableScope, attribute);
                    return;
                };
                case 'ezrepeat': {
                    handleEzRepeat(element, variableScope, attribute.value);
                    return;
                }
            }
        }
    }
}

function isEzIfTruthy(scopedVars, attribute) {
    let val = attribute.value.replaceAll(/\$\w+/g, match => {
        return `scopedVars.${match.substring(1)}`;
    });
    return eval(val);
}

function handleEzRepeat(element, scopedVars, attributeValue) {
    const iteratingEl = attributeValue.split(';')[0].split('of')[0].trim();
    const iterable = eval(attributeValue.split(';')[0].split('of')[1].replaceAll(/\$\w+/g, match => {
        return `scopedVars.${match.substring(1)}`;
    }));
    const indexIterator = attributeValue.split(';')[1]?.trim();
    let previousEl;
    iterable.forEach((el, i) => {
        const newEl = element.cloneNode(true);
        newEl[iteratingEl] = el;
        if (indexIterator) {
            newEl[indexIterator] = i;
        }
        newEl.removeAttribute('ezrepeat');
        if (previousEl) {
            previousEl.after(newEl);
        } else {
            element.replaceWith(newEl);
        }
        previousEl = newEl;
    });
}