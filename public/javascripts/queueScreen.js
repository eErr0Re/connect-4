/* eslint-env browser, es2021 */
/* exported queueScreen */
const queueScreen = (() =>
{
    // ---------- Private variables ---------- //

    const _screen = document.querySelector("#queue-screen");
    let _timer = null;


    // ---------- Private methods ---------- //

    /**
     * Starts the timer.
     */
    function _startTimer()
    {
        const start = Date.now();
        const time = document.querySelector("#queue-screen h2");

        if (_timer !== null)
            clearInterval(_timer);

        time.innerHTML = "00:00";

        _timer = setInterval(() =>
        {
            const elapsed = Date.now() - start;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor(elapsed / 1000) % 60;

            time.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }, 200);
    }


    // ---------- Public methods ---------- //

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

    /**
     * Enables the screen.
     */
    function enable()
    {
        _startTimer();

        _screen.hidden = false;
    }

    return {
        enable,
        disable
    };
})();
