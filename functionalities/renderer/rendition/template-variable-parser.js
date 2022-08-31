/**
 * Returns parsed template variable values
 * @param {{}} varContainer the object containing value of all the variables scoped to this element
 * @param {string} variableValue the interpolated characters
 * @param {string} functionName Name of the function to be called if available
 * @returns {string} value of the interpolated string
 */
export function getTemplateVariableValue(varContainer, variableValue, functionName = undefined) {
    if (variableValue.includes('(') || variableValue.includes('[')) {
        return handleFunctionOrSquareBracket(varContainer, variableValue);
    }
    if (functionName) {
        return varContainer[functionName](variableValue)//(eval(`varContainer.${variableValue}`)) || '';
    } else {
        return varContainer[variableValue] || '';
    }
}

function handleFunctionOrSquareBracket() {}

function handleFunction(varContainer, variableValue) {
    const startReg = /\(/g;
    const endReg = /\)/g;
    let match;
    const startIndices = [];
    const endIndices = [];
    while ((match = startReg.exec(variableValue)) !== null) {
        startIndices.push(match.index);
    }
    while ((match = endReg.exec(variableValue)) !== null) {
        endIndices.push(match.index);
    }
    const functionParam = variableValue.substring(startIndices[0] + 1, endIndices[endIndices.length - 1]);
    console.log(functionParam);
    const fnName = variableValue.substring(0, variableValue.indexOf('('));
    if (functionParam) {
        return getTemplateVariableValue(varContainer, functionParam, fnName);
    } else {
        return varContainer[fnName]() || '';
    }
}

function handleSquareBrackets(varContainer, variableValue) {
    const startReg = /\[/g;
    const endReg = /\]/g;
    let match;
    const startIndices = [];
    const endIndices = [];
    while ((match = startReg.exec(variableValue)) !== null) {
        startIndices.push(match.index);
    }
    while ((match = endReg.exec(variableValue)) !== null) {
        endIndices.push(match.index);
    }
    const squareBracketContent = variableValue.substring(startIndices[0] + 1, endIndices[endIndices.length - 1]);
    console.log(squareBracketContent);
    return getTemplateVariableValue(varContainer, squareBracketContent);
}