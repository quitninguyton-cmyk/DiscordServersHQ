async function sendXPToCreatorHQ(
    discordId,
    username,
    amount,
    won
) {
    const response = await fetch(
        "https://YOUR-BACKEND-URL.com/api/xp",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "x-api-key":
                    "YOUR_API_KEY"
            },

            body: JSON.stringify({
                discordId: discordId,
                username: username,
                amount: amount,
                won: won
            })
        }
    );

    return await response.json();
}
