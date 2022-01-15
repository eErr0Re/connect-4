/* eslint-env node, es2021 */
// eslint-disable-next-line no-unused-vars
const websocket = require("ws");

const types = require("./public/javascripts/types");
const messages = require("./public/javascripts/messages");

/** @typedef {import("./public/javascripts/types").PlayerType} PlayerType} */
/** @typedef {import("./public/javascripts/types").ResultType} ResultType} */
/** @typedef {import("./public/javascripts/messages").MessageObject} MessageObject} */

/**
 * @typedef MoveResult
 * @type {object}
 * @property {number} row Row number
 * @property {?ResultType} result Result
 */

class Game
{
    // ---------- Private variables ---------- //

    /** @type {websocket} Player 1 WebSocket*/
    #player1;
    /** @type {websocket} Player 2 WebSocket */ 
    #player2;
    /** @type {string} Player 1 name */
    #name1;
    /** @type {string} Player 2 name */
    #name2;
    /** @type {PlayerType} Whose turn is it */
    #turn;
    /** @type {number} Start time */
    #startTime;
    /** @type {PlayerType[][]} Game board */
    #board;
    /** @type {number} Number of discs */
    #numberOfDiscs;


    // ---------- Private methods ---------- //

    /**
     * Adds a disc to the board.
     * 
     * @param {PlayerType} type Type of player 
     * @param {number} column Column number
     * @returns {number} Index of the first free row
     */
    #addToBoard(type, column)
    {
        let row;
        for (const i in this.#board[column])
        {
            if (this.#board[column][i] === null)
            {
                this.#board[column][i] = type;
                row = i;
                ++this.#numberOfDiscs;
                break;
            }
        }
        return Number(row);
    }

    /**
     * Checks whether the game has ended.
     * 
     * @param {PlayerType} type Type of player
     * @param {number} column Column number
     * @param {number} row Row number
     * @returns {?ResultType} Result (Win or Draw)
     */
    #evaluate(type, column, row)
    {
        // ----- Check if win ----- //

        // Check column
        if (row >= 3)
        {
            let win = true;
            for (let i = 1; i < 4; ++i)
            {
                if (this.#board[column][row - i] !== type)
                {
                    win = false;
                    break;
                }
            }
            if (win)
                return types.WIN;
        }

        // Check row
        let num = 1;

        // Check left of disc
        for (let i = column - 1; i >= 0; --i)
        {
            if (this.#board[i][row] === type)
                ++num;
            else break;
        }

        // Check right of disc
        for (let i = column + 1; i < 7; ++i)
        {
            if (this.#board[i][row] === type)
                ++num;
            else break;
        }

        if (num >= 4)
            return types.WIN;

        // Check down diagonal
        num = 1;

        // Check left of disc
        for (let c = column - 1, r = row + 1; c >= 0 && r < 6; --c, ++r)
        {
            if (this.#board[c][r] === type)
                ++num;
            else break;
        }

        // Check right of disc
        for (let c = column + 1, r = row - 1; c < 7 && r >= 0; ++c, --r)
        {
            if (this.#board[c][r] === type)
                ++num;
            else break;
        }

        if (num >= 4)
            return types.WIN;

        // Check up diagonal
        num = 1;

        // Check left of disc
        for (let c = column - 1, r = row - 1; c >= 0 && r >= 0; --c, --r)
        {
            if (this.#board[c][r] === type)
                ++num;
            else break;
        }

        // Check right of disc
        for (let c = column + 1, r = row + 1; c < 7 && r < 6; ++c, ++r)
        {
            if (this.#board[c][r] === type)
                ++num;
            else break;
        }

        if (num >= 4)
            return types.WIN;


        // ----- Check if draw ----- //

        if (this.#numberOfDiscs === 42)
            return types.DRAW;


        // ----- Normal move ----- //

        return null;
    }


    // ---------- Public methods ---------- //

    /**
     * Constructs the object.
     */
    constructor()
    {
        this.#player1 = null;
        this.#player2 = null;
        this.#name1 = null;
        this.#name2 = null;
        this.#turn = types.PLAYER_1;
        this.#numberOfDiscs = 0;

        // Bottom-left: (0, 0); Top-right: (6, 5)
        this.#board = [];
        for (let i = 0; i < 7; ++i)
        {
            const row = [];
            for (let j = 0; j < 6; ++j)
                row[j] = null;
            this.#board[i] = row;
        }
    }

    /**
     * Returns wheteher the game is full.
     * 
     * @returns {boolean} Is game full
     */
    isFull()
    {
        return this.#player1 !== null && this.#player2 !== null;
    }

    /**
     * Adds a player to the game.
     * 
     * @param {websocket} ws WebSocket
     * @return {PlayerType} Type of player
     */
    addPlayer(ws)
    {
        if (this.#player1 === null)
        {
            this.#player1 = ws;
            return types.PLAYER_1;
        }

        if (this.#player2 === null)
        {
            this.#player2 = ws;
            return types.PLAYER_2;
        }

        throw new Error("The game is already full");
    }

    /**
     * Sets the name of the player.
     * 
     * @param {PlayerType} type Type of player
     * @param {string} name Player name
     */
    setName(type, name)
    {
        if (type === types.PLAYER_1)
            this.#name1 = name;
        else if (type === types.PLAYER_2)
            this.#name2 = name;
        else throw new Error("Invalid type");
    }

    /**
     * Gets the name of the player.
     * 
     * @param {PlayerType} type Type of player 
     * @returns {string} Player name
     */
    getName(type)
    {
        if (type === types.PLAYER_1)
            return this.#name1;
        if (type === types.PLAYER_2)
            return this.#name2;
        throw new Error("Invalid type");
    }

    /**
     * Gets a message object containing information about the game.
     * 
     * @param {PlayerType} type Type of player 
     * @returns {MessageObject} Information about the game
     */
    getInfo(type)
    {
        if (type !== types.PLAYER_1 && type !== types.PLAYER_2)
            throw new Error("Invalid type");
        return new messages.O_GAME_INFO(this.#name1, this.#name2, type, this.#startTime);
    }

    /**
     * Gets the websocket of the player.
     * 
     * @param {PlayerType} type Type of player
     * @returns {websocket} WebSocket of the player
     */
    getSocket(type)
    {
        if (type === types.PLAYER_1)
            return this.#player1;
        if (type === types.PLAYER_2)
            return this.#player2;
        throw new Error("Invalid type");
    }

    /**
     * Attempts to perform a move.
     * 
     * @param {PlayerType} type Type of player
     * @param {number} column Column number
     * @returns {MoveResult} Result
     */
    move(type, column)
    {
        if (this.#turn !== type || !this.isFull())
            throw new Error("Invalid turn");
        if (this.#board[column][5] !== null)
            throw new Error("Column already full");
        if (type !== types.PLAYER_1 && type !== types.PLAYER_2)
            throw new Error("Invalid type");
        const row = this.#addToBoard(type, column);
        this.#turn = !this.#turn;
        return {
            row, 
            result: this.#evaluate(type, column, row) 
        };
    }

    /**
     * Clear the socket of player.
     * 
     * @param {PlayerType} type Type of player 
     */
    clearSocket(type)
    {
        if (type === types.PLAYER_1)
            this.#player1 = null;
        else if (type === types.PLAYER_2)
            this.#player2 = null;
        else throw new Error("Invalid type");
    }

    /**
     * Sets the start time.
     */
    start()
    {
        this.#startTime = Date.now();
    }

    /**
     * Gets the start time of the game.
     * 
     * @returns {number} Start time of the game
     */
    getStart()
    {
        return this.#startTime;
    }
}

module.exports = Game;
