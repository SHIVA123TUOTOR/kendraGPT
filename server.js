const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));

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
                model: "llama3-8b-8192",
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
            })
        });

        const data = await response.json();

        if (!data.choices) {
            console.log("Groq error:", data);
            return res.json({ reply: "Error: " + JSON.stringify(data) });
        }

        res.json({ reply: data.choices[0].message.content });

    } catch (err) {
        console.error(err);
        res.json({ reply: "Server error 😢" });
    }
});

// 🔥 CRITICAL FIX
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});
