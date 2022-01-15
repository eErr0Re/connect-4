/* eslint-env node, es2021 */
const fs = require("fs").promises;
const path = require("path");

// ---------- Private variables ---------- //

let _playersOnline = 0;

const _savedStats =
{
    gamesPlayed: 0,
    timeSpent: 0
};

// Read saved statistics
fs.readFile(path.join(__dirname, "stats.json"))
    .then((data) =>
    {
        const json = JSON.parse(data.toString());
        _savedStats.gamesPlayed = json.gamesPlayed;
        _savedStats.timeSpent = json.timeSpent;
    })
    .catch(() =>
    {
        fs.writeFile(path.join(__dirname, "stats.json"), JSON.stringify(_savedStats));
        console.log("Created stats.json");
    });


// ---------- Private methods ---------- //

/**
 * Save statistics to stats.json
 */
function _save()
{
    fs.writeFile(path.join(__dirname, "stats.json"), JSON.stringify(_savedStats));
}
    

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
    ++_savedStats.gamesPlayed;
    _save();
};

/**
 * Gets the number of games played.
 * 
 * @returns {number} Number of games played
 */
module.exports.getGamesPlayed = () =>
{
    return _savedStats.gamesPlayed;
};

/**
 * Increases the total time spent.
 * 
 * @param {number} time Time in milliseconds
 */
module.exports.addTimeSpent = (time) =>
{
    _savedStats.timeSpent += time;
    _save();
};

/**
 * Gets the total time spent.
 * 
 * @returns {number} Total time spent in milliseconds
 */
module.exports.getTimeSpent = () =>
{
    return _savedStats.timeSpent;
};
