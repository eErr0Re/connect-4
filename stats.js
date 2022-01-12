/* eslint-env node, es2021 */
const stats = (() =>
{
    // ---------- Private variables ---------- //

    let _playersOnline = 0;
    let _gamesPlayed = 0;
    let _timeSpent = 0;

    
    // ---------- Public methods ---------- //

    /**
     * Increments the number of players online.
     */
    function addPlayer()
    {
        ++_playersOnline;
    }

    /**
     * Decrements the number of players online.
     */
    function removePlayer()
    {
        --_playersOnline;
    }

    /**
     * Gets the number of players online.
     * 
     * @returns {number} Number of players online
     */
    function getPlayersOnline()
    {
        return _playersOnline;
    }

    /**
     * Increments the number of games played.
     */
    function addGame()
    {
        ++_gamesPlayed;
    }

    /**
     * Gets the number of games played.
     * 
     * @returns {number} Number of games played
     */
    function getGamesPlayed()
    {
        return _gamesPlayed;
    }

    /**
     * Increases the total time spent.
     * 
     * @param {number} time Time in milliseconds
     */
    function addTimeSpent(time)
    {
        _timeSpent += time;
    }

    /**
     * Gets the total time spent.
     * 
     * @returns {number} Total time spent in milliseconds
     */
    function getTimeSpent()
    {
        return _timeSpent;
    }

    return {
        addPlayer,
        removePlayer,
        getPlayersOnline,
        addGame,
        getGamesPlayed,
        addTimeSpent,
        getTimeSpent
    };
})();

module.exports = stats;
