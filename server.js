const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Use environment variable for API key
const API_KEY = process.env.API_KEY;

// Chat endpoint
app.post("/chat", async (req, res) => {
    const userText = req.body.message;

    if (!API_KEY) {
        return res.json({ reply: "API key missing 😢" });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    {
                        role: "system",
                        content: "You are KendraGPT, a chill teenage boy. Talk like a real friend, casual, funny, short replies, sometimes use slang like bro, lol, wait."
                    },
                    {
                        role: "user",
                        content: userText
                    }
                ]
            })
        });

        const data = await response.json();

        const reply =
            data?.choices?.[0]?.message?.content ||
            "No response bro 🤔";

        res.json({ reply });

    } catch (err) {
        console.error("Error:", err);
        res.json({ reply: "Error connecting bro 😢" });
    }
});

// IMPORTANT: Use Render's dynamic port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
