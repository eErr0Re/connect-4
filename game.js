/* eslint-env node, es2021 */
// eslint-disable-next-line no-unused-vars
const websocket = require("ws");
const path = require("path");

const types = require(path.join(__dirname, "public", "javascripts", "types.js"));
const messages = require(path.join(__dirname, "public", "javascripts", "messages.js"));

class Game
{
    // ---------- Private variables ---------- //

    #player1;
    #player2;
    #name1;
    #name2;
    #turn;
    #startTime;
    #board;


    // ---------- Private methods ---------- //

    /**
     * Adds a disc to the board.
     * 
     * @param {types} type Type of player 
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
                break;
            }
        }
        return Number(row);
    }

    /**
     * Checks whether the game has ended.
     * 
     * @param {types} type Type of player
     * @param {number} column Column number
     * @param {number} row Row number
     * @returns {types} Result (Win or Draw)
     */
    #evaluate(type, column, row)
    {
        return null;
        // TODO: Proper game logic

        // If win
        // return types.WIN;

        // If draw
        // return types.DRAW;

        // Else
        // return null;
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
     * @return {types} Type of player
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
     * @param {types} type Type of player
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
     * @param {types} type Type of player 
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
     * @param {types} type Type of player 
     * @returns {messages} Information about the game
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
     * @param {types} type Type of player
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
     * @param {types} type Type of player
     * @param {number} column Column number
     * @returns {types} Result
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
            over: this.#evaluate(type, column, row) 
        };
    }

    /**
     * Clear the socket of player.
     * 
     * @param {types} type Type of player 
     */
    clearSocket(type)
    {
        if (type === types.PLAYER_1)
            this.#player1 = null;
        else if (type === types.PLAYER_2)
            this.#player2 = null;
        else throw new Error("Invalid type");
    }

    start()
    {
        this.#startTime = Date.now();
    }
}

module.exports = Game;
