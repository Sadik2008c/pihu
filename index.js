const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    const userAgent = req.headers['user-agent'];
    console.log('🔥 TARGET CLICKED THE LINK! 🔥');
    console.log('Device Info (User-Agent):', userAgent);
    console.log('--------------------------------------------------');
    res.redirect('https://wallpapercave.com/wp/wp11915383.jpg');
});

app.listen(PORT, () => {
    console.log(`Server is running...`);
});
