((exports) =>
{
    // Player types
    exports.PLAYER_1 = true;
    exports.PLAYER_2 = false;

    // Result types
    exports.WIN = "WIN";
    exports.LOSE = "LOSE";
    exports.DRAW = "DRAW";
// @ts-ignore
})(typeof exports === "undefined" ? this.types = {} : exports);
