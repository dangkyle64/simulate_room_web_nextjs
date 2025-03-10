import { useState, useRef } from 'react';

const RoomCameraControl = () => {
    const [isCameraStarted, setIsCameraStarted] = useState(false);
    const videoRef = useRef(null);

    const startCameraFeed = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: {ideal: 720 },
                },
            });
    
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
    
            setIsCameraStarted(true);
        } catch(error) {
            console.error("Error accessing the camera: ", error);
        };
    };

    const stopCameraFeed = async (videoRef, setIsCameraStarted) => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop())
        };
    
        setIsCameraStarted(false);
    };

    return (
        <div>
            {/* Button to toggle camera feed */}
            <button onClick={() => {
                if (isCameraStarted) {
                    stopCameraFeed(); // Stop camera feed if started
                } else {
                    startCameraFeed(); // Start camera feed if not started
                }
            }}>
                {isCameraStarted ? 'Stop Camera' : 'Start Camera'}
            </button>

            {/* Video element to display camera feed */}
            <video ref={videoRef} width="1280" height="720" style={{ marginTop: '20px', border: '1px solid #ccc' }} />
        </div>
    );
};

export default RoomCameraControl;