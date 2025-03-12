import { useRoomCaptureState } from '../_hooks/useRoomCaptureState';
import { useWebXR } from '../_hooks/useWebXR';
import styles from './RoomCameraControl.module.css';

const RoomCameraControl = () => {

    const { isCameraStarted, videoRef, startRoomCamera, stopRoomCamera } = useRoomCaptureState();
    const { session, xrError, handleStartARSession } = useWebXR();

    console.log(session);
    return (
        <div className={styles.container}>
            <button className={styles.button} onClick={() => {
                if (isCameraStarted) {
                    stopCameraFeed(videoRef, startRoomCamera); 
                } else {
                    startCameraFeed(videoRef, stopRoomCamera); 
                }
            }}>
                {isCameraStarted ? 'Stop Camera' : 'Start Camera'}
            </button>

             {/* Start AR session on button click */}
             <button className={styles.buttonAR} onClick={handleStartARSession}>
                Start AR Session
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

export const startCameraFeed = async (videoRef, startRoomCameraFunction) => {
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
            videoRef.current.muted = true;

            try {
                await videoRef.current.play();
            } catch(error) {
                console.error('Error starting video playback: ', error);
            };
        };

        startRoomCameraFunction();
    } catch(error) {
        alert('Error accessing the camera.')
        console.error("Error accessing the camera: ", error);
    };
};

export const stopCameraFeed = async (videoRef, stopRoomCameraFunction) => {
    if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop())
    };

    stopRoomCameraFunction();
};