/* eslint-env browser, es2021 */
/* exported queue */
const queue = (() =>
{
    const _queueScreen = document.querySelector("#queue");
    const _gameScreen = document.querySelector("#game");
    let _elapsed = null;

    /**
     * Starts the timer.
     */
    function _startTimer()
    {
        const start = Date.now();
        const time = document.querySelector("#queue h2");

        time.innerHTML = "00:00";

        if (_elapsed !== null)
            clearInterval(_elapsed);

        _elapsed = setInterval(() =>
        {
            const elapsed = Date.now() - start;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor(elapsed / 1000) % 60;

            time.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }, 200);
    }

    /**
     * Initialises the state of the game.
     * 
     * @param {string} username1 Username of the player
     * @param {string} username2 Username of the opponent
     * @param {boolean} blue Is the player blue
     */
    function _matchFound(username1, username2, blue)
    {
        // Stop timer
        clearInterval(_elapsed);
        _elapsed = null;

        gameState.init(username1, username2, blue);
        // @ts-ignore
        _gameScreen.hidden = false;

        // @ts-ignore
        _queueScreen.hidden = true;

        // TODO
    }

    /**
     * Finds a match.
     * 
     * @param {string} username Username
     */
    function findMatch(username)
    {
        _startTimer();
        // @ts-ignore
        _queueScreen.hidden = false;

        // Delete this
        setTimeout(_matchFound, 5000, "a", "b", false);

        // TODO
    }

    return {
        findMatch
    };
})();
