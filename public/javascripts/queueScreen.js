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
