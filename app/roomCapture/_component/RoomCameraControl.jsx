import { useRoomCaptureState } from '../_hooks/useRoomCaptureState';
import { useWebXR } from '../_hooks/useWebXR';
import styles from './RoomCameraControl.module.css';
import { useState, useEffect } from 'react';

const RoomCameraControl = () => {

    const { videoRef } = useRoomCaptureState();
    const { session, xrError, handleStartARSession, handleEndARSession } = useWebXR();

    console.log('Initial load', session);
    
    const [isSessionActive, setIsSessionActive] = useState(false);

    useEffect(() => {
        if (session) {
            setIsSessionActive(true);
        } else {
            setIsSessionActive(false);
        }
    }, [session]);

    return (
        <div className={styles.container}>
            <button className={styles.buttonAR} onClick={() => {
                handleARSession(isSessionActive, setIsSessionActive, handleEndARSession, handleStartARSession);
            }}>
                {session ? 'End AR Session' : 'Start AR Session'}
            </button>

            {/* Display WebXR session error, if any */}
            {xrError && <div className={styles.error}>{xrError}</div>}

            <video ref={videoRef} className={styles.video} />

            {/* Display AR session info if it's active */}
            {session && <div className={styles.arStatus}>AR Session Active!</div>}
        </div>
    );
};

export default RoomCameraControl;


export const handleARSession = async (isSessionActive, setIsSessionActive, handleEndARSession, handleStartARSession) => {
    try {
        if (isSessionActive) {
            await handleEndARSession();
            setIsSessionActive(false);
        } else {
            await handleStartARSession();
            setIsSessionActive(true);
        };
    } catch (error) {
        console.error('Error handling AR session:', error);
        throw error;
    };
};