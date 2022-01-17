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

/* eslint-env browser, es2021 */
/* exported endScreen */

/** @typedef {import("./types").ResultType} ResultType */
/** @typedef {import("./types").Types} Types */

const endScreen = (() =>
{
    // ---------- Private variables ---------- //
    
    /** @type {HTMLElement} End sreen */
    const _screen = document.querySelector("#end-screen");
    /** @type {HTMLElement} Title */
    const _title = _screen.querySelector("h1");


    // ---------- Public methods ---------- //

    /**
     * Enables the end screen.
     *
     * @param {ResultType} result Result of the match
     */
    function enable(result)
    {
        // End game
        game.end();

        /** Time to wait before showing end screen */
        let time = 1500;

        switch (result)
        {
            case types.WIN:
            {
                const colour = game.getType() === types.PLAYER_1 ? "text-primary" : "text-secondary";
                _title.innerHTML = `<span class="${colour}">You</span> win`;
                break;
            }
            case types.LOSE:
            {
                const colour = game.getType() === types.PLAYER_2 ? "text-primary" : "text-secondary";
                _title.innerHTML = `<span class="${colour}">${game.getOpponentName()}</span> wins`;
                break;
            }
            case types.DRAW:
                _title.innerHTML = "Draw";
                break;
            case messages.T_QUIT:
            {
                const colour = game.getType() === types.PLAYER_2 ? "text-primary" : "text-secondary";
                _title.innerHTML = `<span class="${colour}">${game.getOpponentName()}</span> has quit`;
                time = 0;
                break;
            }
            default:
                throw new Error("Invalid result");
        }

        setTimeout(() =>
        {
            _screen.hidden = false;
        }, time);
    }

    /**
     * Disables the end screen.
     */
    function disable()
    {
        _screen.hidden = true;
    }

    return {
        enable,
        disable
    };
})();
