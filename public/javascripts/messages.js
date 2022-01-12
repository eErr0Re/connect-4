/* eslint-env browser, es2021, node */
((exports) =>
{
    // Message send by client when joining game
    exports.T_JOIN = "JOIN";
    exports.O_JOIN = function(user)
    {
        this.type = exports.T_JOIN;
        this.user = user;
    };

    // Message sent by server when all players have joined
    exports.T_GAME_INFO = "GAME-INFO";
    exports.O_GAME_INFO = function(user1, user2, playerType, startTime)
    {
        this.type = exports.T_GAME_INFO;
        this.user1 = user1;
        this.user2 = user2;
        this.playerType = playerType;
        this.startTime = startTime;
    };

    /*
     * Message sent by client or server
     * If sent by server: playerType is set; if win/draw, result is set.
     */
    exports.T_MOVE = "MOVE";
    exports.O_MOVE = function(column, row = null, playerType = null, result = null)
    {
        this.type = exports.T_MOVE;
        this.column = column;
        this.row = row;
        this.playerType = playerType;
        this.result = result;
    };

    // Sent by server when opponent quits
    exports.T_QUIT = "QUIT";
    exports.O_QUIT = { type: exports.T_QUIT };
// @ts-ignore
})(typeof exports === "undefined" ? this.messages = {} : exports);
