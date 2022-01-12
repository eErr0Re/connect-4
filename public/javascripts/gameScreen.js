/* eslint-env browser, es2021 */
/* exported gameScreen */

const gameScreen = (() =>
{
    // ---------- Private variables ---------- //

    /** @type {HTMLElement} Game screen */
    const _screen = document.querySelector("#game-screen");
    /** Players text */
    const _playersText = _screen.querySelector("h2");
    /** Turn text */
    const _turnText = _screen.querySelectorAll("h2")[1];

    /** @type {string} Player name */
    let _player = null;
    /** @type {string} Opponent name */
    let _opponent = null;
    /** @type {string} Player colour */
    let _colour = null;
    /** @type {number} Timer interval ID */
    let _timer = null;


    // ---------- Private methods ---------- //

    /**
     * Starts the timer.
     */
    function _startTimer()
    {
        /** Start time */
        const start = game.getStart();
        /** Timer text */
        const time = _screen.querySelector("h3");

        if (_timer !== null)
            clearInterval(_timer);

        time.innerHTML = "00:00";

        _timer = window.setInterval(() =>
        {
            const elapsed = Date.now() - start;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor(elapsed / 1000) % 60;

            time.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }, 200);
    }

    // Generate grid
    (() =>
    {
        /** @type {HTMLDivElement} Board */
        const board = document.querySelector("#board-grid");

        // TODO: Remove after adding proper CSS
        board.style.display = "grid"; 
        board.style.gridTemplateColumns = "repeat(7, 100px)";
        board.style.gap = "0";
        board.style.width = "fit-content";

        // Create columns
        for (let i = 0; i < 7; ++i)
        {
            const column = document.createElement("div");
            column.classList.add("column");

            // TODO: Remove after adding proper CSS
            column.style.width = "100px";
            column.style.height = "600px";

            /** Column number */
            const col = i;
            /** @type {HTMLDivElement[]} Cells */
            const children = [];

            // Create cells
            for (let j = 0; j < 6; ++j)
            {
                const disc = document.createElement("div");
                children[j] = disc;
                disc.classList.add("disc");

                // TODO: Remove after adding proper CSS
                disc.style.width = "100px";
                disc.style.height = "100px";
                disc.style.borderRadius = "50%";

                column.prepend(disc);
            }

            // If player's turn, on mouse enter, set disc colour
            column.addEventListener("mouseenter", () =>
            {
                if (!game.getTurn())
                    return;

                /** Index of the first free row */
                const index = game.firstFree(col);

                if (index !== null)
                    children[index].style.backgroundColor = _colour;
            });

            // On mouse leave, unset disc colour
            column.addEventListener("mouseleave", () =>
            {
                /** Index of the first free row */
                const index = game.firstFree(col);

                if (index !== null)
                    children[index].style.backgroundColor = "unset";
            });

            // On click, attempt move
            column.addEventListener("click", () =>
            {
                game.move(col);
            });

            board.append(column);
        }
    })();


    // ---------- Public methods ---------- //

    /**
     * Changes the turn text.
     */
    function setTurn()
    {
        if (game.getTurn())
            _turnText.innerHTML = "It's your turn"; // TODO: Add colour
        else _turnText.innerHTML = `Waiting for ${_opponent}`; // TODO: Add colour
    }

    /**
     * Adds a disc to the board.
     * 
     * @param {number} column Column number
     * @param {number} row Row number
     * @param {PlayerType} type Type of player
     */
    function addDisc(column, row, type)
    {
        /** @type {HTMLDivElement} Column */
        const col = (document.querySelectorAll(".column")[column]);
        /** @type {HTMLDivElement} Disc */
        const disc = (col.querySelectorAll(".disc")[5 - row]);

        disc.style.backgroundColor = type === types.PLAYER_1 ? "blue" : "orange"; // TODO: Use correct colour
    }
 
    /**
     * Stops the timer.
     */
    function stopTimer()
    {
        clearInterval(_timer);
        _timer = null;
    }

    /**
     * Enables the screen.
     */
    function enable()
    {
        _player = game.getPlayerName();
        _opponent = game.getOpponentName();
        _colour = game.getType() === types.PLAYER_1 ? "blue" : "orange"; // TODO: use correct colours

        _playersText.innerHTML = `${_player} | ${_opponent}`; // TODO: Add colour
        setTurn();
        _startTimer();

        _screen.hidden = false;
    }

    /**
     * Disables the screen.
     */
    function disable()
    {
        _screen.hidden = true;
    }

    /**
     * Resets all discs.
     */
    function clear()
    {
        /** @type {NodeListOf<HTMLDivElement>} Discs*/
        const discs = document.querySelectorAll(".disc");

        for (const d of discs)
            d.style.backgroundColor = "unset";
    }

    return {
        enable,
        disable,
        addDisc,
        stopTimer,
        clear,
        setTurn
    };
})();
