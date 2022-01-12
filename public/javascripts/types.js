/* eslint-env browser, es2021, node */

/**
 * @typedef PlayerType
 * @type {boolean}
 */

/**
 * @typedef ResultType
 * @type {string}
 */

/**
 * @typedef Types
 * @type {object}
 * @property {PlayerType} PLAYER_1 Player 1
 * @property {PlayerType} PLAYER_2 Player 2
 * @property {ResultType} WIN Win
 * @property {ResultType} LOSE Lose
 * @property {ResultType} DRAW Draw
 */

((exports) =>
{
    // Player types
    /** @type {PlayerType} Player 1 */
    exports.PLAYER_1 = true;
    /** @type {PlayerType} Player 2 */
    exports.PLAYER_2 = false;    

    // Result types
    /** @type {ResultType} Win */
    exports.WIN = "WIN";
    /** @type {ResultType} Lose */
    exports.LOSE = "LOSE";
    /** @type {ResultType} Draw */
    exports.DRAW = "DRAW";
// @ts-ignore
})(typeof exports === "undefined" ? this.types = {} : exports);
