require("dotenv").config();

const {
REST,
Routes,
SlashCommandBuilder
} = require("discord.js");

const command =
new SlashCommandBuilder()
.setName("leaderboard")
.setDescription(
"Show the Creator HQ XP leaderboard"
)
.toJSON();

const rest =
new REST({
version: "10"
}).setToken(
process.env.DISCORD_TOKEN
);

async function register() {

```
try {

    console.log(
        "Registering /leaderboard..."
    );

    await rest.put(
        Routes.applicationGuildCommands(
            process.env.CLIENT_ID,
            process.env.DISCORD_GUILD_ID
        ),
        {
            body: [command]
        }
    );

    console.log(
        "✅ /leaderboard registered!"
    );

} catch (error) {

    console.error(error);

}
```

}

register();

