'use client';

const BABYLON = require('@babylonjs/core');
const CANNON = require('cannon');
const { OBJFileLoader } = require('@babylonjs/loaders');
const GUI = require('@babylonjs/gui');
const { useEffect, useRef } = require('react');

const { createBabylonScene }  = require('./_utils/loadBabylonScene');
const { objectInfoWindow } = require('./_utils/objectInfoWindow');
const { confirmPopupWindow } = require('./_utils/confirmationWindow');
const { applyDragBehavior } = require('./_utils/dragBehavior');
const { load3DFurniture } = require('./_utils/renderFurniture');

export default function RenderPage() {
    
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
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

    const switchCamera = () => {
        scene.activeCamera.detachControl(canvasRef.current);

        if (scene.activeCamera === camera1) {
            scene.activeCamera = camera2;
        } else {
            scene.activeCamera = camera1;
        };

        scene.activeCamera.attachControl(canvasRef.current, true);

        if (scene.activeCamera instanceof BABYLON.UniversalCamera) {
            scene.activeCamera.speed = 1.0;  // Adjust movement speed
            scene.activeCamera.inertia = 0.9; // Adjust inertia (smoothness of movement)
        };
        canvasRef.current.focus();
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
            <canvas ref = {canvasRef} id="renderCanvas" style={{ width: '100%', height: '100%'}} />
            <button onClick={switchCamera} style={{ marginTop: '20px' }}>SwitchCamera</button>
            <button onClick={createTempFurnitureHandle} style={{ marginTop: '40px' }}>CreateTempShape</button>
            <button onClick={confirmPopupWindow} style={{ marginTop: '60px' }}>PopupButton</button>
            
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
