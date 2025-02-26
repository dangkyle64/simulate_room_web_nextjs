const BABYLON = require('@babylonjs/core');
const { OBJFileLoader } = require('@babylonjs/loaders');
const { useEffect, useRef } = require('react');

const { createBabylonScene }  = require('../../_utils/loadBabylonScene');
const { objectInfoWindow } = require('../../_utils/objectInfoWindow');
const { confirmPopupWindow } = require('../../_utils/confirmationWindow');
const { applyDragBehavior } = require('../../_utils/dragBehavior');
const { load3DFurniture } = require('../../_utils/renderFurniture');
const { switchCamera } = require('../../_utils/switchCamera');

import styles from './BabylonScene.module.css'; 

const BabylonScene = () => {
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

const loadCustomObj = async (scene) => {
    try {
        const path = '/assets/';
        const fileName = 'sofa1.obj';

        const result = await BABYLON.SceneLoader.ImportMeshAsync(
            "",
            path,
            fileName,
            scene,
        );

        const meshes = result.meshes;
        console.log('Loaded meshes: ', meshes);

        const sofa = meshes[0];

        sofa.refreshBoundingInfo();

        sofa.position.y = sofa.getBoundingInfo().boundingBox.maximum.y;

        const dragBehaviorSofa = new BABYLON.PointerDragBehavior();
        sofa.addBehavior(dragBehaviorSofa); 

        dragBehaviorSofa.onDragStartObservable.add(() => {
            sofa.material = new BABYLON.StandardMaterial("dragMaterial", scene);
            sofa.material.diffuseColor = BABYLON.Color3.Green();

            sofa.physicsImpostor.mass = 0;
            sofa.physicsImpostor.isKinematic = true;
            
            sofa.checkCollisions = true;
        });

        dragBehaviorSofa.onDragEndObservable.add((event) => {
            sofa.material = new BABYLON.StandardMaterial("defaultMaterial", scene);
            sofa.material.diffuseColor  = BABYLON.Color3.White();
            
            sofa.physicsImpostor.mass = 1;
            sofa.physicsImpostor.isKinematic = false;

            const finalPosition = sofa.position;
            console.log('Final position of the object1:', finalPosition);

            sofa.checkCollisions = true;
        });

        sofa.physicsImpostor = new BABYLON.PhysicsImpostor(sofa, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 0.5 }, scene);
    
    } catch(error) {
        console.error("Error loading .obj file", error);
    };
};

module.exports = { BabylonScene };