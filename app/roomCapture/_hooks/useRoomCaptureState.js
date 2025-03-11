import { useState, useRef } from 'react';

export const useRoomCaptureState = () => {
    const [isCameraStarted, setIsCameraStarted] = useState(false);
    
    const videoRef = useRef(null);

    const startRoomCamera = () => {
        setIsCameraStarted(true);
    };

    const stopRoomCamera = () => {
        setIsCameraStarted(false);
    };

    return {
        isCameraStarted,
        videoRef,
        startRoomCamera,
        stopRoomCamera,
    };
};