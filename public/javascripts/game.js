/* eslint-env browser, es2021 */
/* exported game */
const game = (() =>
{
    // ---------- Private variables ---------- //

    let _player;
    let _opponent;
    let _type;
    let _turn;
    let _startTime;
    let _board;
    let _ws;

    
    // ---------- Public methods ---------- //

    /**
     * Initialises the game.
     *
     * @param {string} username1 Username of player1
     * @param {string} username2 Username of player2
     * @param {boolean} type Type of player
     * @param {number} startTime Start time
     */
    function init(username1, username2, type, startTime, ws)
    {
        _player = type === types.PLAYER_1 ? username1 : username2;
        _opponent = type === types.PLAYER_1 ? username2 : username1;
        _type = type;
        _startTime = startTime;
        _turn = type === types.PLAYER_1;
        _board = Array(7).fill(0); // Array of column counts
        _ws = ws;
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
    function getPlayerName()
    {
        return _player;
    }

    /**
     * Gets the username of the opponent.
     * 
     * @returns {string} Username of the opponent
     */
    function getOpponentName()
    {
        return _opponent;
    }

    /**
     * Returns the type of the player
     * 
     * @returns {boolean} Type of player
     */
    function getType()
    {
        return _type;
    }

    /**
     * Adds a disc to the board.
     * 
     * @param {number} column Column number
     * @param {string} type Type of player 
     */
    function addDisc(column, type)
    {
        ++_board[column];

        if (type === _type)
            _turn = false;
        else _turn = true;
    }

    /**
     * Returns the first free row or null if no free rows.
     * 
     * @param {number} column Column number
     * @returns {number} Row number
     */
    function firstFree(column)
    {
        return _board[column] < 6 ? _board[column] : null;
    }

    /**
     * Attempts a move.
     * 
     * @param {number} column Column number
     */
    function move(column)
    {
        if (_turn && firstFree(column) !== null)
        {
            _turn = false;
            _ws.send(JSON.stringify(new messages.O_MOVE(column)));
        }
    }

    /**
     * Gets the start time.
     * 
     * @returns {number} Start time
     */
    function getStart()
    {
        return _startTime;
    }

    return {
        init,
        getTurn,
        getPlayerName,
        getOpponentName,
        getType,
        addDisc,
        firstFree,
        move,
        getStart
    };
})();
