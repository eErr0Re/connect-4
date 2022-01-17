/*
 * MIT License
 *
 * Copyright (c) 2022 Nils Marten Mikk
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* eslint-env browser, es2021, node */

/**
 * @typedef Messages
 * @type {object}
 * @property {MessageType} T_JOIN Join message type
 * @property {MessageType} T_GAME_INFO Info message type
 * @property {MessageType} T_MOVE Move message type
 * @property {MessageType} T_QUIT Quit message type
 * @property {function(string) : void} O_JOIN Constructs a join message
 * @property {function(string, string, PlayerType, number) : void} O_GAME_INFO Constructs an info message
 * @property {function(number, number=, PlayerType=, ResultType=) : void} O_MOVE Constructs a move message
 * @property {MessageObject} O_QUIT Quit message
 * @property {function(number, number, number) : void} O_STATISTICS Constructs a statistics message
 */

/**
 * @typedef MessageType
 * @type {string}
 */

/**
 * @typedef MessageObject
 * @type {object}
 * @property {MessageType} type Message type
 * @property {string=} user Name of player
 * @property {string=} user1 Name of player 1
 * @property {string=} user2 Name of player 2
 * @property {PlayerType=} playerType Type of player
 * @property {number=} column Column number
 * @property {number=} row Row number
 * @property {ResultType=} result Result
 */

/**
 * @typedef Statistics
 * @type {object}
 * @property {number} online Number of players online
 * @property {number} games Number of games played
 * @property {number} time Time spent in milliseconds
 */

((exports) =>
{
    // Message sent by client when joining game

    /** @type {MessageType} Join message type */
    exports.T_JOIN = "JOIN";
    /**
     * Constructs a join message.
     * 
     * @param {string} user Username
     */
    exports.O_JOIN = function(user)
    {
        this.type = exports.T_JOIN;
        this.user = user;
    };

    // Message sent by server when all players have joined

    /** @type {MessageType} Info message type */
    exports.T_GAME_INFO = "GAME-INFO";
    /**
     * Constructs an info message.
     * 
     * @param {string} user1 Name of player 1
     * @param {string} user2 Name of player 2
     * @param {PlayerType} playerType Type of player
     */
    exports.O_GAME_INFO = function(user1, user2, playerType)
    {
        this.type = exports.T_GAME_INFO;
        this.user1 = user1;
        this.user2 = user2;
        this.playerType = playerType;
    };

    /*
     * Message sent by client or server
     * If sent by server: playerType is set; if win/draw, result is set.
     */

    /** @type {MessageType} Move message type */
    exports.T_MOVE = "MOVE";
    /**
     * Constructs a move message.
     * 
     * @param {number} column Column number 
     * @param {number=} row Row number
     * @param {PlayerType=} playerType Type of player
     * @param {ResultType=} result Result
     */
    exports.O_MOVE = function(column, row = null, playerType = null, result = null)
    {
        this.type = exports.T_MOVE;
        this.column = column;
        this.row = row;
        this.playerType = playerType;
        this.result = result;
    };

    // Sent by server when opponent quits
    /** @type {MessageType} Quit message type */
    exports.T_QUIT = "QUIT";
    /** @type {MessageObject} Quit message */
    exports.O_QUIT = { type: exports.T_QUIT };

    // Statistics sent by server
    /**
     * Constructs a statistics message.
     * 
     * @param {number} online Number of players online
     * @param {number} games Number of games played
     * @param {number} time Time spent in milliseconds
     */
    exports.O_STATISTICS = function(online, games, time)
    {
        this.online = online;
        this.games = games;
        this.time = time;
    };
// @ts-ignore
})(typeof exports === "undefined" ? this.messages = {} : exports);
