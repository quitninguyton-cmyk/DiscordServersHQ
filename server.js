require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

const DATABASE_FILE = path.join(
__dirname,
"database.json"
);

app.use(express.json());

/* =========================
DATABASE
========================= */

function loadDatabase() {
try {
if (!fs.existsSync(DATABASE_FILE)) {
return {
players: {}
};
}

```
    return JSON.parse(
        fs.readFileSync(
            DATABASE_FILE,
            "utf8"
        )
    );
} catch (error) {
    console.error(
        "Database error:",
        error
    );

    return {
        players: {}
    };
}
```

}

function saveDatabase(database) {
fs.writeFileSync(
DATABASE_FILE,
JSON.stringify(
database,
null,
2
)
);
}

/* =========================
API SECURITY
========================= */

function checkAPIKey(req, res, next) {
const key =
req.headers["x-api-key"];

```
if (!API_KEY) {
    return res.status(500).json({
        error: "API_KEY is not configured."
    });
}

if (key !== API_KEY) {
    return res.status(401).json({
        error: "Invalid API key."
    });
}

next();
```

}

/* =========================
HOME
========================= */

app.get("/", (req, res) => {
res.json({
success: true,
message: "⚡ Creator HQ Backend is online!"
});
});

/* =========================
GET LEADERBOARD
========================= */

app.get(
"/api/leaderboard",
(req, res) => {

```
    const database =
        loadDatabase();

    const players =
        Object.values(
            database.players
        );

    players.sort(
        (a, b) => b.xp - a.xp
    );

    const leaderboard =
        players.map(
            (player, index) => ({
                rank: index + 1,
                discordId: player.discordId,
                username: player.username,
                xp: player.xp,
                wins: player.wins,
                games: player.games
            })
        );

    res.json({
        success: true,
        leaderboard
    });
}
```

);

/* =========================
GET PLAYER
========================= */

app.get(
"/api/player/:discordId",
(req, res) => {

```
    const database =
        loadDatabase();

    const player =
        database.players[
            req.params.discordId
        ];

    if (!player) {
        return res.status(404).json({
            success: false,
            error: "Player not found."
        });
    }

    res.json({
        success: true,
        player
    });
}
```

);

/* =========================
CREATE / UPDATE PLAYER
========================= */

app.post(
"/api/player",
checkAPIKey,
(req, res) => {

```
    const {
        discordId,
        username
    } = req.body;

    if (!discordId || !username) {
        return res.status(400).json({
            success: false,
            error:
                "discordId and username are required."
        });
    }

    const database =
        loadDatabase();

    if (!database.players[discordId]) {

        database.players[discordId] = {
            discordId,
            username,
            xp: 0,
            wins: 0,
            games: 0
        };

    } else {

        database.players[
            discordId
        ].username = username;

    }

    saveDatabase(database);

    res.json({
        success: true,
        player:
            database.players[
                discordId
            ]
    });
}
```

);

/* =========================
ADD XP
========================= */

app.post(
"/api/xp",
checkAPIKey,
(req, res) => {

```
    const {
        discordId,
        username,
        amount,
        won
    } = req.body;

    if (
        !discordId ||
        !username ||
        typeof amount !== "number"
    ) {
        return res.status(400).json({
            success: false,
            error:
                "discordId, username and numeric amount are required."
        });
    }

    if (amount < 0 || amount > 1000) {
        return res.status(400).json({
            success: false,
            error:
                "XP amount must be between 0 and 1000."
        });
    }

    const database =
        loadDatabase();

    if (!database.players[discordId]) {

        database.players[discordId] = {
            discordId,
            username,
            xp: 0,
            wins: 0,
            games: 0
        };

    }

    const player =
        database.players[discordId];

    player.username = username;
    player.xp += amount;
    player.games++;

    if (won === true) {
        player.wins++;
    }

    saveDatabase(database);

    res.json({
        success: true,
        player
    });
}
```

);

/* =========================
SERVER
========================= */

app.listen(
PORT,
() => {
console.log(
"⚡ Creator HQ API running on port " +
PORT
);
}
);

