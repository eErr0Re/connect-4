/* eslint-env node, es2021 */
const express = require("express");
const http = require("http");
const path = require("path");
const router = require(path.join(__dirname, "routes", "index.js"));

const websocket = require("ws");
/** @type {typeof import("./game")} Game} */
const Game = require(path.join(__dirname, "game.js"));
/** @type {import("./public/javascripts/messages").Messages} Messages} */
const messages = require(path.join(__dirname, "public", "javascripts", "messages.js"));
/** @type {import("./public/javascripts/types").Types} Types} */
const types = require(path.join(__dirname, "public", "javascripts", "types.js"));
/** @type {typeof import("./stats")} Stats} */
const stats = require(path.join(__dirname, "stats.js"));

// Use command line argument as port if valid, else use port 3000
const port = Number(process.argv[2]) > 0 && Number(process.argv[2]) <= 65535 ? Number(process.argv[2]) : 3000;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.disable("x-powered-by");

app.use("/", router);

// Get statistics
app.get("/statistics", (req, res) =>
{
    const statistics = new messages.O_STATISTICS(stats.getPlayersOnline(), stats.getGamesPlayed(), stats.getTimeSpent());
    res.json(statistics);
});

// Create HTTP and WebSocket servers
const server = http.createServer(app);
const wss = new websocket.Server({ server });

// ---------- WebSocket ---------- //

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
        const msgObj = JSON.parse(msg.toString());

        // Player sends their username
        if (msgObj.type === messages.T_JOIN)
        {
            // Set the username
            game.setName(playerType, msgObj.user);

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

server.listen(port, () =>
{
    console.log(`Listening on port ${port}. Press Ctrl-C to quit.`);
});
