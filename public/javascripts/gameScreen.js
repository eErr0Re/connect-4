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
    let _playerColour = null;
    /** @type  {string} Opponent colour*/
    let _opponentColour = null;
    /** @type {number} Timer interval ID */
    let _timer = null;
    /** @type {string} Player disc class */
    let _playerDisc = null;


    // ---------- Private methods ---------- //

    /**
     * Starts the timer.
     */
    function _startTimer()
    {
        /** Start time */
        const start = Date.now();
        /** Timer text */
        const time = _screen.querySelector("p");

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

        // Create columns
        for (let i = 0; i < 7; ++i)
        {
            const column = document.createElement("div");
            column.classList.add("column");

            /** Column number */
            const col = i;
            /** @type {HTMLDivElement[]} Cells */
            const children = [];

            // Create cells
            for (let j = 0; j < 6; ++j)
            {
                const disc = document.createElement("div");
                children[j] = disc;

                column.prepend(disc);
            }

            // If player's turn, on mouse enter, set disc colour
            column.addEventListener("mousemove", () =>
            {
                if (!game.getTurn())
                    return;

                /** Index of the first free row */
                const index = game.firstFree(col);

                if (index !== null)
                    children[index].classList.add(_playerDisc);
            });

            // On mouse leave, unset disc colour
            column.addEventListener("mouseleave", () =>
            {
                /** Index of the first free row */
                const index = game.firstFree(col);

                if (index !== null)
                    children[index].classList.remove(_playerDisc);
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
            _turnText.innerHTML = `<span class="${_playerColour}">It's your turn</span>`;
        else _turnText.innerHTML = `Waiting for <span class="${_opponentColour}">${_opponent}</span>`;
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
        const disc = (col.querySelectorAll("div")[5 - row]);

        disc.classList.add(type === types.PLAYER_1 ? "primary-disc" : "secondary-disc");
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
        
        if (game.getType() === types.PLAYER_1)
        {
            _playerColour = "text-primary";
            _opponentColour = "text-secondary";
            _playerDisc = "primary-disc";
        }
        else
        {
            _playerColour = "text-secondary";
            _opponentColour = "text-primary";
            _playerDisc = "secondary-disc";
        }

        _playersText.innerHTML = 
        `<span class="${_playerColour}">${_player}</span> | ` + 
        `<span class="${_opponentColour}">${_opponent}</span>`;
        
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
        const discs = document.querySelectorAll(".column div");

        for (const d of discs)
        {
            d.classList.remove("primary-disc");
            d.classList.remove("secondary-disc");
        }
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
