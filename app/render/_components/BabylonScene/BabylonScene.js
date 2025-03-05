import * as BABYLON from '@babylonjs/core';
import { useEffect } from 'react';

import { createBabylonScene } from '../../_utils/createBabylonScene';
import { objectInfoWindow } from '../../_utils/utils_modals/objectInfoWindow';
import { confirmPopupWindow } from '../../_utils/utils_modals/confirmationWindow';
import { applyDragBehavior } from '../../_utils/dragBehavior';
import { load3DFurniture } from '../../_utils/renderFurniture';
import { switchCamera } from '../../_utils/switchCamera';

import { useBabylonSceneState } from '../../_hooks/useBabylonSceneState';
import { loadCustomObjFile } from '../../_utils/loadCustomObjFile';
import { FurnitureMenu } from '../FurnitureMenu/FurnitureMenu';
import styles from './BabylonScene.module.css'; 

export const BabylonScene = () => {
    const { 
        canvasRef, 
        sceneRef, 
        camerasRef, 
        selectedObjectRef, 
        setCanvas, 
        setScene, 
        setCameras, 
        setSelectedObject 
    } = useBabylonSceneState();

    useEffect(() => {
        const canvasElement = document.getElementById('renderCanvas');
        if (canvasElement) {
            setCanvas(canvasElement);
        };

        const { engine, scene, camera1, camera2, light } = createBabylonScene(canvasRef.current)

        setScene(scene);
        
        const cameraArray = [camera1, camera2]
        setCameras(cameraArray);

        // Creating Objects ----------------------------------------------------------------------------------------------------------

        createFloor(scene);
        loadCustomObjFile('', sceneRef.current);
        FurnitureMenu(scene)

        // -----------------------------------------------------------------------------------------------------------------------------

        scene.onPointerDown = (event, pickResult) => {
            if(pickResult.hit) {
                setSelectedObject(pickResult.pickedMesh);

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
        switchCamera(sceneRef.current, canvasRef, camerasRef.current);
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
        <div className={styles['canvas-container']}> 
            <canvas ref = {canvasRef} id="renderCanvas" className={styles['canvas']} />
        </div>
    );
};

const createFloor = (scene) => {
    const floor = BABYLON.MeshBuilder.CreateBox('floor', { width: 50, height: 1, depth: 50 }, scene);
    floor.position.set(0, -1, 0);

    floor.material = new BABYLON.StandardMaterial("floorMaterial", scene);
    floor.material.diffuseColor = BABYLON.Color3.White();
    floor.checkCollisions = true; 

    floor.physicsImpostor = new BABYLON.PhysicsImpostor(floor, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
    floor.isPickable = false;
};
