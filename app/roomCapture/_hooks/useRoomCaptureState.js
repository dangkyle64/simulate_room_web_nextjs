import { useState, useRef } from 'react';

export const useRoomCaptureState = () => {
    const [isCameraStarted, setIsCameraStarted] = useState(false);
    const [session, setSession] = useState(null);
    const [referenceSpace, setReferenceSpace] = useState(null);

    const videoRef = useRef(null);

    const startRoomCamera = () => {
        setIsCameraStarted(true);
    };

    const stopRoomCamera = () => {
        setIsCameraStarted(false);
    };

    const setSessionState = (session) => {
        setSession(session);
    };

    const setReferenceSpaceState = (referenceSpace) => {
        setReferenceSpace(referenceSpace);
    };

    return {
        isCameraStarted,
        videoRef,
        session,
        referenceSpace,
        startRoomCamera,
        stopRoomCamera,
        setSessionState,
        setReferenceSpaceState,
    };
};