const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    const userAgent = req.headers['user-agent'];
    console.log('🔥 TARGET CLICKED THE LINK! 🔥');
    console.log('Device Info (User-Agent):', userAgent);
    console.log('--------------------------------------------------');
    res.redirect('https://images6.alphacoders.com/135/thumbbig-1358426.webp');
});

app.listen(PORT, () => {
    console.log(`Server is running...`);
});
