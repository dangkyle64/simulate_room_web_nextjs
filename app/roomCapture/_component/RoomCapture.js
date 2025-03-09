'use client'; //WHY 

import { useEffect, useRef, useState } from 'react';
import { initWebXR } from '../_utils/xrUtils';

export default function RoomCapture() {
    const [scanning, setScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    const [status, setStatus] = useState("Ready to scan");
    const [error, setError] = useState(null);

    const videoRef = useRef(null);

    useEffect(() => {
        const startCameraFeed = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: {ideal: 720 },
                    }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            } catch(error) {
                console.error("Error accessing the camera: ", error);
                setError("Failed to access the camera. Please check your device settings.")
            }
        };

        startCameraFeed();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const startScan = async () => {
        setScanning(true);
        const data = await initWebXR();
        setScannedData(data);
        setError(null);

        try {
            const data = await initWebXR(
                (newStatus) => setStatus(newStatus),
                (newError) => setError(newError)
            );
            setScannedData(data);
            setStatus("Scan complete");
        } catch(error) {
            console.error("Error during room scan: ", error);
            setStatus("Scan failed.");
            setError("An error occurred while scanning. Please try again.");
        } finally {
            setScanning(false);
        };
    };

    return (
        <div>
            <video
                ref={videoRef}
                style={{
                    position: 'absolute',
                    zIndex: -1,
                }}
                autoPlay
                muted
                playsInline
            />

            <button onClick={startScan} disabled={scanning}>
                {scanning ? 'Scanning...' : 'Start Room Scan'}
            </button>

            <div style={{ marginTop: '20px' }}>
                    <h3>Status: {status}</h3>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {scannedData && <pre>{JSON.stringify(scannedData, null, 2)}</pre>}
            </div>
        </div>
    )
}

