/* Appwrite Function: main.js 
   This runs securely in the cloud, hiding your webhook from the public.
*/
import fetch from 'node-fetch';

export default async ({ req, res, log, error }) => {
    // 1. Check if the request is a POST
    if (req.method !== 'POST') {
        return res.json({ success: false, message: 'Method not allowed' }, 405);
    }

    try {
        // 2. Parse the data from the website
        const payload = JSON.parse(req.body);
        const { discordUser, playfabId } = payload;

        if (!discordUser || !playfabId) {
            return res.json({ success: false, message: 'Missing fields' }, 400);
        }

        // 3. Prepare the message for Discord
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        const discordBody = {
            content: `🔗 **New Account Link Request**`,
            embeds: [{ 
                title: "Link Request: PROJECT PJ",
                color: 5814783, // Blurple color
                fields: [
                    { name: "Discord Username", value: `\`${discordUser}\``, inline: true },
                    { name: "PlayFab ID", value: `\`${playfabId}\``, inline: true },
                    { name: "Action Required", value: "Please assign the 'Linked' role." }
                ],
                footer: { text: "Sent via Appwrite Cloud" }
            }]
        };

        // 4. Send to Discord
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordBody)
        });

        if (response.ok) {
            return res.json({ success: true, message: 'Link request sent!' });
        } else {
            throw new Error('Failed to send to Discord');
        }

    } catch (err) {
        error(err.toString());
        return res.json({ success: false, message: 'Server error occurred.' }, 500);
    }
};