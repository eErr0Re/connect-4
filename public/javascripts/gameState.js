const gameState = (() =>
{
    const _title = document.querySelector("#game h2");
    const _info = document.querySelectorAll("#game h2")[1];

    let _username1;
    let _username2;
    let _blue;
    let _turn;

    /**
     * Initialises the state of the game.
     *
     * @param {string} username1 Username of the player
     * @param {string} username2 Username of the opponent
     * @param {boolean} blue Is the player blue
     */
    function init(username1, username2, blue)
    {
        _username1 = username1;
        _username2 = username2;
        _blue = blue;
        _turn = blue;

        _title.innerHTML = `${username1} | ${username2}`;
        _info.innerHTML = _turn ? "It's your turn" : `Waiting for ${username2}`;

        setTimeout(() => { endScreen.display("win"); }, 5000); // Delete this

        // TODO
    }

    function _receiveMove(move)
    {
        if (move.result !== null)
            endScreen.display(move.result);
    }

    /**
     * Returns whether it is the player's turn.
     * 
     * @returns {boolean} Is it the player's turn
     */
    function getTurn()
    {
        return _turn;
    }

    /**
     * Gets the username of the player.
     * 
     * @returns {string} Username of the player
     */
    function getUsername1()
    {
        return _username1;
    }

    /**
     * Gets the username of the opponent.
     * 
     * @returns {string} Username of the opponent
     */
    function getUsername2()
    {
        return _username2;
    }

    /**
     * Returns whether the player is blue.
     * 
     * @returns {boolean} Is the player blue
     */
    function getBlue()
    {
        return _blue;
    }

    return {
        init,
        getTurn,
        getUsername1,
        getUsername2,
        getBlue
    };
})();
