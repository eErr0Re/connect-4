/*
 * MIT License
 *
 * Copyright (c) 2022 Nils Marten Mikk
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
