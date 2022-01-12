/* eslint-env node, es2021 */
const express = require("express");
const http = require("http");
const path = require("path");
const router = require(path.join(__dirname, "routes", "index.js"));

const websocket = require("ws");
const Game = require(path.join(__dirname, "game.js"));
const messages = require(path.join(__dirname, "public", "javascripts", "messages.js"));
const types = require(path.join(__dirname, "public", "javascripts", "types.js"));

// Use command line argument as port if valid, else use port 3000
const port = Number(process.argv[2]) > 0 && Number(process.argv[2]) <= 65535 ? Number(process.argv[2]) : 3000;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.disable("x-powered-by");

app.use("/", router);

// Create HTTP and WebSocket servers
const server = http.createServer(app);
const wss = new websocket.Server({ server });

// ---------- WebSocket ---------- //

let currentGame = new Game();

// On websocket connection received
wss.on("connection", (ws) =>
{
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
            }
        }

        // Player sends a move
        if (msgObj.type === messages.T_MOVE)
        {
            try
            {
                const result = game.move(playerType, msgObj.column);
                const opponent = game.getSocket(opponentType);

                // Normal move
                if (result.over === null)
                {
                    const message = JSON.stringify(new messages.O_MOVE(msgObj.column, result.row, playerType));
                    ws.send(message);
                    opponent.send(message);
                }
                // If game over, send move with result to players
                else
                {
                    const message = JSON.stringify(new messages.O_MOVE(msgObj.column, result.row, playerType, result.over));
                    ws.send(message);
                    opponent.send(message);

                    // Close connections
                    ws.close();
                    opponent.close();
                }
                // Send move to players
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

        if (code === 1001 && opponent !== null)
        {
            opponent.send(JSON.stringify(messages.O_QUIT));
            opponent.close();
        }
    });
});

server.listen(port, () =>
{
    console.log(`Listening on port ${port}. Press Ctrl-C to quit.`);
});
