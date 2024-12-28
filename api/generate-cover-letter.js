const cors = require('cors');
const axios = require('axios');

const corsMiddleware = cors({
    origin: '*',
    methods: ['POST', 'OPTIONS']
});

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    await corsMiddleware(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

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
            console.error('Error:', error.response?.data || error.message);
            res.status(500).json({ error: error.message });
        }
    });
};