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
/* exported queueScreen */
const queueScreen = (() =>
{
    // ---------- Private variables ---------- //

    /** @type {HTMLElement} Queue screen */
    const _screen = document.querySelector("#queue-screen");
    /** @type {number} Timer interval ID */
    let _timer = null;


    // ---------- Private methods ---------- //

    /**
     * Starts the timer.
     */
    function _startTimer()
    {
        /** Start time */
        const start = Date.now();
        /** Timer text */
        const time = _screen.querySelector("h2");

        if (_timer !== null)
            clearInterval(_timer);

        time.innerHTML = "00:00";

        _timer = window.setInterval(() =>
        {
            const elapsed = Date.now() - start;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor(elapsed / 1000) % 60;

            time.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }, 200);
    }


    // ---------- Public methods ---------- //

    /**
     * Enables the screen.
     */
    function enable()
    {
        _startTimer();

        _screen.hidden = false;
    }

    /**
     * Disable the screen.
     */
    function disable()
    {
        // Stop timer
        clearInterval(_timer);
        _timer = null;

        _screen.hidden = true;
    }

    return {
        enable,
        disable
    };
})();
