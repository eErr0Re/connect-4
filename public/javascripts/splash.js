/* eslint-env browser, es2021 */
(() =>
{
    /** @type {HTMLButtonElement} Info / close button*/
    const infoButton = document.querySelector(".info-close");
    /** @type {HTMLElement} Info div */
    const info = document.querySelector("#info");

    infoButton.addEventListener("click", () =>
    {
        info.hidden = !info.hidden;
    });
})();
