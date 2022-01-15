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
