const BABYLON = require('@babylonjs/core');
const CANNON = require('cannon');

const createBabylonScene = (canvas) => {

    const engine = new BABYLON.Engine(canvas, true, {
                preserveDrawingBuffer: true,
                stencil: true,
                antialias: false,
    });

    const scene = new BABYLON.Scene(engine);

    // Creating Cameras ----------------------------------------------------------------------------------------------------------

    const camera1 = new BABYLON.ArcRotateCamera(
        'camera1',
        Math.PI / 2,
        Math.PI / 2,
        5,
        BABYLON.Vector3.Zero(),
        scene
    );
    camera1.attachControl(canvas, true);
    
    const camera2 = new BABYLON.UniversalCamera("camera2", new BABYLON.Vector3(0, 1, -10), scene);
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
    
    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });

    return { engine, scene, camera1, camera2, light };
};

module.exports = { createBabylonScene };