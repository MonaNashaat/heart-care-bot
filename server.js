const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }]
        }, {
            headers: { 
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`, 
                'Content-Type': 'application/json' 
            }
        });

        const reply = response.data.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: 'حدث خطأ. يرجى المحاولة مرة أخرى.' });
    }
});

app.listen(port, () => console.log(`Bot running on port ${port}`));