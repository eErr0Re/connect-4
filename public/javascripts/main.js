/* eslint-env browser, es2021 */
(() =>
{
    let ws = null;
    function connect()
    {
        queueScreen.enable();
        gameScreen.disable();
        endScreen.disable();

        // Open connection
        ws = new WebSocket(`ws://${window.location.host}`);

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
            // Parse message
            const msgObj = JSON.parse(msg.data);
            
            // Received game info
            if (msgObj.type === messages.T_GAME_INFO)
            {
                // Initialise game
                game.init(msgObj.user1, msgObj.user2, msgObj.playerType, msgObj.startTime, ws);
                gameScreen.enable();
                queueScreen.disable();
            }

            // Received a move
            if (msgObj.type === messages.T_MOVE)
            {
                // A player has won
                if (msgObj.result === types.WIN)
                {
                    if (msgObj.playerType === game.getType())
                        endScreen.enable(types.WIN);
                    else endScreen.enable(types.LOSE);
                    gameScreen.stopTimer();
                }
                // The game is a draw
                else if (msgObj.result === types.DRAW)
                {
                    endScreen.enable(types.DRAW);
                    gameScreen.stopTimer();
                }
                // Normal move
                else
                {
                    game.addDisc(msgObj.column, msgObj.playerType);
                    gameScreen.addDisc(msgObj.column, msgObj.row, msgObj.playerType);
                }
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
            connect();
    });

    // Make first connection
    connect();
})();