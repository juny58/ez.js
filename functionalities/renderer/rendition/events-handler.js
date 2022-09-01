/**
 * This function parses the html attribute for an event value
 * @param {{}} scopedVars Object containing all the variables scoped to the specific element
 * @param {string} eventContent The string that has been privided in attribute value
 * @param {Event} event The event data produced or passed
 */
export function executeEvent(scopedVars, eventContent, event = undefined) {
    const val = eventContent.replaceAll(/\$\w+/g, match => {
        return `scopedVars.${match.substring(1)}`;
    });
    eval(val)
}