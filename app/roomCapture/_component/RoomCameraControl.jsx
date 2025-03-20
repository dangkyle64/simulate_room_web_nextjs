import { useRoomCaptureState } from '../_hooks/useRoomCaptureState';
import { useWebXR } from '../_hooks/useWebXR';
import styles from './RoomCameraControl.module.css';
import { useState, useEffect } from 'react';

const RoomCameraControl = () => {

    const { videoRef, isSessionActive, setSessionNotActive, setSessionActive } = useRoomCaptureState();
    const { session, xrError, handleStartARSession, handleEndARSession } = useWebXR();

    console.log('Initial load', session);

    useEffect(() => {
        handleSessionValidation(session, setSessionNotActive, setSessionActive);
    }, [session]);

    return (
        <div className={styles.container}>
            <button id="xr-button" className={styles.buttonAR} onClick={() => {
                handleARSession(isSessionActive, setSessionNotActive, setSessionActive, handleEndARSession, handleStartARSession);
            }}>
                {session ? 'End AR Session' : 'Start AR Session'}
            </button>

            {/* Display WebXR session error, if any */}
            {xrError && <div className={styles.error}>{xrError}</div>}

            <video ref={videoRef} className={styles.video} />

            {/* Display AR session info if it's active */}
            {session && <div className={styles.arStatus}>AR Session Active!</div>}

            
            <div id="overlay" onClick={() => {
                handleARSession(isSessionActive, setSessionNotActive, setSessionActive, handleEndARSession, handleSessionValidation);
            }}>
                <button id="testButton">End Test Button</button>
            </div>
        </div>
    );
};

export default RoomCameraControl;

export const handleARSession = async (isSessionActive, setSessionNotActive, setSessionActive, handleEndARSession, handleStartARSession) => {
    try {
        if (isSessionActive) {
            await handleEndARSession();
            setSessionNotActive();
        } else {
            await handleStartARSession();
            setSessionActive();
        };
    } catch (error) {
        console.error('Error handling AR session:', error);
        throw error;
    };
};

export const handleSessionValidation = (session, setSessionNotActive, setSessionActive) => {
    if (session) {
        setSessionActive();
    } else {
        setSessionNotActive();
    };
};

