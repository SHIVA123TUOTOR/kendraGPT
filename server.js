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
                model: "llama3-70b-8192", // ✅ working model
                messages: [
                    {
                        role: "system",
                        content: "You are KendraGPT, a chill teenage boy. Talk casual, funny, short replies like a real friend."
                    },
                    {
                        role: "user",
                        content: userText
                    }
                ]
            })
        });

        const data = await response.json();

        // Debug log (helps if anything breaks again)
        console.log("Groq response:", data);

        if (!data.choices) {
            return res.json({
                reply: "API Error: " + JSON.stringify(data)
            });
        }

        const reply = data.choices[0].message.content;
        res.json({ reply });

    } catch (err) {
        console.error("Server error:", err);
        res.json({ reply: "Server error 😢" });
    }
});

// ✅ Proper port handling for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});
