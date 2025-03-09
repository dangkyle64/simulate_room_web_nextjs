'use client'; //WHY 

import { useEffect, useState } from 'react';
import { initWebXR } from '../_utils/xrUtils';

export default function RoomCapture() {
    const [scanning, setScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    const startScan = async () => {
        setScanning(true);
        const data = await initWebXR();
        setScannedData(data);
    };

    return (
        <div>
            <button onClick={startScan} disabled={scanning}>
                {scanning ? 'Scanning...' : 'Start Room Scan'}
            </button>

            <div style={{ marginTop: '20px' }}>
                {scannedData && <pre>{ JSON.stringify(scannedData, null, 2) }</pre>}
            </div>
        </div>
    )
}

