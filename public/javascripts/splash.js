/* eslint-env browser, es2021 */
const infoButton = document.querySelector(".info-close");
const info = document.querySelector("#info");

infoButton.addEventListener("click", () =>
{
    // @ts-ignore
    info.hidden = !info.hidden;
});
