/* eslint-env node, es2021 */

// ---------- Private variables ---------- //

let _playersOnline = 0;
let _gamesPlayed = 0;
let _timeSpent = 0;

    
// ---------- Public methods ---------- //

/**
 * Increments the number of players online.
 */
module.exports.addPlayer = () =>
{
    ++_playersOnline;
};

/**
 * Decrements the number of players online.
 */
module.exports.removePlayer = () =>
{
    --_playersOnline;
};

/**
 * Gets the number of players online.
 * 
 * @returns {number} Number of players online
 */
module.exports.getPlayersOnline = () =>
{
    return _playersOnline;
};

/**
 * Increments the number of games played.
 */
module.exports.addGame = () =>
{
    ++_gamesPlayed;
};

/**
 * Gets the number of games played.
 * 
 * @returns {number} Number of games played
 */
module.exports.getGamesPlayed = () =>
{
    return _gamesPlayed;
};

/**
 * Increases the total time spent.
 * 
 * @param {number} time Time in milliseconds
 */
module.exports.addTimeSpent = (time) =>
{
    _timeSpent += time;
};

/**
 * Gets the total time spent.
 * 
 * @returns {number} Total time spent in milliseconds
 */
module.exports.getTimeSpent = () =>
{
    return _timeSpent;
};
