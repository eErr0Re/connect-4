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

/** @typedef {import("./messages").Statistics} Statistics */

(() =>
{
    /** @type {HTMLButtonElement} Info / close button*/
    const infoButton = document.querySelector("#menu");

    // Display info when click on button
    infoButton.addEventListener("click", () =>
    {
        /** @type {HTMLElement} Info div */
        const info = document.querySelector("#menu + section");

        if (info.classList.contains("info-open"))
        {
            info.classList.remove("info-open");
            void info.offsetWidth; // Redraw element
            info.classList.add("info-close");
        }
        else
        {
            info.classList.remove("info-close");
            void info.offsetWidth; // Redraw element
            info.classList.add("info-open");
        }
    });

    // Form validation
    const inputField = document.querySelector("input");

    inputField.addEventListener("input", () =>
    {
        /** @type {HTMLInputElement} Input */
        const format = document.querySelector("form div");
        /** @type {HTMLButtonElement} Play button */
        const button = document.querySelector("#play");

        format.hidden = inputField.value.length <= 10;
        button.disabled = inputField.value.length > 10;
    });

    /**
     * Updates the statistics.
     */
    function updateStatistics()
    {
        /** @type {NodeListOf<HTMLDivElement>} Statistics paragraph */
        const statsText = document.querySelectorAll("aside div:nth-child(2n)");
        // @ts-ignore
        axios
            .get("/statistics")
            .then((res) =>
            {
                /** @type {Statistics} Statistics */
                const stats = res.data;

                const hours = Math.floor(stats.time / 3600000);
                const minutes = Math.floor(stats.time / 60000) % 60;

                statsText[0].innerHTML = `${stats.online}`;
                statsText[1].innerHTML = `${stats.games}`;
                statsText[2].innerHTML = `${hours ? `${hours}h` : ""} ${minutes}min`;
            })
            .catch(() =>
            {
                console.error("Could not get statistics.");
            });
    }

    // Poll for statistics
    setInterval(updateStatistics, 5000);
})();
