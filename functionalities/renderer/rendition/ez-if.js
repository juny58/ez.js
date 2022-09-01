/**
 * This function parses the html attribute for an ezIf value
 * @param {{}} scopedVars Object containing all the variables scoped to the specific element
 * @param {string} eventContent The string that has been privided in attribute value
 */
export function isEzIfTrue(scopedVars, eventContent) {
    const val = eventContent.replaceAll(/\$\w+/g, match => {
        return `scopedVars.${match.substring(1)}`;
    });
    return eval(val)
}