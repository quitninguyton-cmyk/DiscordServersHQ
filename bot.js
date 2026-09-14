require("dotenv").config();

const {
Client,
GatewayIntentBits,
EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMembers
]
});

const DATABASE_FILE =
path.join(
__dirname,
"database.json"
);

/* =========================
DATABASE
========================= */

function loadDatabase() {
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
```

}

/* =========================
BOT READY
========================= */

client.once(
"ready",
() => {

```
    console.log(
        "🤖 Logged in as " +
        client.user.tag
    );

    console.log(
        "🏆 Creator HQ Leaderboard Bot is online!"
    );

    client.user.setActivity(
        "Creator HQ Leaderboard",
        {
            type: 3
        }
    );
}
```

);

/* =========================
COMMANDS
========================= */

client.on(
"interactionCreate",
async interaction => {

```
    if (!interaction.isChatInputCommand()) {
        return;
    }

    if (
        interaction.commandName ===
        "leaderboard"
    ) {

        const database =
            loadDatabase();

        const players =
            Object.values(
                database.players
            );

        players.sort(
            (a, b) => b.xp - a.xp
        );

        const topPlayers =
            players.slice(0, 10);

        if (topPlayers.length === 0) {

            return interaction.reply(
                "🏆 The leaderboard is empty!"
            );
        }

        let description = "";

        topPlayers.forEach(
            (player, index) => {

                let medal;

                if (index === 0) {
                    medal = "🥇";
                } else if (index === 1) {
                    medal = "🥈";
                } else if (index === 2) {
                    medal = "🥉";
                } else {
                    medal =
                        `**#${index + 1}**`;
                }

                description +=
                    `${medal} **${player.username}** — ⭐ ${player.xp.toLocaleString()} XP\n`;
            }
        );

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "🏆 Creator HQ Leaderboard"
                )
                .setDescription(
                    description
                )
                .setFooter({
                    text:
                        "Creator HQ Ultimate Battle"
                });

        await interaction.reply({
            embeds: [embed]
        });
    }
}
```

);

/* =========================
LOGIN
========================= */

client.login(
process.env.DISCORD_TOKEN
);

