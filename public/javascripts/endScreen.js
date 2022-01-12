/* eslint-env browser, es2021 */
/* exported endScreen */
const endScreen = (() =>
{
    // ---------- Private variables ---------- //
    
    const _screen = document.querySelector("#end-screen");


    // ---------- Public methods ---------- //

    /**
     * Enables the end screen.
     *
     * @param {string} result Result of the match
     */
    function enable(result)
    {
        const _title = _screen.querySelector("#h1");

        switch (result)
        {
            case types.WIN:
                _title.innerHTML = "You win";
                break;
            case types.LOSE:
                _title.innerHTML = `${game.getOpponentName()} wins`;
                break;
            case types.DRAW:
                _title.innerHTML = "Draw";
                break;
            case messages.T_QUIT:
                _title.innerHTML = `${game.getOpponentName()} has quit`;
                break;
            default:
                throw new Error("Invalid result");
        }

        _screen.hidden = false;
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
