"use strict";
//globalThis.process = globalThis.process;

/**
 * Should Parser / Lexer Validations be skipped?
 *
 * By default (productive mode) the validations would be skipped to reduce parser initialization time.
 * But during development flows (e.g testing/CI) they should be enabled to detect possible issues.
 *
 * @returns {boolean}
 */
function getSkipValidations() {
/**
    let skip = (
        (process && // (not every runtime has a global `process` object
            process.env &&
            process.env["prettier-java-development-mode"] === "enabled") === false
    );
    console.log("skipValidations: " + skip)
  return skip
 */
    return true;

}

/**
module.exports = {
  getSkipValidations
};
 */

export {
    getSkipValidations
}
