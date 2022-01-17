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
