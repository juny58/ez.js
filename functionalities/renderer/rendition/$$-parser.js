/**
 * This function parses the html for an interpolted string
 * @param {{}} scopedVars Object containing all the variables scoped to the specific variable
 * @param {string} interPolatedString The string that has been interpolated
 * @returns the value which is yielded by the interpolation
 */
export function get$$ParsedHtml(scopedVars, interPolatedString) {
    const val = interPolatedString.replaceAll(/\$\w+/g, match => {
        return `scopedVars.${match.substring(1)}`;
    });
    return eval(val)
}