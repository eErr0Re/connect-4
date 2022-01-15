/* eslint-env node, es2021 */
const express = require("express");
const stats = require("../stats");

const router = express.Router();

// Get splash screen
router.get("/", (req, res) =>
{
    const time = stats.getTimeSpent();
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor(time / 60000) % 60;

    res.render("splash.ejs", 
        {
            playersOnline: stats.getPlayersOnline(),
            gamesPlayed: stats.getGamesPlayed(),
            timeSpent: `${hours ? `${hours}h` : ""} ${minutes}min`
        });
});

// Get game screen
router.get("/play", (req, res) =>
{
    res.render("game.ejs");
});

module.exports = router;
