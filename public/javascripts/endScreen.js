/* eslint-env browser, es2021 */
/* exported endScreen */

/** @typedef {import("./types").ResultType} ResultType */
/** @typedef {import("./types").Types} Types */

const endScreen = (() =>
{
    // ---------- Private variables ---------- //
    
    /** @type {HTMLElement} End sreen */
    const _screen = document.querySelector("#end-screen");
    /** @type {HTMLElement} Title */
    const _title = _screen.querySelector("h1");


    // ---------- Public methods ---------- //

    /**
     * Enables the end screen.
     *
     * @param {!ResultType} result Result of the match
     */
    function enable(result)
    {
        // End game
        game.end();

        /** Time to wait before showing end screen */
        let time = 3000;

        switch (result)
        {
            case types.WIN:
                _title.innerHTML = "You win"; // TODO: Add colour"
                break;
            case types.LOSE:
                _title.innerHTML = `${game.getOpponentName()} wins`; // TODO: Add colour
                break;
            case types.DRAW:
                _title.innerHTML = "Draw";
                break;
            case messages.T_QUIT:
                _title.innerHTML = `${game.getOpponentName()} has quit`;
                time = 0;
                break;
            default:
                throw new Error("Invalid result");
        }

        setTimeout(() =>
        {
            _screen.hidden = false;
        }, time);
    }

    /**
     * Disables the end screen.
     */
    function disable()
    {
        _screen.hidden = true;
    }

    return {
        enable,
        disable
    };
})();
