app.post("/chat", async (req, res) => {
    const userText = req.body.message;

    try {
        console.log("Incoming message:", userText);

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + process.env.API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    { role: "system", content: "You are KendraGPT, a chill teenage boy." },
                    { role: "user", content: userText }
                ]
            })
        });

        const text = await response.text(); // 👈 IMPORTANT
        console.log("Groq raw response:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return res.json({ reply: "Invalid JSON from API: " + text });
        }

        if (!data.choices) {
            return res.json({ reply: "API Error: " + text });
        }

        res.json({ reply: data.choices[0].message.content });

    } catch (err) {
        console.error("SERVER ERROR:", err);
        res.json({ reply: "SERVER ERROR: " + err.message });
    }
});
