'use client';

const BABYLON = require('@babylonjs/core');
const { useEffect } = require('react');

export default function RenderPage() {
    
    useEffect(() => {

        const canvas = document.getElementById('renderCanvas');
        if (!canvas) {
            return;
        };

        const engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: false,
        });

        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera(
            'camera1',
            Math.PI / 2,
            Math.PI / 2,
            5,
            BABYLON.Vector3.Zero(),
            scene
        );
        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight('light1', BABYLON.Vector3.Up(), scene);

        const cube = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, scene);
        cube.position.y = 1;
        
        const dragBehavior = new BABYLON.PointerDragBehavior();
        cube.addBehavior(dragBehavior);

        dragBehavior.onDragStartObservable.add(() => {
            cube.material = new BABYLON.StandardMaterial("dragMaterial", scene);
            cube.material.diffuseColor = BABYLON.Color3.Green();
        });

        dragBehavior.onDragEndObservable.add((event) => {
            console.log('Drag ended!');
            cube.material = new BABYLON.StandardMaterial("defaultMaterial", scene);
            cube.material.diffuseColor  = BABYLON.Color3.White();

            const finalPosition = cube.position;
            console.log('Final position of the object:', finalPosition);
        });

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });

        return () => {
            engine.dispose();
        };
    }, []);

    return (
        <div>
            <h1>Babylon.js Cube Test</h1>    
            {/* Rendering 3D Scene Here */}
            <canvas id="renderCanvas" style={{ width: '100%', height: '100%'}} />
        </div>
    );
};