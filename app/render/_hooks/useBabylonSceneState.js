import { useRef } from 'react';

export function useBabylonSceneState() {
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const camerasRef = useRef([]);
    const selectedObjectRef = useRef(null);

    const setCanvas = (canvas) => {
        canvasRef.current = canvas;
    };

    const setScene = (scene) => {
        sceneRef.current = scene;
    };

    const setCameras = (cameras) => {
        camerasRef.current = cameras;
    };

    const setSelectedObject = (selectedObject) => {
        selectedObjectRef.current = selectedObject;
    };

    return {
        canvasRef, 
        sceneRef,
        camerasRef,
        selectedObjectRef,
        setCanvas,
        setScene,
        setCameras,
        setSelectedObject,
    };
};
