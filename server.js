const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Updated CORS configuration
app.use(cors({
    origin: ['https://suhaibk137.github.io', 'http://localhost:3000'],
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.post('/api/generate-cover-letter', async (req, res) => {
    // Add CORS headers explicitly
    res.header('Access-Control-Allow-Origin', 'https://suhaibk137.github.io');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: [{
                role: "user",
                content: req.body.prompt
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
