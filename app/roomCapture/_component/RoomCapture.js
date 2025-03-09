'use client'; //WHY 

import { useEffect, useRef, useState } from 'react';
import { initWebXR } from '../_utils/xrUtils';
import * as THREE from 'three';

export default function RoomCapture() {
    const [scanning, setScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    const [status, setStatus] = useState("Ready to scan");
    const [error, setError] = useState(null);

    const videoRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {
        const initThreeJS = () => {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true });

            renderer.xr.enabled = true;

            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            sceneRef.current = scene;
            rendererRef.current = renderer;
            camera.position.z = 1;

            const animate = () => {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };

            animate();
        };

        initThreeJS();
    }, []);
    useEffect(() => {

        const startCameraFeed = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: {ideal: 720 },
                    }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            } catch(error) {
                console.error("Error accessing the camera: ", error);
                setError("Failed to access the camera. Please check your device settings.")
            }
        };

        startCameraFeed();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const startScan = async () => {
        setScanning(true);
        setError(null);

        try {
            await initWebXR((newScannedData) => {
                setScannedData(newScannedData); // Update the state with new surface data
                visualizeSurfaces(newScannedData.surfaces); // Visualize surfaces using Three.js
            }, rendererRef.current);
            setStatus("Scan complete");
        } catch(error) {
            console.error("Error during room scan: ", error);
            setStatus("Scan failed.");
            setError("An error occurred while scanning. Please try again.");
        } finally {
            setScanning(false);
        };
    };

    const visualizeSurfaces = (surfaces) => {
        const scene = sceneRef.current;

        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const geometry = new THREE.SphereGeometry(0.05, 16, 16);

        surfaces.forEach((surface) => {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(surface.postion.x, surface.position.y, surface.position.z);
            scene.add(mesh);
        });
    };

    return (
        <div>
            <video
                ref={videoRef}
                style={{
                    position: 'absolute',
                    zIndex: -1,
                }}
                autoPlay
                muted
                playsInline
            />

            <button onClick={startScan} disabled={scanning}>
                {scanning ? 'Scanning...' : 'Start Room Scan'}
            </button>

            <div style={{ marginTop: '20px' }}>
                    <h3>Status: {status}</h3>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {scannedData && <pre>{JSON.stringify(scannedData, null, 2)}</pre>}
            </div>
        </div>
    )
}

