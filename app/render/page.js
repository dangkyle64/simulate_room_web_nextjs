'use client';

const BABYLON = require('@babylonjs/core');
const CANNON = require('cannon');
const { OBJFileLoader } = require('@babylonjs/loaders');
const GUI = require('@babylonjs/gui');
const { useEffect, useRef } = require('react');

export default function RenderPage() {
    
    const canvasRef = useRef(null);
    const selectedObjectRef = useRef(null);
    let engine;
    let scene;
    let camera1;
    let camera2;


    // Ensure the loader is activated
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
        if (plugin.name === "obj") {
            console.log("OBJ loader is now ready");
        }
    });

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

        // Creating Cameras ----------------------------------------------------------------------------------------------------------
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

        // Creating Lights ----------------------------------------------------------------------------------------------------------
        const light = new BABYLON.HemisphericLight('light1', BABYLON.Vector3.Up(), scene);

        // Creating Physics ----------------------------------------------------------------------------------------------------------
        window.CANNON = CANNON;
        scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

        // Creating Objects ----------------------------------------------------------------------------------------------------------
        const { cube1, cube2, cube3 } = createFurniture(scene);

        cube1.physicsImpostor = new BABYLON.PhysicsImpostor(cube1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);
        cube2.physicsImpostor = new BABYLON.PhysicsImpostor(cube2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);
        cube3.physicsImpostor = new BABYLON.PhysicsImpostor(cube3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);

        scene.gravity = new BABYLON.Vector3(0, -0.1, 0);
        scene.collisionsEnabled = true;
        cube3.isPickable = false;

        loadCustomObj(scene);

        // Call Drag Behavior ----------------------------------------------------------------------------------------------------------
        dragBehaviorService(cube1, cube2, scene);

        scene.onPointerDown = (event, pickResult) => {
            if(pickResult.hit) {
                selectedObjectRef.current = pickResult.pickedMesh;

                console.log(`Selected object is now: ${selectedObjectRef.current.name}`);
            };
        };

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

        const animate = () => {
            scene.render();
        };

        engine.runRenderLoop(animate);

        window.addEventListener('resize', () => {
            engine.resize();
        });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
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
            scene.activeCamera.speed = 1.0;  // Adjust movement speed
            scene.activeCamera.inertia = 0.9; // Adjust inertia (smoothness of movement)
        };
        canvasRef.current.focus();
    };

    return (
        <div>
            <h1>Babylon.js Cube Test</h1>    
            {/* Rendering 3D Scene Here */}
            <canvas ref = {canvasRef} id="renderCanvas" style={{ width: '100%', height: '100%'}} />
            <button onClick={switchCamera} style={{ marginTop: '20px' }}>SwitchCamera</button>
            <button onClick={createTempFurniture} stype={{ marginTop: '40px' }}>CreateTempShape</button>
        </div>
    );
};

const createFurniture = (scene) => {
    const cube1 = BABYLON.MeshBuilder.CreateBox('box1', { size: 2 }, scene);
    cube1.position.set(0, 55, 0);

    const cube2 = BABYLON.MeshBuilder.CreateBox('box2', { size: 2 }, scene);
    cube2.position.set(0, 50, 0);

    const cube3 = BABYLON.MeshBuilder.CreateBox('box3', { width: 30, height: 1, depth: 30 }, scene);
    cube3.position.set(0, -1, 0);

    // Properties of the cubes
    cube1.material = new BABYLON.StandardMaterial("cubeMaterial1", scene);
    cube1.material.diffuseColor  = BABYLON.Color3.Blue();
    cube1.checkCollisions = true;

    cube2.material = new BABYLON.StandardMaterial("cubeMaterial2", scene);
    cube2.material.diffuseColor  = BABYLON.Color3.Green();
    cube2.checkCollisions = true; 

    cube3.material = new BABYLON.StandardMaterial("cubeMaterial3", scene);
    cube3.material.diffuseColor  = BABYLON.Color3.White();
    cube3.checkCollisions = true; 

    return { cube1, cube2, cube3 };
};

const dragBehaviorService = (cube1, cube2, scene) => {

    const dropSound = new BABYLON.Sound("dropSound", "/sounds/metal_pipe.mp3", scene, null, {
        loop: false,
        autoplay: false,
    });

    const dragBehavior = new BABYLON.PointerDragBehavior();
    cube1.addBehavior(dragBehavior);

    const dragBehavior2 = new BABYLON.PointerDragBehavior();
    cube2.addBehavior(dragBehavior2);

    dragBehavior.onDragStartObservable.add(() => {
        cube1.material = new BABYLON.StandardMaterial("dragMaterial", scene);
        cube1.material.diffuseColor = BABYLON.Color3.Green();
    });

    dragBehavior2.onDragStartObservable.add(() => {
        cube2.material = new BABYLON.StandardMaterial("dragMaterial2", scene);
        cube2.material.diffuseColor = BABYLON.Color3.Blue();
    });

    dragBehavior.onDragEndObservable.add((event) => {
        //console.log('Drag ended!');
        cube1.material = new BABYLON.StandardMaterial("defaultMaterial", scene);
        cube1.material.diffuseColor  = BABYLON.Color3.White();

        const finalPosition = cube1.position;
        console.log('Final position of the object1:', finalPosition);

        if (!dropSound.isPlaying) {
            //dropSound.play();
        };
    });

    dragBehavior2.onDragEndObservable.add((event) => {
        //console.log('Drag ended!');
        cube2.material = new BABYLON.StandardMaterial("defaultMaterial", scene);
        cube2.material.diffuseColor  = BABYLON.Color3.White();

        const finalPosition2 = cube2.position;
        console.log('Final position of the object2:', finalPosition2);

        if (!dropSound.isPlaying) {
            //dropSound.play();
        };
    });
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

        //meshes.forEach(mesh => {
        //    mesh.position = new BABYLON.Vector3(0, 0, 0);
        //});

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
        
        });

        dragBehaviorSofa.onDragEndObservable.add((event) => {
            sofa.material = new BABYLON.StandardMaterial("defaultMaterial", scene);
            sofa.material.diffuseColor  = BABYLON.Color3.White();
            
            sofa.physicsImpostor.mass = 1;
            sofa.physicsImpostor.isKinematic = false;

            const finalPosition = sofa.position;
            console.log('Final position of the object1:', finalPosition);
        });

        sofa.checkCollisions = true;
        sofa.physicsImpostor = new BABYLON.PhysicsImpostor(sofa, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 0.5 }, scene);
    
    } catch(error) {
        console.error("Error loading .obj file", error);
    };
};

const popUpScreen = (scene) => {
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    var popUpWindow = new GUI.StackPanel();
    popUpWindow.width = "300px";
    popUpWindow.height = "200px";
    popUpWindow.top = "20%";
    popUpWindow.left = "35%";
    popUpWindow.isHitTestVisible = true;
    popUpWindow.background = "rgba(0, 0, 0, 0.7)";

    advancedTexture.addControl(popUpWindow);

    var contentText = new GUI.TextBlock();
    contentText.text = "Here content";
    contentText.color = "white";
    popUpWindow.addControl(contentText);

    var closeButton = GUI.Button.CreateSimpleButton("closeButton", "Close");
    closeButton.width = "100px";
    closeButton.height = "40px";
    closeButton.top = "150px";
    closeButton.background = "red";
    closeButton.onPointerUpObservable.add(function() {
        popUpWindow.isVisible = false;
    });

    popUpWindow.addControl(closeButton);
};

const createTempFurniture = (scene) => {
    console.log('Function createTempFurniture');
    popUpScreen();
};