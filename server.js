const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const API_KEY = process.env.API_KEY;

app.post("/chat", async (req, res) => {
    const userText = req.body.message;

    if (!API_KEY) {
        return res.json({ reply: "API key missing 😢" });
    }

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                        content: "You are KendraGPT, a chill teenage boy. Talk casual, funny, short replies."
                    },
                    {
                        role: "user",
                        content: userText
                    }
                ]
            },
            {
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = response.data;

        if (!data.choices) {
            return res.json({ reply: "API Error: " + JSON.stringify(data) });
        }

        res.json({ reply: data.choices[0].message.content });

    } catch (err) {
        console.error("ERROR:", err.response?.data || err.message);

        res.json({
            reply: "ERROR: " + (err.response?.data?.error?.message || err.message)
        });
    }
});

// Render port fix
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});
