'use client';

import { BabylonScene } from './_components/BabylonScene/BabylonScene';
import FurnitureMenuBase from './_components/FurnitureMenuBase/FurnitureMenuBase';

const BABYLON = require('@babylonjs/core');
const { OBJFileLoader } = require('@babylonjs/loaders');
const { useEffect, useRef } = require('react');

const { createBabylonScene }  = require('./_utils/loadBabylonScene');
const { objectInfoWindow } = require('./_utils/objectInfoWindow');
const { confirmPopupWindow } = require('./_utils/confirmationWindow');
const { applyDragBehavior } = require('./_utils/dragBehavior');
const { load3DFurniture } = require('./_utils/renderFurniture');
const { switchCamera } = require('./_utils/switchCamera');

export default function RenderPage() {
    
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const camerasRef = useRef([]);

    const selectedObjectRef = useRef(null);

    // Ensure the loader is activated
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
        if (plugin.name === "obj") {
            console.log("OBJ loader is now ready");
        };
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        };

        const { engine, scene, camera1, camera2, light } = createBabylonScene(canvas)

        sceneRef.current = scene;
        camerasRef.current = [camera1, camera2];

        // Creating Objects ----------------------------------------------------------------------------------------------------------

        createFloor(scene);

        scene.gravity = new BABYLON.Vector3(0, -0.1, 0);
        scene.collisionsEnabled = true;

        loadCustomObj(scene);

        // -----------------------------------------------------------------------------------------------------------------------------

        scene.onPointerDown = (event, pickResult) => {
            if(pickResult.hit) {
                selectedObjectRef.current = pickResult.pickedMesh;

                objectInfoWindow(scene, selectedObjectRef.current);
                console.log(`Selected object is now: ${selectedObjectRef.current.name}`);
            };
        };

        // -----------------------------------------------------------------------------------------------------------------------------

        const rotateSelectedObject  = () => {
            if(selectedObjectRef.current) {
                const objectToRotate = selectedObjectRef.current;

                const angularVelocity = new BABYLON.Vector3(0, Math.PI / 15, 0);
                objectToRotate.physicsImpostor.setAngularVelocity(angularVelocity);
            } else {
                console.log('No object selected');
            };
        };

        const handleKeyDown = (event) => {
            //console.log(`Key pressed: ${event.key}`);
            if (event.key === 'r' || event.key === 'R') {
                rotateSelectedObject();
            };
        };

        window.addEventListener('keydown', handleKeyDown);

        // -----------------------------------------------------------------------------------------------------------------------------

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            scene.dispose();
            engine.dispose();
        };
    }, []);

    // -----------------------------------------------------------------------------------------------------------------------------

    const switchCameraHandle = () => {
        switchCamera(sceneRef.current, canvasRef.current, camerasRef.current);
    };

    // -----------------------------------------------------------------------------------------------------------------------------

    const createTempFurnitureHandle = () => {
        if(sceneRef.current) {
            const loadedObject = load3DFurniture(sceneRef.current);
            applyDragBehavior(loadedObject, sceneRef.current);
        } else {
            console.log("scene is not initialized");
        };
    };

    // -----------------------------------------------------------------------------------------------------------------------------

    return (
        <div>
            <h1>Babylon.js Cube Test</h1>    
            {/* Rendering 3D Scene Here */}
            <BabylonScene />
            <button onClick={switchCameraHandle} style={{ marginTop: '20px' }}>SwitchCamera</button>
            <button onClick={createTempFurnitureHandle} style={{ marginTop: '40px' }}>CreateTempShape</button>
            <button onClick={confirmPopupWindow} style={{ marginTop: '60px' }}>PopupButton</button>
            <FurnitureMenuBase />
        </div>
    );
};



