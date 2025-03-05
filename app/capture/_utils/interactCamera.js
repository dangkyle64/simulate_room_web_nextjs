import { useEffect, useRef, useState } from 'react';

const InteractCamera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);

    useEffect(() => {
        const getCameraInput = async () => {
            try {
                const cameraStream  = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = cameraStream;
            } catch (error) {
                console.error('Error accessing camera: ', error);
            };
        };

        getCameraInput();

        return () => {
            if(videoRef.current) {
                const inputStream = video.Ref.current.srcObject;
                if(inputStream) {
                    const tracks = inputStream.getTracks();
                    tracks.ForEach((track) => track.stop());
                };
            };
        };
    }, []);
    
    const captureImage = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
    };

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }}></video>
            <button onClick={captureImage}>CapturePhoto</button>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            {capturedImage && <img src={capturedImage} alt="Captured" />};
        </div>
    );
};

export default InteractCamera;