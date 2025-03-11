import { useState, useRef } from 'react';
import useRoomCaptureState from '../_hooks/useRoomCaptureState';

const RoomCameraControl = () => {

    const { isCameraStarted, videoRef, startRoomCamera, stopRoomCamera } = useRoomCaptureState();
    return (
        <div>
            <button onClick={() => {
                if (isCameraStarted) {
                    stopCameraFeed(videoRef, startRoomCamera); 
                } else {
                    startCameraFeed(videoRef, stopRoomCamera); 
                }
            }}>
                {isCameraStarted ? 'Stop Camera' : 'Start Camera'}
            </button>

            <video ref={videoRef} width="1280" height="720" style={{ marginTop: '20px', border: '1px solid #ccc' }} />
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
            videoRef.current.play();
        }

        startRoomCameraFunction();
    } catch(error) {
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