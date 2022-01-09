const endScreen = (() =>
{
    const _result =
    {
        win: "win",
        lose: "lose",
        draw: "draw",
        quit: "quit"
    };

    /**
     * Displays the end screen.
     *
     * @param {string} result Result of the match
     */
    function display(result)
    {
        const _endScreen = document.querySelector("#end-screen");
        const _gameScreen = document.querySelector("#game");
        const _title = document.querySelector("#end-screen h1");

        switch (result)
        {
            case _result.win:
                _title.innerHTML = "You win";
                break;
            case _result.lose:
                _title.innerHTML = `${gameState.getUsername2()} wins`;
                break;
            case _result.draw:
                _title.innerHTML = "Draw";
                break;
            case _result.quit:
                _title.innerHTML = `${gameState.getUsername2()} has quit`;
                break;
            default:
                throw new Error("Invalid state");
        }

        // @ts-ignore
        _endScreen.hidden = false;
        // @ts-ignore
        _gameScreen.hidden = true;
    }

    return {
        display
    };
})();
