const express = require("express");

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
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // safer model
                messages: [
                    {
                        role: "system",
                        content: "You are KendraGPT, a chill teenage boy. Talk casually, funny, short replies like a real friend."
                    },
                    {
                        role: "user",
                        content: userText
                    }
                ]
            })
        });

        const data = await response.json();

        // 🔍 Debug output
        console.log("Groq response:", data);

        // ❗ Handle errors properly
        if (!data.choices) {
            return res.json({
                reply: "Groq error: " + JSON.stringify(data)
            });
        }

        const reply = data.choices[0].message.content;
        res.json({ reply });

    } catch (err) {
        console.error("Server error:", err);
        res.json({ reply: "Server error 😢" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
