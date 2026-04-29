const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const API_KEY = process.env.API_KEY;

app.post("/chat", async (req, res) => {
const userText = req.body.message;

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
content: "You are KendraGPT, a chill teenage boy. Talk like a real friend, funny, casual, short replies, sometimes use slang like bro, lol, wait."
},
{
role: "user",
content: userText
}
]
})
});

const data = await response.json();
res.json({ reply: data.choices[0].message.content });

} catch (err) {
console.error(err);
res.json({ reply: "Error bro 😢" });
}
});

app.listen(3000, () => {
console.log("KendraGPT running on port 3000");
});