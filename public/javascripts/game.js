/* eslint-env browser, es2021 */
queue.findMatch("user1");

const newMatch = document.querySelector("#end-screen button");
newMatch.addEventListener("click", () =>
{
    queue.findMatch("user1");
});
