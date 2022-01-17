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

/* eslint-env browser, es2021 */

/** @typedef {import("./messages").Messages} Messages */
/** @typedef {import("./messages").MessageObject} MessageObject */

(() =>
{
    /** @type {WebSocket} WebSocket */
    let ws = null;

    /**
     * Starts a WebSocket connection
     */
    function connect()
    {
        queueScreen.enable();
        gameScreen.disable();
        endScreen.disable();

        // Open connection
        ws = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`);

        // On connection open, send username
        ws.addEventListener("open", () =>
        {
            const params = new URLSearchParams(window.location.search);
            const name = params.get("username");
            ws.send(JSON.stringify(new messages.O_JOIN(name === null || name === "" ? "anon" : name)));
        });

        // On message received
        ws.addEventListener("message", (msg) =>
        {   
            /** @type {MessageObject} Message object */
            const msgObj = JSON.parse(msg.data);
            
            // Received game info
            if (msgObj.type === messages.T_GAME_INFO)
            {
                // Initialise game
                game.init(msgObj.user1, msgObj.user2, msgObj.playerType, ws);
                gameScreen.enable();
                queueScreen.disable();
            }

            // Received a move
            if (msgObj.type === messages.T_MOVE)
            {
                // Draw disc
                game.addDisc(msgObj.column, msgObj.playerType);
                gameScreen.addDisc(msgObj.column, msgObj.row, msgObj.playerType);

                // A player has won
                if (msgObj.result === types.WIN)
                {
                    ws = null;
                    if (msgObj.playerType === game.getType())
                        endScreen.enable(types.WIN);
                    else endScreen.enable(types.LOSE);
                    gameScreen.stopTimer();
                }
                // The game is a draw
                else if (msgObj.result === types.DRAW)
                {
                    ws = null;
                    endScreen.enable(types.DRAW);
                    gameScreen.stopTimer();
                }
                else gameScreen.setTurn();
            }

            // The opponent has quit the game
            if (msgObj.type === messages.T_QUIT)
            {
                ws = null;
                endScreen.enable(messages.T_QUIT);
                gameScreen.stopTimer();
            }
        });
    }

    // New match button: on click, create a new connection
    const newMatchButton = document.querySelector("#end-screen button");
    newMatchButton.addEventListener("click", () =>
    {
        if (ws === null)
        {
            connect();
            gameScreen.clear();
        }
    });

    // Make first connection
    connect();
})();
