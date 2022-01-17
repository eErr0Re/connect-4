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

/* eslint-env node, es2021 */
const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const websocket = require("ws");

const router = require("./routes/index");
const Game = require("./game");
const messages = require("./public/javascripts/messages");
const types = require("./public/javascripts/types");
const stats = require("./stats");

/** @typedef {import("./public/javascripts/messages").MessageObject} MessageObject} */
/** @typedef {import("./game").MoveResult} MoveResult} */

// Get config file
const config = (() => 
{
    try
    {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")).toString());
    }
    catch (err)
    {
        console.error(`Could not open config file. ${err.message}`);
    }
    return {};
})();

/**
 * Validates the port number. If invalid returns an alternative port number.
 * 
 * @param {number} port Port number 
 * @param {number=} alt Alternative port number 
 * @returns {number} A valid port number
 */
function validatePort(port, alt = 3000)
{
    return port > 0 && port <= 65535 ? port : alt;
}

// Set port numbers
const httpPort = validatePort(config.httpPort, 8080);
const httpsPort = validatePort(config.httpsPort, 8443);

const app = express();
app.disable("x-powered-by");
app.set("view engine", "ejs");

// Create HTTP server
const httpServer = http.createServer(app);

// Create HTTPS server
let httpsServer = null;
if (config.https === true)
{
    const https = require("https");

    let options;
    try
    {
        options =
        {
            key: fs.readFileSync(config.key),
            cert: fs.readFileSync(config.cert)
        };
    }
    catch (err)
    {
        console.log(`Could not open certificate file. ${err.message}\nAdd certificate or disable https in config.json`);
        process.exit(1);
    }

    httpsServer = https.createServer(options, app);

    // Redirect http to https
    app.use((req, res, next) =>
    {
        if (req.secure)
            next();
        else res.redirect(`https://${req.hostname}${req.path}`);
    });
}

app.use(express.static(path.join(__dirname, "public")));

// Get statistics
app.get("/statistics", (req, res) =>
{
    const statistics = new messages.O_STATISTICS(stats.getPlayersOnline(), stats.getGamesPlayed(), stats.getTimeSpent());
    res.json(statistics);
});


app.use("/", router);

// Not found
app.use((req, res) => 
{
    res.status(404);
    res.render("error",
        {
            code: "404",
            color: "#d5996e",
            message: "Resource not found"
        });
});

// Server error
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => 
{
    res.status("500");
    res.render("error",
        {
            code: "500",
            color: "#6ebbd5",
            message: "Server error"
        });
});

// ---------- WebSocket ---------- //

const wss = new websocket.Server({ server: (config.https === true ? httpsServer : httpServer) });

let currentGame = new Game();

// On websocket connection received
wss.on("connection", (ws) =>
{
    // Update players online
    stats.addPlayer();

    const game = currentGame;

    // Set the player and opponent type
    const playerType = game.addPlayer(ws);
    const opponentType = playerType === types.PLAYER_1 ? types.PLAYER_2 : types.PLAYER_1;

    // On websocket message received
    ws.on("message", (msg) =>
    {
        // Parse message
        /** @type {MessageObject} Message object*/
        const msgObj = JSON.parse(msg.toString());

        // Player sends their username
        if (msgObj.type === messages.T_JOIN)
        {
            // Set the username
            game.setName(playerType, msgObj.user.substr(0, 10));

            // If all players have joined, send game info to players
            if (game.isFull())
            {
                currentGame = new Game(); // Create a new game for next players
                game.start();
                ws.send(JSON.stringify(game.getInfo(playerType)));
                game.getSocket(opponentType).send(JSON.stringify(game.getInfo(opponentType)));

                // Update games played
                stats.addGame();
            }
        }

        // Player sends a move
        if (msgObj.type === messages.T_MOVE)
        {
            try
            {
                /** @type {MoveResult} Move result */
                const moveResult = game.move(playerType, msgObj.column);
                const opponent = game.getSocket(opponentType);

                // Normal move
                const message = JSON.stringify(new messages.O_MOVE(msgObj.column, moveResult.row, playerType, moveResult.result));
                ws.send(message);
                opponent.send(message);
                // If game over, close connections
                if (moveResult.result !== null)
                {
                    ws.close();
                    opponent.close();

                    // Update total time
                    stats.addTimeSpent(Date.now() - game.getStart());
                }
            }
            catch (err)
            {
                console.error(err.message);
            }
        }
    });

    // On connection closed
    ws.on("close", (code) =>
    {
        const opponent = game.getSocket(opponentType);

        game.clearSocket(playerType);
        ws.close();

        if ((code === 1001 || code === 1006) && opponent !== null)
        {
            // Update total time
            stats.addTimeSpent(Date.now() - game.getStart());

            opponent.send(JSON.stringify(messages.O_QUIT));
            opponent.close();
        }

        // Update players online
        stats.removePlayer();
    });
});

httpServer.listen(httpPort, () =>
{
    console.log(`HTTP server listening on port ${httpPort}.`);
});

if (httpsServer !== null)
{
    httpsServer.listen(httpsPort, () =>
    {
        console.log(`HTTPS server listening on port ${httpsPort}`);
    });
}
