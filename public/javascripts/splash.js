/* eslint-env browser, es2021 */

/** @typedef {import("./messages").Statistics} Statistics */

(() =>
{
    /** @type {HTMLButtonElement} Info / close button*/
    const infoButton = document.querySelector(".info-close");

    // Display info when click on button
    infoButton.addEventListener("click", () =>
    {
        /** @type {HTMLElement} Info div */
        const info = document.querySelector("#info");

        info.hidden = !info.hidden;
    });

    /**
     * Updates the statistics.
     */
    function updateStatistics()
    {
        /** @type {HTMLParagraphElement} Statistics paragraph */
        const statsText = document.querySelector("aside p");
        // @ts-ignore
        axios
            .get("/statistics")
            .then((res) =>
            {
                /** @type {Statistics} Statistics */
                const stats = res.data;

                const hours = Math.floor(stats.time / 3600000);
                const minutes = Math.floor(stats.time / 60000) % 60;

                statsText.innerHTML = 
                `Players online: ${stats.online}<br>` +
                `Games played: ${stats.games}<br>` +
                `Time wasted: ${hours ? `${hours}h` : ""} ${minutes}min`;
            })
            .catch(console.error);
    }

    updateStatistics();

    // Poll for statistics
    setInterval(updateStatistics, 1000);
})();
