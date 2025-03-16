import { useState, useRef } from 'react';

export const useRoomCaptureState = () => {
    const [isCameraStarted, setIsCameraStarted] = useState(false);
    const [session, setSession] = useState(null);
    const [isSessionEnded, setIsSessionEnded] = useState(false);
    const [referenceSpace, setReferenceSpace] = useState(null);
    const [hitTestSource, setHitTestSource] = useState(null);

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

    const setHitTestSourceState = (hitTestSource) => {
        setHitTestSource(hitTestSource);
    };

    return {
        isCameraStarted,
        videoRef,
        session,
        referenceSpace,
        isSessionEnded,
        hitTestSource,
        startRoomCamera,
        stopRoomCamera,
        setSessionState,
        setReferenceSpaceState,
        toggleIsSessionEnded,
        setHitTestSourceState,
    };
};