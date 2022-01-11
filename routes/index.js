const express = require("express");
const path = require("path");

const router = express.Router();
const publicDirectory = path.join(__dirname, "..", "public");

router.get("/", (req, res) =>
{
    res.sendFile("splash.html", { root: publicDirectory });
});

router.get("/play", (req, res) =>
{
    res.sendFile("game.html", { root: publicDirectory });
});

module.exports = router;
