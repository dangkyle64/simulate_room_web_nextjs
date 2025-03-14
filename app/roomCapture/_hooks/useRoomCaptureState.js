import { useState, useRef } from 'react';

export const useRoomCaptureState = () => {
    const [isCameraStarted, setIsCameraStarted] = useState(false);
    const [session, setSession] = useState(null);
    const [isSessionEnded, setIsSessionEnded] = useState(false);
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

    const toggleIsSessionEnded = () => {
        setIsSessionEnded(!isSessionEnded);
    };

    return {
        isCameraStarted,
        videoRef,
        session,
        referenceSpace,
        isSessionEnded,
        startRoomCamera,
        stopRoomCamera,
        setSessionState,
        setReferenceSpaceState,
        toggleIsSessionEnded,
    };
};