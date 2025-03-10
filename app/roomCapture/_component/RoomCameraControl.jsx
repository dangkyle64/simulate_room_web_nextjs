import { useState, useRef } from 'react';

const RoomCameraControl = () => {
    const [isCameraStarted, setIsCameraStarted] = useState(false);
    const videoRef = useRef(null);

    return (
        <div>
            <button onClick={() => {
                if (isCameraStarted) {
                    stopCameraFeed(videoRef, setIsCameraStarted); 
                } else {
                    startCameraFeed(videoRef, setIsCameraStarted); 
                }
            }}>
                {isCameraStarted ? 'Stop Camera' : 'Start Camera'}
            </button>

            <video ref={videoRef} width="1280" height="720" style={{ marginTop: '20px', border: '1px solid #ccc' }} />
        </div>
    );
};

export default RoomCameraControl;

export const startCameraFeed = async (videoRef, setIsCameraStarted) => {
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

export const stopCameraFeed = async (videoRef, setIsCameraStarted) => {
    if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop())
    };

    setIsCameraStarted(false);
};