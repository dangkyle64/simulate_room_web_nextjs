'use client';

const BABYLON = require('@babylonjs/core');
const { useEffect, useRef, useState } = require('react');

export default function RenderPage() {
    
    const canvasRef = useRef(null);
    const selectedObjectRef = useRef(null);
    let engine;
    let scene;
    let camera1;
    let camera2;

    useEffect(() => {

        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        };

        engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: false,
        });

        scene = new BABYLON.Scene(engine);

        camera1 = new BABYLON.ArcRotateCamera(
            'camera1',
            Math.PI / 2,
            Math.PI / 2,
            5,
            BABYLON.Vector3.Zero(),
            scene
        );
        camera1.attachControl(canvas, true);

        camera2 = new BABYLON.UniversalCamera("camera2", new BABYLON.Vector3(0, 1, -10), scene);
        camera2.setTarget(BABYLON.Vector3.Zero());
        camera2.attachControl(canvas, true);

        camera2.speed = 0.5;
        camera2.angularSensibility = 1000;

        scene.activeCamera = camera1;

        const light = new BABYLON.HemisphericLight('light1', BABYLON.Vector3.Up(), scene);

        const { cube1, cube2 } = createFurniture(scene);

        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 30, height: 30 }, scene);
        ground.position.y = -1; 
        ground.isPickable = false;
        
        cube1.checkCollisions = true;
        cube2.checkCollisions = true; 
        ground.checkCollisions = true;

        scene.gravity = new BABYLON.Vector3(0, -0.1, 0);

        scene.collisionsEnabled = true;

        selectedObjectRef.current = cube1;

        const dropObject = () => {
            if(selectedObjectRef.current) {
                const droppedObject = selectedObjectRef.current;

                droppedObject.position.y -= 0.1;

                droppedObject.computeWorldMatrix(true);

                if (droppedObject.intersectsMesh(cube2) && droppedObject !== cube2) {
                    console.log('Cube1 Collided with Cube2');
                    droppedObject.position.y = cube2.position.y + 2;
                };

                if (droppedObject.position.y <= ground.position.y + 1) {
                    console.log('Cube1 hit the ground');
                    droppedObject.position.y = ground.position.y + 1;
                };
            };
        };

        const dragBehavior = new BABYLON.PointerDragBehavior();
        cube1.addBehavior(dragBehavior);

        const dragBehavior2 = new BABYLON.PointerDragBehavior();
        cube2.addBehavior(dragBehavior2);

        const dropSound = new BABYLON.Sound("dropSound", "/sounds/metal_pipe.mp3", scene, null, {
            loop: false,
            autoplay: false,
        });

        scene.onPointerDown = (event, pickResult) => {
            if(pickResult.hit) {
                selectedObjectRef.current = pickResult.pickedMesh;

                console.log(`Selected object is now: ${selectedObjectRef.current.name}`);
            };
        };

        const rotateSelectedObject  = () => {
            if(selectedObjectRef.current) {
                selectedObjectRef.current.rotate(BABYLON.Axis.Y, Math.PI / 180);
                //console.log(`Rotating object: ${selectObject.name}`);
            } else {
                console.log('No object selected');
            }
        };

        const handleKeyDown = (event) => {
            //console.log(`Key pressed: ${event.key}`);
            if (event.key === 'r' || event.key === 'R') {
                rotateSelectedObject();
            };
        };

        window.addEventListener('keydown', handleKeyDown);

        dragBehavior.onDragStartObservable.add(() => {
            cube1.material = new BABYLON.StandardMaterial("dragMaterial", scene);
            cube1.material.diffuseColor = BABYLON.Color3.Green();
        });

        dragBehavior2.onDragStartObservable.add(() => {
            cube2.material = new BABYLON.StandardMaterial("dragMaterial2", scene);
            cube2.material.diffuseColor = BABYLON.Color3.Blue();
        });

        dragBehavior.onDragEndObservable.add((event) => {
            console.log('Drag ended!');
            cube1.material = new BABYLON.StandardMaterial("defaultMaterial", scene);
            cube1.material.diffuseColor  = BABYLON.Color3.White();

            const finalPosition = cube1.position;
            console.log('Final position of the object1:', finalPosition);

            if (!dropSound.isPlaying) {
                //dropSound.play();
            };
        });

        dragBehavior2.onDragEndObservable.add((event) => {
            console.log('Drag ended!');

            cube2.material = new BABYLON.StandardMaterial("defaultMaterial", scene);
            cube2.material.diffuseColor  = BABYLON.Color3.White();

            const finalPosition2 = cube2.position;
            console.log('Final position of the object2:', finalPosition2);

            if (!dropSound.isPlaying) {
                //dropSound.play();
            };
        });

        const animate = () => {
            dropObject();
            scene.render();
        };

        engine.runRenderLoop(animate);

        window.addEventListener('resize', () => {
            engine.resize();
        });

        return () => {
            //window.removeEventListener('keydown', handleKeyDown);
            scene.dispose();
            engine.dispose();
        };
    }, []);

    const switchCamera = () => {
        scene.activeCamera.detachControl(canvasRef.current);

        if (scene.activeCamera === camera1) {
            scene.activeCamera = camera2;
        } else {
            scene.activeCamera = camera1;
        };

        scene.activeCamera.attachControl(canvasRef.current, true);

        if (scene.activeCamera instanceof BABYLON.UniversalCamera) {
            console.log('rah')
            scene.activeCamera.speed = 1.0;  // Adjust movement speed
            scene.activeCamera.inertia = 0.9; // Adjust inertia (smoothness of movement)
        }

        canvasRef.current.focus();
    };
    return (
        <div>
            <h1>Babylon.js Cube Test</h1>    
            {/* Rendering 3D Scene Here */}
            <canvas ref = {canvasRef} id="renderCanvas" style={{ width: '100%', height: '100%'}} />
            <button onClick={switchCamera} style={{ marginTop: '20px' }}>SwitchCamera</button>
        </div>
    );
};

const createFurniture = (scene) => {
    const cube1 = BABYLON.MeshBuilder.CreateBox('box1', { size: 2}, scene);
    cube1.position.set(0, 5, 0);

    const cube2 = BABYLON.MeshBuilder.CreateBox('box2', { size: 2}, scene);
    cube2.position.set(10, 5, 0);

    cube1.material = new BABYLON.StandardMaterial("cubeMaterial1", scene);
    cube1.material.diffuseColor  = BABYLON.Color3.Blue();

    cube2.material = new BABYLON.StandardMaterial("cubeMaterial2", scene);
    cube2.material.diffuseColor  = BABYLON.Color3.Green();

    return { cube1, cube2 };
};