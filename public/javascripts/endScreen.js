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
     * @param {ResultType} result Result of the match
     */
    function enable(result)
    {
        // End game
        game.end();

        /** Time to wait before showing end screen */
        let time = 1500;

        switch (result)
        {
            case types.WIN:
            {
                const colour = game.getType() === types.PLAYER_1 ? "text-primary" : "text-secondary";
                _title.innerHTML = `<span class="${colour}">You</span> win`;
                break;
            }
            case types.LOSE:
            {
                const colour = game.getType() === types.PLAYER_2 ? "text-primary" : "text-secondary";
                _title.innerHTML = `<span class="${colour}">${game.getOpponentName()}</span> wins`;
                break;
            }
            case types.DRAW:
                _title.innerHTML = "Draw";
                break;
            case messages.T_QUIT:
            {
                const colour = game.getType() === types.PLAYER_2 ? "text-primary" : "text-secondary";
                _title.innerHTML = `<span class="${colour}">${game.getOpponentName()}</span> has quit`;
                time = 0;
                break;
            }
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
